from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from .models import Ticket, Note
from datetime import datetime
import uuid


# =========================================================
# 🟢 CREATE TICKET (WITH OWNER ATTACHED)
# USED BY: POST /api/tickets (Customer create ticket)
# =========================================================
def create_ticket(db: Session, data, user_id: int):

    ticket = Ticket(
        ticket_id=f"TKT-{str(uuid.uuid4())[:8]}",

        customer_name=data.customer_name,
        customer_email=data.customer_email,
        subject=data.subject,
        description=data.description,

        # 🔥 consistent status format
        status="open",

        # 🔥 OWNER (customer who created ticket)
        user_id=user_id,

        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


# =========================================================
# 🔵 GET ALL TICKETS (ADMIN / FILTER USE)
# USED BY: Admin dashboard / search / filtering
# =========================================================
def get_tickets(db: Session, status=None, search=None):

    query = db.query(Ticket).options(
        joinedload(Ticket.agent),   # agent name support
        joinedload(Ticket.notes)    # ticket comments
    )

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        query = query.filter(
            or_(
                Ticket.customer_name.contains(search),
                Ticket.customer_email.contains(search),
                Ticket.subject.contains(search),
                Ticket.description.contains(search),
                Ticket.ticket_id.contains(search)
            )
        )

    return query.order_by(Ticket.created_at.desc()).all()


# =========================================================
# 🔍 GET SINGLE TICKET
# USED BY: Ticket details page / modal
# =========================================================
def get_ticket(db: Session, ticket_id: str):

    return (
        db.query(Ticket)
        .options(
            joinedload(Ticket.notes),
            joinedload(Ticket.agent)
        )
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )


# =========================================================
# 🛠 UPDATE TICKET (STATUS + NOTES)
# USED BY: Agent dashboard update action
# =========================================================
def update_ticket(db: Session, ticket, status, note):

    # 🔥 normalize status
    if status:
        ticket.status = status.lower()

    ticket.updated_at = datetime.utcnow()

    # 📝 add internal note if provided
    if note:
        new_note = Note(
            ticket_ref=ticket.id,
            note_text=note,
            created_at=datetime.utcnow()
        )
        db.add(new_note)

    db.commit()
    db.refresh(ticket)

    return ticket


# =========================================================
# 🔴 DELETE TICKET
# USED BY: Admin dashboard delete button
# =========================================================
def delete_ticket(db: Session, ticket):

    db.delete(ticket)
    db.commit()

    return True