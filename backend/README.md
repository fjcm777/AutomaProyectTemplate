# Backend Guide

Backend construido con FastAPI + SQLAlchemy + Alembic.

## Estructura

```text
backend/
|-- app/
|   |-- core/
|   |   |-- config.py        # Settings y variables de entorno
|   |   |-- database.py      # Engine, SessionLocal, Base
|   |   `-- dependencies.py  # Dependencias FastAPI (ej: DB session)
|   |-- db/
|   |   `-- base.py          # Registro central de modelos para Alembic
|   |-- modules/
|   |   |-- health/
|   |   |-- categories/
|   |   `-- products/
|   |-- shared/
|   `-- main.py
|-- migrations/
|-- alembic.ini
`-- requirements.txt
```

## Como agregar un modulo nuevo

1. Crear `app/modules/<feature>/`.
2. Agregar `models.py`, `schemas.py`, `repository.py`, `service.py`, `api.py`.
3. Registrar el router en `app/main.py`.
4. Importar el modelo en `app/db/base.py`.
5. Generar y aplicar migracion.

## Comandos utiles

```bash
# Levantar API
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Migraciones
alembic revision --autogenerate -m "descripcion"
alembic upgrade head
```

## Nota de arquitectura

Este template usa separacion por capas:
- API layer: traduce HTTP a casos de uso
- Service layer: reglas de negocio
- Repository layer: persistencia

Mantener esta separacion facilita pruebas y mantenimiento.