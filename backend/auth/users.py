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
        raise HTTPException(404, "User not found")

    db_user.role = data.new_role   # ✅ FIX HERE
    db.commit()

    return {"message": "Role updated"}