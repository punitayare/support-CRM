from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
import traceback
from auth.security import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str
# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# REGISTER


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        existing = db.query(User).filter(User.email == data.email).first()

        if existing:
            return {"error": "exists"}

        user = User(
            name=data.name,
            email=data.email,
            hashed_password=hash_password(data.password),
            role="customer"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {"message": "ok"}

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        traceback.print_exc()
        return {"error": str(e)}
    




@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.hashed_password):
            return {"error": "invalid credentials"}

        token = create_access_token({
            "user_id": user.id,
            "role": user.role
        })

        return {"token": token}

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return {"error": str(e)}