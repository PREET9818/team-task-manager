# 🚀 TaskFlow — Project Collaboration Platform

A modern **full-stack project management platform** built with Django and React that helps teams manage projects, assign tasks, and track productivity in real time.

---

## 📸 Features

- ✅ **Authentication** — JWT-based signup, login, logout, token refresh
- ✅ **Role-based Access** — Admin (full control) and Member (limited) roles
- ✅ **Project Management** — Create, edit, delete, track progress
- ✅ **Task Management** — Create, assign, filter, sort, update status
- ✅ **Dashboard Analytics** — Charts, stats, completion rates
- ✅ **Member Management** — Add/remove project members
- ✅ **Responsive UI** — Mobile-first, SaaS-quality design
- ✅ **REST API** — Full DRF-powered API with filtering, search, pagination
- ✅ **Railway Deployment** — Ready to deploy

---

## 🛠 Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Backend    | Django 4.2, Django REST Framework, SimpleJWT |
| Frontend   | React 18, Vite, Tailwind CSS               |
| Database   | PostgreSQL (prod) / SQLite (dev)           |
| Charts     | Recharts                                   |
| Auth       | JWT (access + refresh tokens)              |
| Deployment | Railway                                    |

---

## 📂 Project Structure

```
team-task-manager/
├── backend/
│   ├── apps/
│   │   ├── accounts/        # Custom user model, auth
│   │   ├── projects/        # Project CRUD, members
│   │   └── tasks/           # Task CRUD, dashboard API
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── railway.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios API client
    │   ├── components/
    │   │   ├── layout/      # Sidebar, Navbar, Layout
    │   │   ├── ui/          # Modal, Badge, StatCard, etc.
    │   │   ├── projects/    # ProjectCard, ProjectForm
    │   │   └── tasks/       # TaskRow, TaskForm
    │   ├── context/         # AuthContext
    │   ├── pages/           # All page components
    │   └── App.jsx
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env.example
```

---

## ⚡ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your values (SECRET_KEY, DATABASE_URL, etc.)

# Run migrations
python manage.py makemigrations accounts projects tasks
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Django Admin: **http://localhost:8000/admin**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend `.env`

```env
SECRET_KEY=your-super-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 👥 User Roles

| Feature                    | Admin | Member |
|----------------------------|-------|--------|
| Create/Edit/Delete Projects | ✅   | ❌     |
| Add/Remove Members          | ✅   | ❌     |
| Create/Edit/Delete Tasks    | ✅   | ❌     |
| Update own task status      | ✅   | ✅     |
| View dashboard              | ✅   | ✅     |
| View assigned projects      | ✅   | ✅     |

---

## 📡 API Documentation

### Authentication

| Method | Endpoint                | Description        |
|--------|-------------------------|--------------------|
| POST   | `/api/auth/register/`   | Create account     |
| POST   | `/api/auth/login/`      | Login, get tokens  |
| POST   | `/api/auth/logout/`     | Blacklist token    |
| POST   | `/api/auth/refresh/`    | Refresh access token |
| GET    | `/api/auth/me/`         | Get current user   |
| PATCH  | `/api/auth/me/`         | Update profile     |
| POST   | `/api/auth/change-password/` | Change password |

### Projects

| Method | Endpoint                        | Description         |
|--------|---------------------------------|---------------------|
| GET    | `/api/projects/`                | List projects       |
| POST   | `/api/projects/`                | Create project      |
| GET    | `/api/projects/:id/`            | Get project detail  |
| PUT    | `/api/projects/:id/`            | Update project      |
| PATCH  | `/api/projects/:id/`            | Partial update      |
| DELETE | `/api/projects/:id/`            | Delete project      |
| POST   | `/api/projects/:id/add_member/` | Add member          |
| POST   | `/api/projects/:id/remove_member/` | Remove member    |
| GET    | `/api/projects/stats/`          | Project statistics  |

### Tasks

| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| GET    | `/api/tasks/`               | List tasks          |
| POST   | `/api/tasks/`               | Create task         |
| GET    | `/api/tasks/:id/`           | Get task detail     |
| PUT    | `/api/tasks/:id/`           | Update task         |
| PATCH  | `/api/tasks/:id/`           | Partial update      |
| DELETE | `/api/tasks/:id/`           | Delete task         |
| PATCH  | `/api/tasks/:id/status/`    | Update status only  |
| GET    | `/api/tasks/dashboard/`     | Dashboard analytics |

### Users

| Method | Endpoint         | Description    |
|--------|------------------|----------------|
| GET    | `/api/users/`    | List all users |
| GET    | `/api/users/:id/`| Get user detail |

### Query Parameters (Tasks & Projects)

```
?search=keyword          # Full text search
?status=active           # Filter by status
?priority=high           # Filter by priority
?project=1               # Filter tasks by project
?assigned_to=2           # Filter tasks by assignee
?overdue=true            # Show only overdue tasks
?ordering=-created_at    # Sort (prefix - for descending)
?page=1                  # Pagination
```

---

## 🚂 Railway Deployment

### Deploy Backend

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select the **`backend`** folder as the root directory
3. Add a **PostgreSQL** plugin from Railway dashboard
4. Set these environment variables in Railway:

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend.railway.app
DATABASE_URL=<auto-set by Railway PostgreSQL plugin>
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app
CORS_ALLOW_ALL_ORIGINS=False
```

5. Railway auto-runs: `python manage.py migrate && python manage.py collectstatic`

### Deploy Frontend

1. In Railway → New Service → GitHub → select same repo
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npx serve -s dist -l $PORT`
5. Set environment variable:

```env
VITE_API_URL=https://your-backend.railway.app
```

6. Redeploy after setting the env var

---

## 🖥 GitHub Setup

```bash
# Initialize git
cd team-task-manager
git init
git add .
git commit -m "feat: initial commit — TaskFlow Team Task Manager"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git branch -M main
git push -u origin main
```

---

## 🧪 API Testing (Postman / curl)

### Register a user
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","first_name":"Admin","last_name":"User","password":"Test1234!","password2":"Test1234!","role":"admin"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test1234!"}'
```

### Create a project (with token)
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"First project","status":"active"}'
```

### Create a task
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Design homepage","project_id":1,"priority":"high","status":"pending"}'
```

---

## 🔧 Development Commands

```bash
# Backend
python manage.py makemigrations       # Create migrations
python manage.py migrate               # Apply migrations
python manage.py createsuperuser       # Create admin user
python manage.py collectstatic         # Collect static files
python manage.py shell                 # Django shell

# Frontend
npm run dev                            # Start dev server
npm run build                          # Production build
npm run preview                        # Preview production build
```

---

## 📄 License

MIT License — free to use, modify and distribute.

---

Built with ❤️ using Django + React + Tailwind CSS
