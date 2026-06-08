# 🧩 Support CRM System (Full Stack)

A production-ready **Customer Support Ticketing System** built with:

- ⚡ FastAPI (Backend)
- ⚛️ React (Frontend)
- 🐘 PostgreSQL (Render Cloud DB)
- 🧠 SQLAlchemy ORM
- 🔐 JWT Authentication + Role-Based Access Control (RBAC)

This project simulates a real-world SaaS support system where users raise tickets, admins assign them, and agents resolve them.

---

# 🌐 Live System Architecture

## 🏗️ High-Level Architecture
            ┌──────────────────────────────┐
            │      React Frontend          │
            │      (Vercel Hosted)         │
            │  - Dashboard UI              │
            │  - Ticket Management         │
            └─────────────┬────────────────┘
                          │  Axios / REST API
                          ▼
            ┌──────────────────────────────┐
            │      FastAPI Backend         │
            │      (Render Hosted)         │
            │  - Auth (JWT)                │
            │  - RBAC Middleware           │
            │  - Ticket APIs               │
            └─────────────┬────────────────┘
                          │ SQLAlchemy ORM
                          ▼
            ┌──────────────────────────────┐
            │   PostgreSQL Database        │
            │   (Render Cloud DB)          │
            │  - Users                     │
            │  - Tickets                  │
            │  - Roles                    │
            └──────────────────────────────┘


---

# 📁 Project Structure

## 🖥️ Backend Structure

![Backend Structure](sandbox:/mnt/data/01f77e6e-ba0a-48d0-9cee-4a946a2743a8.png)
backend/
│
├── app/
│ ├── auth/
│ │ ├── auth.py
│ │ ├── dependencies.py
│ │ ├── security.py
│ │ └── users.py
│ │
│ ├── routers/
│ │ ├── tickets.py ← MAIN CRM LOGIC
│ │ ├── users.py
│ │ └── auth.py
│ │
│ ├── database.py
│ ├── models.py
│ ├── schemas.py
│ ├── crud.py
│ └── main.py
│
├── requirements.txt
└── .env


---

## 🎨 Frontend Structure

![Frontend Structure](sandbox:/mnt/data/53f396ac-f674-4469-876a-29cb0b4d0ec7.png)
frontend/
│
├── src/
│ ├── api/
│ │ └── api.js
│ │
│ ├── components/
│ │ ├── Header.jsx
│ │ ├── SideBar.jsx
│ │ ├── SearchBar.jsx
│ │ ├── StatsCards.jsx
│ │ ├── TicketTable.jsx
│ │ └── TicketDetailsDrawer.jsx
│ │
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Tickets.jsx
│ │ ├── MyTickets.jsx
│ │ ├── AgentTickets.jsx
│ │ ├── AssignTickets.jsx
│ │ └── UsersAdmin.jsx
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── App.css
│
├── package.json
└── vite.config.js


---

# 🚀 Features

## 🔐 Authentication System
- User Registration
- Secure Login using JWT
- Role-based access:
  - 👤 Customer
  - 🧑‍💼 Agent
  - 🛠️ Admin

---

## 🎫 Ticket System (Core Feature)

### Customers can:
- Create tickets
- View only their tickets
- Track status updates

### Agents can:
- View assigned tickets only
- Update ticket status
- Add resolution notes

### Admins can:
- View all tickets
- Assign tickets to agents
- Delete tickets

---

## 🔍 Smart Filtering & Search
- Filter by status (Open / In Progress / Resolved)
- Search by:
  - Subject
  - Customer name
  - Email
  - Ticket ID

---

## 👨‍💼 Admin Control Panel
- Manage users
- Assign agents to tickets
- Full system visibility

---

# 🔌 Backend API Reference

## 🔐 Auth APIs
POST /api/auth/register
POST /api/auth/login


---

## 🎫 Ticket APIs

### Create Ticket

POST /api/tickets/


### Get Tickets (Role-aware)

GET /api/tickets/


### Get Single Ticket

GET /api/tickets/{ticket_id}


### Update Ticket (Agent/Admin)

PUT /api/tickets/{ticket_id}


### Delete Ticket (Admin Only)

DELETE /api/tickets/{ticket_id}


### Assign Ticket (Admin Only)

PUT /api/tickets/{ticket_id}/assign?agent_id=1


---

# 🧠 Core Backend Logic (Important)

## 🔹 Role-Based Filtering
- Customers → only their tickets
- Agents → only assigned tickets
- Admin → all tickets

---

## 🔹 Access Control Example
```python
if user["role"] == "customer":
    query = query.filter(Ticket.user_id == user["user_id"])

elif user["role"] == "agent":
    query = query.filter(Ticket.assigned_to == user["user_id"])
🔹 Search Logic
Uses SQLAlchemy ilike()
Searches across:
subject
customer_name
email
ticket_id
🗄️ Database Schema
Users Table
id
name
email
password (hashed)
role
Tickets Table
ticket_id
subject
status
customer_name
customer_email
user_id
assigned_to
created_at
updated_at
🔐 Authentication Flow
Login Request
     ↓
JWT Token Generated
     ↓
Stored in LocalStorage
     ↓
Sent via Axios Headers
     ↓
Backend validates token
     ↓
Role-based access granted
⚙️ Deployment
🚀 Backend (Render)
FastAPI deployed via Uvicorn
PostgreSQL connected via Render DB
Environment variables required:
DATABASE_URL
SECRET_KEY

Run command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT
🌐 Frontend (Vercel)
React (Vite) deployed on Vercel
API base URL configured via environment variable:
VITE_API_URL = https://your-backend-url
🧪 Key Technical Highlights
⚡ SQLAlchemy ORM for database abstraction
🔐 JWT-based authentication
🧠 Role-Based Access Control (RBAC)
🔄 RESTful API architecture
📦 Modular backend (routes / crud / models / schemas)
🌍 Full cloud deployment (Render + Vercel)
📈 System Workflow
User → Creates Ticket
        ↓
Admin → Assigns Ticket
        ↓
Agent → Resolves Ticket
        ↓
User → Tracks Status
🚀 Future Enhancements
🔔 Real-time notifications (WebSockets)
📧 Email alerts for ticket updates
💬 Internal ticket chat system
📊 Analytics dashboard (charts)
⏱️ SLA timer tracking
📎 File attachments in tickets
🏁 Conclusion

This Support CRM is a full-stack production-grade system demonstrating:

Real-world backend engineering
Scalable database design
Secure authentication system
Role-based workflow automation
Cloud deployment architecture

It closely mimics enterprise-level customer support platforms.