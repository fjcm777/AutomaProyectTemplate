# AutomaProyectTemplate - Complete Setup Guide

This is a complete template for a full-stack e-commerce application with React frontend and FastAPI backend.

## Project Overview

### Backend (FastAPI)
- **Location**: `backend/`
- **API**: currently ships `products`/`categories` as a disposable example (see `docs/design/CODE_ALIGNMENT.md` and `DECISION_LOG.md`); the confirmed target modules live in `docs/design/07-modules.md`
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
docker compose up --build
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

### Module Boundary Enforcement (import-linter)

One-time setup, from the repo root, to enable the module-boundary checks described in `docs/design/16-enforcement.md`:

```bash
cd backend
pip install -r requirements-dev.txt
cd ..
pre-commit install
```

After this, `git commit` automatically runs `lint-imports` and blocks the commit if a module reaches into another module's `repository.py`/`models.py`. Run it manually anytime with:

```bash
cd backend
lint-imports
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
✅ PostgreSQL database with async SQLAlchemy (`AsyncSession`)
✅ Alembic migrations
✅ Standard success/error response envelope (`docs/design/08-api-contracts.md`)
✅ Module-boundary enforcement with `import-linter` (`docs/design/16-enforcement.md`)
✅ Example CRUD module (`products`/`categories`) demonstrating the pattern above — disposable, see `docs/design/CODE_ALIGNMENT.md`
✅ Swagger/OpenAPI documentation

### Frontend Features
✅ React 18 with TypeScript
✅ React Router for navigation
✅ React Query for server state management
✅ Reusable components and hooks
✅ Form validation
✅ Error handling
✅ Loading states
✅ Example CRUD UI (`products`) consuming the standard envelope

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

Full, current endpoint list: `http://localhost:8000/docs` (Swagger UI). All responses use the envelope described in `docs/design/08-api-contracts.md`.

### Endpoints (current example module)

#### Health Check
- `GET /api/v1/health` - Health check endpoint

#### Products
- `GET /api/v1/products/?page=&page_size=&is_active=` - Paginated list
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products/` - Create product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Logical delete (`is_active=false`, row is kept)

#### Categories
- `GET /api/v1/categories/?page=&page_size=&is_active=` - Paginated list
- `POST /api/v1/categories/` - Create category

## Frontend Routes

- `/` - Home (redirects to products)
- `/products` - Products list page
- `/products/new` - Create new product page
- `/products/:id` - Product detail page
- `/products/:id/edit` - Edit product page

## Development Workflow

### Adding a new MVP module

Before starting the first real module, remove the disposable example code (see `docs/design/DECISION_LOG.md`, Decision 92). Then follow:

- `docs/design/07-modules.md` for the layering pattern (`api.py` → `service.py` → `repository.py`), the confirmed module list, and inter-module communication rules.
- `docs/design/16-enforcement.md` to register the new module's `import-linter` contract in `backend/.importlinter`.
- `docs/design/08-api-contracts.md` for the request/response envelope every endpoint must follow.
- `docs/design/13-development-roadmap.md` for the confirmed implementation order.

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
