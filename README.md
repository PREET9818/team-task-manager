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

## 📄 License

MIT License — free to use, modify and distribute.

---

Built with ❤️ using Django + React + Tailwind CSS



# 🚀 TaskFlow — Team Task Manager

<div align="center">

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Team%20Task%20Manager-6172f3?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-4.2.7-092E20?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=for-the-badge&logo=railway)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)

**A production-ready full-stack web application for managing team projects and tasks with role-based access control.**

[🌐 Live Demo](https://team-task-manager-production-24a8.up.railway.app) • [🔗 Backend API](https://team-task-manager-production-eece.up.railway.app) • [📁 GitHub](https://github.com/PREET9818/team-task-manager)

</div>

---

## 👨‍💻 About The Developer

**Preet Bhati**
Final Year B.Tech Student
Full Stack Developer

---

## 📖 Project Overview

TaskFlow is a complete Team Task Management System built as part of a technical assignment. It allows teams to create projects, assign tasks to members, track progress, and manage workflows — all with secure role-based access control.

The application features a modern SaaS-style UI built with React and Tailwind CSS, a robust Django REST Framework backend, JWT authentication, PostgreSQL database, and is fully deployed on Railway.

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| 🖥️ Frontend | https://team-task-manager-production-24a8.up.railway.app |
| ⚙️ Backend API | https://team-task-manager-production-eece.up.railway.app |
| 🔑 Django Admin | https://team-task-manager-production-eece.up.railway.app/admin/ |
| 📡 API Root | https://team-task-manager-production-eece.up.railway.app/api/ |

---

## ✨ Features

### Authentication
- JWT-based signup and login
- Persistent authentication with token refresh
- Secure password hashing
- Protected routes on frontend
- Role-based route protection

### Role-Based Access Control
| Feature | Admin | Member |
|---------|-------|--------|
| Create/Edit/Delete Projects | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create/Edit/Delete Tasks | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View dashboard | ✅ | ✅ |
| View assigned projects | ✅ | ✅ |
| Access Django Admin | ✅ | ❌ |

### Project Management
- Create, edit, delete projects
- Set project deadlines and status
- Add and remove team members
- Real-time progress tracking
- Project status — Planning, Active, On Hold, Completed, Cancelled

### Task Management
- Create and assign tasks to members
- Set priority — Low, Medium, High
- Track status — Pending, In Progress, Completed
- Filter tasks by status, priority, project
- Search tasks by title or description
- Overdue task detection and highlighting
- Members can update their own task status

### Dashboard Analytics
- Total projects and tasks count
- Completed, pending, in-progress stats
- Overdue tasks count
- Task completion rate with progress bar
- Pie chart — tasks by status
- Bar chart — tasks by priority
- Recent tasks list

### UI/UX
- Modern SaaS-style design
- Fully responsive — mobile and desktop
- Sidebar navigation
- Toast notifications
- Loading states
- Empty states
- Professional card layouts

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13 | Programming Language |
| Django | 4.2.7 | Web Framework |
| Django REST Framework | 3.14.0 | REST API |
| SimpleJWT | 5.3.1 | JWT Authentication |
| django-cors-headers | 4.3.1 | CORS handling |
| django-filter | 23.3 | API Filtering |
| psycopg | 3.2.3 | PostgreSQL Driver |
| gunicorn | 21.2.0 | Production Server |
| whitenoise | 6.6.0 | Static Files |
| python-decouple | 3.8 | Environment Variables |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI Framework |
| Vite | 5 | Build Tool |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Client-side Routing |
| Axios | 1.x | HTTP Client |
| Recharts | 2.x | Charts |
| Lucide React | 0.x | Icons |
| React Hot Toast | 2.x | Notifications |
| date-fns | 3.x | Date Formatting |

### Database & Deployment
| Service | Purpose |
|---------|---------|
| PostgreSQL (Neon) | Production Database |
| Railway | App Deployment |
| GitHub | Version Control |

---

## 📂 Project Structure
```
team-task-manager/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   ├── models.py        # Custom User model
│   │   │   ├── serializers.py   # Auth serializers
│   │   │   ├── views.py         # Auth views
│   │   │   ├── urls.py          # Auth URLs
│   │   │   └── admin.py         # Admin config
│   │   ├── projects/
│   │   │   ├── models.py        # Project model
│   │   │   ├── serializers.py   # Project serializers
│   │   │   ├── views.py         # Project views
│   │   │   ├── permissions.py   # Custom permissions
│   │   │   └── urls.py          # Project URLs
│   │   └── tasks/
│   │       ├── models.py        # Task model
│   │       ├── serializers.py   # Task serializers
│   │       ├── views.py         # Task views + Dashboard
│   │       └── urls.py          # Task URLs
│   ├── config/
│   │   ├── settings.py          # Django settings
│   │   ├── urls.py              # Root URLs
│   │   └── wsgi.py              # WSGI config
│   ├── manage.py
│   ├── requirements.txt
│   ├── railway.json
│   ├── Procfile
│   └── start.sh
│
└── frontend/
├── src/
│   ├── api/
│   │   └── index.js          # Axios API client
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx    # Main layout
│   │   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   │   └── Navbar.jsx    # Top navbar
│   │   ├── ui/
│   │   │   ├── Modal.jsx     # Reusable modal
│   │   │   ├── Badge.jsx     # Status badges
│   │   │   ├── StatCard.jsx  # Dashboard cards
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectForm.jsx
│   │   └── tasks/
│   │       ├── TaskRow.jsx
│   │       └── TaskForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state management
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   ├── TasksPage.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js
└── railway.json

---

## 🗄️ Database Models

### User
id, email, first_name, last_name, role (admin/member),
is_active, is_staff, is_superuser, date_joined, last_seen

### Project
id, title, description, status, deadline,
created_by (FK User), members (M2M User),
created_at, updated_at

### Task
id, title, description, project (FK),
assigned_to (FK User), created_by (FK User),
priority, status, due_date, created_at, updated_at

---

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login user | No |
| POST | `/api/auth/logout/` | Logout user | Yes |
| POST | `/api/auth/refresh/` | Refresh token | No |
| GET | `/api/auth/me/` | Get current user | Yes |
| PATCH | `/api/auth/me/` | Update profile | Yes |
| POST | `/api/auth/change-password/` | Change password | Yes |

### Project Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects/` | List projects | Yes |
| POST | `/api/projects/` | Create project | Admin |
| GET | `/api/projects/:id/` | Get project | Yes |
| PUT | `/api/projects/:id/` | Update project | Admin |
| DELETE | `/api/projects/:id/` | Delete project | Admin |
| POST | `/api/projects/:id/add_member/` | Add member | Admin |
| POST | `/api/projects/:id/remove_member/` | Remove member | Admin |
| GET | `/api/projects/stats/` | Project stats | Yes |

### Task Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/` | List tasks | Yes |
| POST | `/api/tasks/` | Create task | Admin |
| GET | `/api/tasks/:id/` | Get task | Yes |
| PUT | `/api/tasks/:id/` | Update task | Admin |
| DELETE | `/api/tasks/:id/` | Delete task | Admin |
| PATCH | `/api/tasks/:id/status/` | Update status | Yes |
| GET | `/api/tasks/dashboard/` | Dashboard data | Yes |

### User Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/` | List all users | Yes |
| GET | `/api/users/:id/` | Get user | Yes |

### Query Parameters
?search=keyword        Search by title/description
?status=active         Filter by status
?priority=high         Filter by priority
?project=1             Filter tasks by project
?assigned_to=2         Filter by assignee
?overdue=true          Show overdue tasks only
?ordering=-created_at  Sort (- for descending)
?page=1                Pagination

---

## ⚡ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- pip
- npm

### Backend Setup

```bash
# Clone repository
git clone https://github.com/PREET9818/team-task-manager.git
cd team-task-manager/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate.bat

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env with your values
# SECRET_KEY=your-secret-key
# DATABASE_URL=sqlite:///db.sqlite3

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔐 Environment Variables

### Backend `.env`
```env
SECRET_KEY=your-super-secret-key-here
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

## 🚂 Railway Deployment

### Backend
1. Push code to GitHub
2. Railway → New Project → GitHub repo
3. Set Root Directory → `backend`
4. Add PostgreSQL database
5. Set environment variables:
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*
CORS_ALLOW_ALL_ORIGINS=True
DATABASE_URL=postgresql://...

### Frontend
1. Railway → New Service → Same GitHub repo
2. Set Root Directory → `frontend`
3. Set environment variable:
VITE_API_URL=https://your-backend.railway.app

---

## 🧪 API Testing

### Register
```bash
curl -X POST https://team-task-manager-production-eece.up.railway.app/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","first_name":"Test","last_name":"User","password":"Test1234!","password2":"Test1234!"}'
```

### Login
```bash
curl -X POST https://team-task-manager-production-eece.up.railway.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

### Create Project (with token)
```bash
curl -X POST https://team-task-manager-production-eece.up.railway.app/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"Test","status":"active"}'
```

---

## 🔒 Security Features

- JWT Authentication with access and refresh tokens
- Token blacklisting on logout
- Password hashing with Django's built-in system
- Role-based permissions on every API endpoint
- CORS configuration
- CSRF protection
- Environment variables for sensitive data
- Input validation on both frontend and backend
- Members cannot self-assign admin role

---

## 🎯 Key Technical Decisions

- **Custom User Model** — Extended Django's AbstractBaseUser for email-based auth instead of username
- **JWT over Sessions** — Stateless authentication better suited for SPA + API architecture
- **ViewSets** — Used DRF ViewSets for clean, consistent API structure
- **Context API** — Used React Context over Redux for simpler state management
- **Neon PostgreSQL** — Serverless PostgreSQL for free tier production database
- **Whitenoise** — For serving static files without a CDN

---

## 📊 Project Stats
Backend  → 15+ REST API endpoints
Frontend → 7 pages, 15+ components
Database → 3 models with proper relationships
Auth     → JWT with refresh token rotation
Deploy   → 2 Railway services + Neon DB

---

## 👤 Author

**Preet Bhati**
- GitHub: [@PREET9818](https://github.com/PREET9818)
- Email: pb496189@gmail.com

---

## 📄 License

MIT License — free to use and modify.

---

<div align="center">
Built with ❤️ using Django + React + Tailwind CSS
<br/>
Deployed on Railway | Database on Neon
</div>