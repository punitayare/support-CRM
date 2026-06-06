from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import TicketCreate
from ..schemas import TicketUpdate

from ..crud import (
    create_ticket,
    get_tickets,
    get_ticket,
    update_ticket,
    delete_ticket
)

router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)




@router.post("/")
def create_new_ticket(
    
    data: TicketCreate,
    db: Session = Depends(get_db)
):

    ticket = create_ticket(db, data)

    return {
        "ticket_id": ticket.ticket_id,
        "created_at": ticket.created_at
    }


@router.get("/")
def get_all_tickets(
    status: str = None,
    search: str = None,
    
    db: Session = Depends(get_db)
):

    tickets = get_tickets(
        db,
        status=status,
        search=search
    )

    return get_tickets(
    db,
    status=status,
    search=search
)



@router.get("/{ticket_id}")
def get_single_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):

    ticket = get_ticket(
        db,
        ticket_id
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket





@router.put("/{ticket_id}")
def update_existing_ticket(
    ticket_id: str,
    data: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = get_ticket(
        db,
        ticket_id
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    updated_ticket = update_ticket(
        db,
        ticket,
        data.status,
        data.note
    )

    return {
        "success": True,
        "updated_at": updated_ticket.updated_at
    }


@router.delete("/{ticket_id}")
def remove_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):
    
    ticket = get_ticket(
        db,
        ticket_id
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    delete_ticket(
        db,
        ticket
    )

    return {
        "success": True,
        "message": "Ticket deleted successfully"
    }