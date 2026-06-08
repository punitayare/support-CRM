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
backend/
│── app/
│   │── main.py
│   │
│   │── core/
│   │   ├── config.py
│   │   ├── database.py
│   │
│   │── models/
│   │   ├── user.py
│   │   ├── ticket.py
│   │
│   │── schemas/
│   │   ├── user.py
│   │   ├── ticket.py
│   │
│   │── crud/
│   │   ├── user.py
│   │   ├── ticket.py
│   │
│   │── api/
│   │   │── routes/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── tickets.py
│   │
│   │── auth/
│   │   ├── jwt.py
│   │   ├── dependencies.py
│   │   ├── security.py
│
│── requirements.txt
│── .env



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
# 📌 Support CRM System

A full-stack **Customer Support Ticketing CRM System** built using **FastAPI, SQLAlchemy, PostgreSQL, and React (Vite)** with full **role-based access control (RBAC)** and cloud deployment (Render + Vercel).

---

## 🚀 Features

- 🔐 JWT Authentication
- 🧠 Role-Based Access Control (Customer / Agent / Admin)
- 🎫 Ticket Management System
- 🔍 Advanced Search (subject, email, ticket_id, name)
- 📊 Status Tracking (Open / In Progress / Resolved)
- 🌐 Full-stack deployment (Render + Vercel)

---

## 🗄️ Database Schema

### Users Table
```sql
id
name
email
password (hashed)
role
```

### Tickets Table
```sql
ticket_id
subject
status
customer_name
customer_email
user_id
assigned_to
created_at
updated_at
```

---

## 🔐 Role-Based Filtering Logic

```python
if user["role"] == "customer":
    query = query.filter(Ticket.user_id == user["user_id"])

elif user["role"] == "agent":
    query = query.filter(Ticket.assigned_to == user["user_id"])
```

---

## 🔍 Search Logic

Uses SQLAlchemy `ilike()` for flexible searching:

```python
query.filter(
    or_(
        Ticket.subject.ilike(f"%{search}%"),
        Ticket.customer_name.ilike(f"%{search}%"),
        Ticket.customer_email.ilike(f"%{search}%"),
        Ticket.ticket_id.ilike(f"%{search}%")
    )
)
```

---

## 🔐 Authentication Flow

```text
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
```

---

## ⚙️ Deployment

### 🚀 Backend (Render)

- FastAPI (Uvicorn)
- PostgreSQL (Render DB)

#### Environment Variables
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

#### Run Command
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

### 🌐 Frontend (Vercel)

- React (Vite)

#### Environment Variables
```env
VITE_API_URL=https://your-backend-url
```

---

## 🧪 Key Technical Highlights

```text
⚡ SQLAlchemy ORM
🔐 JWT Authentication
🧠 Role-Based Access Control (RBAC)
🔄 RESTful API Architecture
📦 Modular Backend Structure
🌍 Cloud Deployment (Render + Vercel)
```

---

## 📈 System Workflow

```text
User creates ticket
        ↓
Admin assigns ticket
        ↓
Agent resolves ticket
        ↓
User tracks status
```

---

## 🚀 Future Enhancements

```text
🔔 Real-time notifications (WebSockets)
📧 Email alerts for ticket updates
💬 Internal ticket chat system
📊 Analytics dashboard (charts)
⏱️ SLA tracking
📎 File attachments in tickets
```

---

## 🏁 Conclusion

This Support CRM is a **production-grade full-stack system** demonstrating:

- Real-world backend engineering
- Scalable database design
- Secure authentication system
- Role-based workflow automation
- Cloud deployment architecture

👉 It closely simulates enterprise-level customer support platforms.