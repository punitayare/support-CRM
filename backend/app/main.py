from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from auth.dependencies import get_current_user

from .database import engine
from .models import Base
from .routers.tickets import router as ticket_router
from auth.users import router as user_router  # ✅ ADD THIS
from auth.auth import router as auth_router   # ✅ ADD THIS
from fastapi import FastAPI
from app.database import SessionLocal
from app.models import User
from auth.security import hash_password


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Support CRM API")
@app.on_event("startup")
def create_admin():
    db = SessionLocal()

    admin = db.query(User).filter(User.email == "admin@demo.com").first()

    if not admin:
        admin = User(
            name="Demo Admin",
            email="admin@demo.com",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()

    db.close()
app.include_router(ticket_router)
app.include_router(auth_router)  #
app.include_router(user_router)  # 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Support CRM Running"}



@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": user
    }