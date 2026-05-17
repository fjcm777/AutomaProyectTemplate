# AutomaProyectTemplate - Complete Setup Guide

This is a complete template for a full-stack e-commerce application with React frontend and FastAPI backend.

## Project Overview

### Backend (FastAPI)
- **Location**: `backend/`
- **API**: RESTful API with products and categories endpoints
- **Database**: PostgreSQL
- **Port**: 8000

### Frontend (React + TypeScript)
- **Location**: `frontend/`
- **Framework**: React 18 + Vite
- **State Management**: React Query
- **Routing**: React Router v6
- **Port**: 5173

## Prerequisites

- Node.js 16+ (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL 12+ (or Docker)
- Docker & Docker Compose (recommended)

## Quick Start with Docker

### 1. Start Services

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8000)
- React frontend (port 5173)

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Manual Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example if needed)
# VITE_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
```

## Project Features

### Backend Features
✅ FastAPI with CORS support
✅ PostgreSQL database with SQLAlchemy ORM
✅ Alembic migrations
✅ RESTful API for Products and Categories
✅ CRUD operations
✅ Swagger/OpenAPI documentation

### Frontend Features
✅ React 18 with TypeScript
✅ React Router for navigation
✅ React Query for server state management
✅ Reusable components and hooks
✅ Form validation
✅ Error handling
✅ Loading states
✅ Complete CRUD UI for products

## Folder Structure

```
AutomaProyectTemplate/
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration
│   │   ├── db/             # Database setup
│   │   ├── modules/        # Features
│   │   │   ├── health/
│   │   │   ├── categories/
│   │   │   └── products/
│   │   ├── shared/         # Shared utilities
│   │   └── main.py         # FastAPI app
│   ├── migrations/         # Database migrations
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/
│   ├── src/
│   │   ├── app.tsx         # Main app component
│   │   ├── app/
│   │   │   └── router/     # Route definitions
│   │   ├── features/       # Feature modules
│   │   │   └── products/
│   │   ├── shared/         # Shared utilities
│   │   ├── styles/         # CSS
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static files
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── tsconfig.json
├── docker-compose.yml
└── .env                    # Environment variables
```

## Environment Configuration

### Root .env (for Docker Compose)
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=store_db
POSTGRES_PORT=5432

BACKEND_PORT=8000
FRONTEND_PORT=5173

DATABASE_URL=postgresql://postgres:postgres@db:5432/store_db
APP_NAME=Store API
API_V1_PREFIX=/api/v1
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend .env
```
VITE_API_URL=http://localhost:8000/api/v1
```

## API Documentation

### Endpoints

#### Health Check
- `GET /api/v1/health` - Health check endpoint

#### Products
- `GET /api/v1/products/` - List all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products/` - Create product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

#### Categories
- `GET /api/v1/categories/` - List all categories
- `GET /api/v1/categories/{id}` - Get category by ID
- `POST /api/v1/categories/` - Create category
- `PUT /api/v1/categories/{id}` - Update category
- `DELETE /api/v1/categories/{id}` - Delete category

## Frontend Routes

- `/` - Home (redirects to products)
- `/products` - Products list page
- `/products/new` - Create new product page
- `/products/:id` - Product detail page
- `/products/:id/edit` - Edit product page

## Development Workflow

### Adding a New Feature (e.g., Customers)

1. **Backend**:
   - Create `backend/app/modules/customers/` directory
   - Add models, schemas, repository, service, and API
   - Include in `backend/app/main.py` router

2. **Frontend**:
   - Create `frontend/src/features/customers/` directory
   - Add pages, components, hooks, and API functions
   - Add routes to `frontend/src/app/router/router.tsx`

## Build for Production

### Backend
```bash
cd backend
pip freeze > requirements.txt
docker build -t store-api:latest .
```

### Frontend
```bash
cd frontend
npm run build
docker build -t store-frontend:latest .
```

## Troubleshooting

### CORS Issues
- Ensure `BACKEND_CORS_ORIGINS` in `.env` includes the frontend URL
- Check backend `app.main.py` has CORSMiddleware configured

### API Connection Issues
- Verify `VITE_API_URL` in frontend `.env` is correct
- Check backend is running on the correct port
- Use browser DevTools to inspect network requests

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run migrations: `alembic upgrade head`

## Next Steps

1. ✅ Review the template structure
2. ✅ Customize models and add new features
3. ✅ Add authentication/authorization if needed
4. ✅ Add tests for both backend and frontend
5. ✅ Deploy to your preferred platform

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)

## License

MIT
