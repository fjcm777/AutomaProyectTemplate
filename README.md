# AutomaProyectTemplate

Template base para iniciar un proyecto full-stack con FastAPI (backend) y React + TypeScript (frontend).

## Estado del template

Este template ya incluye:
- Estructura por modulos en backend (`modules/<feature>`)
- Estructura por features en frontend (`features/<feature>`)
- CRUD de productos en frontend y backend
- Docker Compose para levantar DB + API + UI
- Compilacion frontend validada (`npm run build`)

## Estructura principal

```text
AutomaProyectTemplate/
|-- backend/
|   |-- app/
|   |   |-- core/          # Configuracion, DB y dependencias compartidas
|   |   |-- modules/       # Features del dominio (products, categories, health)
|   |   |-- shared/        # Utilidades transversales
|   |   `-- main.py        # Entrypoint de FastAPI
|   |-- migrations/        # Alembic
|   |-- requirements.txt
|   `-- Dockerfile
|-- frontend/
|   |-- src/
|   |   |-- app/           # Router y composicion principal
|   |   |-- features/      # Features de UI (products)
|   |   |-- shared/        # Cliente API, tipos y utilidades
|   |   `-- styles/
|   |-- package.json
|   `-- Dockerfile
|-- docker-compose.yml
`-- .env
```

## Como iniciar rapido

### Opcion 1: Docker

```bash
docker compose up --build
```

Servicios:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Docs API: `http://localhost:8000/docs`

### Opcion 2: Local

Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Convenciones del template

### Backend
- Cada feature vive en `backend/app/modules/<feature>/`
- Patron recomendado por feature:
  - `models.py`: entidades SQLAlchemy
  - `schemas.py`: contratos de entrada/salida
  - `repository.py`: acceso a datos
  - `service.py`: reglas de negocio
  - `api.py`: endpoints HTTP

### Frontend
- Cada feature vive en `frontend/src/features/<feature>/`
- Patron recomendado por feature:
  - `api/`: llamadas HTTP
  - `hooks/`: react-query + logica de consumo
  - `components/`: componentes UI reutilizables
  - `pages/`: paginas de ruta
  - `types/`: tipos TS del feature

## Antes de iniciar desarrollo

1. Define el modelo de dominio inicial (tablas, campos, relaciones).
2. Crea migraciones por cada cambio de esquema.
3. Define contratos API en `schemas.py` antes de codificar UI.
4. Extiende primero backend y luego conecta frontend por feature.

## Contexto importado de ChatGPT

El contexto recuperado del proyecto web de ChatGPT `Sistema proyect` esta guardado en:

- [Resumen de importacion](docs/chatgpt-import/README.md)
- [Contexto tecnico consolidado](docs/chatgpt-import/project-context.md)
- [Instrucciones locales para agentes](AGENTS.md)

Ese import es una recuperacion de contexto, no un clon archivo-por-archivo del proyecto web.

## Documentacion adicional

- [Playbook de arquitectura](docs/TEMPLATE_PLAYBOOK.md)
- [Guia backend](backend/README.md)
- [Guia frontend](frontend/README.md)
