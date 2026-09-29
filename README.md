# AutomaProyectTemplate

Sistema de gestión (inventario, ventas, caja, compras y más) para Calzado Norita.
Stack: **FastAPI + PostgreSQL** (backend) · **React + TypeScript** (frontend) · **Docker Compose** (infraestructura).

## Inicio rápido

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Docs API (Swagger): http://localhost:8000/docs

Para el setup manual (sin Docker), variables de entorno y troubleshooting, ver la [guía de instalación](docs/SETUP_GUIDE.md).

## Documentación

Toda la documentación del proyecto vive en [`docs/`](docs/):

- [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md) — cómo levantar el proyecto localmente.
- [`docs/design/`](docs/design/) — diseño confirmado del sistema (reglas de negocio, arquitectura, base de datos, contratos de API, roadmap, etc.). Empezar por [`docs/design/README.md`](docs/design/README.md).

## Estado actual del código

El backend y frontend incluyen un módulo de ejemplo desechable (`products`/`categories`) usado únicamente para validar que el patrón técnico confirmado (capas, envoltorio de respuesta, sesiones async, enforcement de límites entre módulos) funciona de extremo a extremo antes de construir los módulos reales del MVP. Ver `docs/design/CODE_ALIGNMENT.md` y la Decisión 92 en `docs/design/DECISION_LOG.md`: ese código se elimina, no se extiende, al iniciar desarrollo oficial.

## Licencia

MIT
