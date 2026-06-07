from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import uuid


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(
        String,
        unique=True,
        index=True,
        default=lambda: f"TKT-{str(uuid.uuid4())[:8]}"
    )

    customer_name = Column(String)
    customer_email = Column(String)
    subject = Column(String)
    description = Column(String)

    status = Column(String, default="Open")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 🔥 relationships
    user_id = Column(Integer, ForeignKey("users.id"))   # owner (customer)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)  # agent

    # 👇 IMPORTANT: add BOTH relationships
    owner = relationship("User", foreign_keys=[user_id])
    agent = relationship("User", foreign_keys=[assigned_to])

    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    ticket_ref = Column(Integer, ForeignKey("tickets.id"))

    note_text = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="notes")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer")

    created_at = Column(DateTime, default=datetime.utcnow)


class RoleUpdate(BaseModel):
     new_role: str