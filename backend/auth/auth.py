from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User

from auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

from pydantic import BaseModel
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ IMPORTANT: Swagger OAuth2 config
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-form")


# -----------------------
# SCHEMAS
# -----------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# -----------------------
# DB SESSION
# -----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------
# REGISTER
# -----------------------
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role="customer"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}


# -----------------------
# LOGIN (FRONTEND JSON LOGIN)
# -----------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


# -----------------------
# LOGIN (SWAGGER ONLY FIX)
# -----------------------
@router.post("/login-form")
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Swagger OAuth login requires:
    - username field (we treat it as email)
    - password field
    """

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# -----------------------
# TEST ENDPOINT (IMPORTANT FOR SWAGGER AUTH)
# -----------------------
@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    return {
        "message": "Swagger auth working",
        "token_received": token
    }