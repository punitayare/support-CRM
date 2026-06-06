from fastapi import FastAPI

from .database import engine
from .models import Base

from .routers.tickets import router as ticket_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Support CRM API"
)

app.include_router(ticket_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {
        "message": "Support CRM Running"
    }