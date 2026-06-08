from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, SessionLocal
from app.models import Base, User

from app.routers.tickets import router as ticket_router
from auth.auth import router as auth_router
from auth.users import router as user_router

from auth.dependencies import get_current_user
from auth.security import hash_password

import traceback

# -----------------------
# DB INIT
# -----------------------
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Support CRM API")

# -----------------------
# CORS CONFIG
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://support-crm-eta.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# ROUTERS
# -----------------------
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(ticket_router)

# -----------------------
# HOME ROUTE
# -----------------------
@app.get("/")
def home():
    return {"message": "Support CRM Running"}

# -----------------------
# STARTUP: CREATE ADMIN
# -----------------------
@app.on_event("startup")
def create_admin():
    db = SessionLocal()
    try:
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
            db.refresh(admin)

            print("✅ Admin created successfully")

    except Exception as e:
        print("❌ Admin creation failed:", str(e))
        traceback.print_exc()

    finally:
        db.close()

# -----------------------
# TEST PROTECTED ROUTE
# -----------------------
@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": user
    }