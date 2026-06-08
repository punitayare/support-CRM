from sqlalchemy import or_

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..schemas import TicketCreate, TicketUpdate
from ..models import Ticket, User
from ..crud import create_ticket, get_ticket, update_ticket, delete_ticket

from auth.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


# =========================================================
# 🟢 CREATE TICKET
# FRONTEND: Customer "Create Ticket" page / form
# ROLE: everyone
# =========================================================
@router.post("/")
def create_new_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    ticket = create_ticket(
        db,
        data,
        user["user_id"]
    )

    return {
        "ticket_id": ticket.ticket_id,
        "created_at": ticket.created_at
    }


# =========================================================
# 🟡 GET ALL TICKETS (ROLE-AWARE DASHBOARD VIEW)
# FRONTEND:
#   - Admin Dashboard → ALL tickets
#   - Customer Dashboard → ONLY their tickets
#   - Agent Dashboard → ONLY assigned tickets
# =========================================================
@router.get("/")
def get_all_tickets_route(
    status: str = None,
    search: str = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    query = db.query(Ticket).options(
        joinedload(Ticket.agent)  # needed for agent_name
    )

    # 🔐 ROLE FILTERING LOGIC
    if user["role"] == "customer":
        query = query.filter(Ticket.user_id == user["user_id"])

    elif user["role"] == "agent":
        query = query.filter(Ticket.assigned_to == user["user_id"])

    # optional filters
    if status:
        query = query.filter(Ticket.status == status)

    if search:
      query = query.filter(
    or_(
        Ticket.subject.ilike(f"%{search}%"),
        Ticket.customer_name.ilike(f"%{search}%"),
        Ticket.customer_email.ilike(f"%{search}%"),
        Ticket.ticket_id.ilike(f"%{search}%")
    )
)

    tickets = query.order_by(Ticket.created_at.desc()).all()

    # 🔁 RESPONSE USED BY TicketTable.jsx (ALL ROLES)
    return [
        {
            "ticket_id": t.ticket_id,
            "subject": t.subject,
            "status": t.status,
            "created_at": t.created_at,

            # UI DISPLAY FIELDS
            "customer_name": t.customer_name,
            "assigned_to": t.assigned_to,
            "agent_name": t.agent.name if t.agent else None,
        }
        for t in tickets
    ]


# =========================================================
# 🔵 CUSTOMER MY TICKETS (DEDICATED ENDPOINT)
# FRONTEND: MyTickets.jsx (CUSTOMER PAGE)
# =========================================================
@router.get("/my")
def get_my_tickets(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    if user["role"] != "customer":
        raise HTTPException(403, "Only customers allowed")

    tickets = (
        db.query(Ticket)
        .options(joinedload(Ticket.agent))
        .filter(Ticket.user_id == user["user_id"])
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return [
        {
            "ticket_id": t.ticket_id,
            "subject": t.subject,
            "status": t.status,
            "created_at": t.created_at,
            "customer_name": t.customer_name,
            "assigned_to": t.assigned_to,
            "agent_name": t.agent.name if t.agent else None,
            "description": t.description,
        }
        for t in tickets
    ]


# =========================================================
# 🟠 AGENT MY ASSIGNED TICKETS
# FRONTEND: AgentTickets.jsx
# =========================================================
@router.get("/agent/my")
def get_agent_tickets(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    if user["role"] != "agent":
        raise HTTPException(403, "Only agents allowed")

    tickets = (
        db.query(Ticket)
        .options(joinedload(Ticket.agent))
        .filter(Ticket.assigned_to == user["user_id"])
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return [
        {
            "ticket_id": t.ticket_id,
            "subject": t.subject,
            "status": t.status,
            "created_at": t.created_at,
            "customer_name": t.customer_name,
            "assigned_to": t.assigned_to,
            "agent_name": t.agent.name if t.agent else None,
        }
        for t in tickets
    ]


# =========================================================
# 🔍 GET SINGLE TICKET (DETAIL VIEW PAGE)
# FRONTEND: Ticket details modal/page
# =========================================================
@router.get("/{ticket_id}")
def get_single_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    ticket = get_ticket(db, ticket_id)

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    # access control
    if user["role"] == "customer" and ticket.user_id != user["user_id"]:
        raise HTTPException(403, "Not your ticket")

    if user["role"] == "agent" and ticket.assigned_to != user["user_id"]:
        raise HTTPException(403, "Not assigned ticket")

    return ticket


# =========================================================
# 🛠 UPDATE TICKET STATUS / NOTES
# FRONTEND: Agent dashboard (status update UI)
# =========================================================
@router.put("/{ticket_id}")
def update_existing_ticket(
    ticket_id: str,
    data: TicketUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("agent", "admin"))
):

    ticket = get_ticket(db, ticket_id)

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    # agent restriction
    if user["role"] == "agent" and ticket.assigned_to != user["user_id"]:
        raise HTTPException(403, "Not your assigned ticket")

    updated_ticket = update_ticket(db, ticket, data.status, data.note)

    return {
        "success": True,
        "updated_at": updated_ticket.updated_at
    }


# =========================================================
# 🔴 DELETE TICKET (ADMIN ONLY)
# FRONTEND: Admin TicketTable delete button
# =========================================================
@router.delete("/{ticket_id}")
def remove_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    ticket = get_ticket(db, ticket_id)

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    delete_ticket(db, ticket)

    return {
        "success": True,
        "message": "Ticket deleted successfully"
    }


# =========================================================
# 🟣 ASSIGN TICKET TO AGENT (ADMIN ONLY)
# FRONTEND: AssignTickets.jsx
# =========================================================
@router.put("/{ticket_id}/assign")
def assign_ticket(
    ticket_id: str,
    agent_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    agent = db.query(User).filter(User.id == agent_id).first()

    if not agent:
        raise HTTPException(404, "Agent not found")

    if agent.role != "agent":
        raise HTTPException(400, "User is not an agent")

    ticket.assigned_to = agent_id

    db.commit()
    db.refresh(ticket)

    return {
        "success": True,
        "ticket_id": ticket.ticket_id,
        "assigned_to": agent_id,
        "agent_name": agent.name
    }