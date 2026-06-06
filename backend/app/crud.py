from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from .models import Ticket, Note
from datetime import datetime
import uuid



def create_ticket(db: Session, data):

    ticket = Ticket(
        ticket_id=f"TKT-{str(uuid.uuid4())[:8]}",  # ✅ SAFE UNIQUE ID
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        subject=data.subject,
        description=data.description,
        status="Open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket



def get_tickets(db: Session, status=None, search=None):

    query = db.query(Ticket)

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



def get_ticket(db: Session, ticket_id: str):
    return (
        db.query(Ticket)
        .options(joinedload(Ticket.notes))   # ✅ IMPORTANT FIX
        .filter(Ticket.ticket_id == ticket_id)
        .first()
    )



def update_ticket(db: Session, ticket, status, note):

    ticket.status = status
    ticket.updated_at = datetime.utcnow()

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


def delete_ticket(db: Session, ticket):

    db.delete(ticket)
    db.commit()

    return True