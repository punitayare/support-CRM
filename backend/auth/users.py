from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import RoleUpdate
from app.database import get_db
from app.models import User

from auth.dependencies import require_role

router = APIRouter(prefix="/api/users", tags=["Users"])
@router.get("/")
def get_all_users(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return db.query(User).all()


@router.put("/{user_id}/role")
def change_role(
    user_id: int,
    data: RoleUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    allowed_roles = ["admin", "agent", "customer"]

    if data.new_role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    db_user.role = data.new_role

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Role updated successfully",
        "user_id": db_user.id,
        "name": db_user.name,
        "role": db_user.role
    }