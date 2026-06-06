from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

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
    # ✅ ADD THIS (IMPORTANT FIX)
    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True)

    ticket_ref = Column(
        Integer,
        ForeignKey("tickets.id")
    )

    note_text = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    ticket = relationship(
        "Ticket",
        back_populates="notes"
    )