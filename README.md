# 🧩 Support CRM System (Full Stack)

A production-ready **Customer Support Ticketing System** built with:

- ⚡ FastAPI (Backend)
- ⚛️ React (Frontend)
- 🐘 PostgreSQL (Render Cloud DB)
- 🧠 SQLAlchemy ORM
- 🔐 JWT Authentication + Role-Based Access Control (RBAC)

This system simulates a real-world SaaS support platform where:
- Customers raise tickets
- Admins assign tickets
- Agents resolve tickets

---

# 🌐 System Architecture

## 🏗️ High-Level Architecture

```
            ┌──────────────────────────────┐
            │      React Frontend          │
            │      (Vercel Hosted)         │
            │  - Dashboard UI              │
            │  - Ticket Management         │
            └─────────────┬────────────────┘
                          │  REST API (Axios)
                          ▼
            ┌──────────────────────────────┐
            │      FastAPI Backend         │
            │      (Render Hosted)         │
            │  - JWT Auth                  │
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
            └──────────────────────────────┘
```

---

# 📁 Project Structure

## 🖥️ Backend Structure

```
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
│   │   ├── routes/
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
```

---

## 🎨 Frontend Structure

```
frontend/
│
├── src/
│   ├── api/
│   │   └── api.js
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SideBar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StatsCards.jsx
│   │   ├── TicketTable.jsx
│   │   └── TicketDetailsDrawer.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tickets.jsx
│   │   ├── MyTickets.jsx
│   │   ├── AgentTickets.jsx
│   │   ├── AssignTickets.jsx
│   │   └── UsersAdmin.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
│
├── package.json
└── vite.config.js
```

---

# 🚀 Core Features

## 🔐 Authentication
- JWT Login system
- Role-based access:
  - 👤 Customer
  - 🧑‍💼 Agent
  - 🛠️ Admin

---

## 🎫 Ticket System

### Customers:
- Create tickets
- View own tickets
- Track status

### Agents:
- View assigned tickets
- Update status
- Add resolution notes

### Admin:
- View all tickets
- Assign tickets
- Delete tickets

---

## 🔍 Search & Filtering
- Filter by status
- Search by:
  - Subject
  - Name
  - Email
  - Ticket ID

---

# 🔌 API Reference

## Auth APIs
```http
POST /api/auth/register
POST /api/auth/login
```

## Ticket APIs
```http
POST   /api/tickets/
GET    /api/tickets/
GET    /api/tickets/{ticket_id}
PUT    /api/tickets/{ticket_id}
DELETE /api/tickets/{ticket_id}
PUT    /api/tickets/{ticket_id}/assign?agent_id=1
```

---

# 🧠 Core Backend Logic

## 🔹 Role-Based Filtering

```python
if user["role"] == "customer":
    query = query.filter(Ticket.user_id == user["user_id"])

elif user["role"] == "agent":
    query = query.filter(Ticket.assigned_to == user["user_id"])
```

---

## 🔍 Search Logic

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

# 🔐 Authentication Flow

```
Login Request
   ↓
JWT Generated
   ↓
Stored in LocalStorage
   ↓
Sent via Axios Headers
   ↓
Backend Validates Token
   ↓
Role-Based Access Granted
```

---

# ⚙️ Deployment

## 🚀 Backend (Render)

- FastAPI (Uvicorn)
- PostgreSQL (Render DB)

### Environment Variables
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### Run Command
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🌐 Frontend (Vercel)

- React (Vite)

### Environment Variables
```env
VITE_API_URL=https://your-backend-url
```

---

# 🧪 Tech Stack

```
⚡ FastAPI
⚛️ React (Vite)
🐘 PostgreSQL
🧠 SQLAlchemy
🔐 JWT Auth
🌍 Render + Vercel
```

---

# 📈 System Workflow

```
User creates ticket
      ↓
Admin assigns ticket
      ↓
Agent resolves ticket
      ↓
User tracks status
```

---

# 🚀 Future Enhancements

```
🔔 WebSocket notifications
📧 Email alerts
💬 Internal chat system
📊 Analytics dashboard
⏱️ SLA tracking
📎 File attachments
```

---

# 🏁 Conclusion

A **production-grade CRM system** demonstrating:

- Real-world backend architecture
- Secure authentication system
- Scalable database design
- Role-based workflow automation
- Cloud deployment (Render + Vercel)