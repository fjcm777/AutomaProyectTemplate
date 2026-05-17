# Template Playbook

Esta guia explica como extender el template sin romper su estructura.

## 1) Flujo recomendado por feature

1. Backend: modelo, schema, repository, service, api.
2. Migracion Alembic.
3. Frontend: tipos, api client, hooks, paginas/componentes.
4. Pruebas manuales y build.

## 2) Backend: checklist por modulo

Dentro de `backend/app/modules/<feature>/`:
- `models.py`: define tablas y relaciones
- `schemas.py`: define `Create`, `Update`, `Response`
- `repository.py`: operaciones de lectura/escritura
- `service.py`: reglas de negocio (validaciones)
- `api.py`: router con endpoints y codigos HTTP

Luego:
- Registrar router en `backend/app/main.py`
- Importar modelos en `backend/app/db/base.py`
- Crear migracion:

```bash
cd backend
alembic revision --autogenerate -m "add <feature>"
alembic upgrade head
```

## 3) Frontend: checklist por feature

Dentro de `frontend/src/features/<feature>/`:
- `types/`: contratos TypeScript
- `api/`: funciones HTTP hacia backend
- `hooks/`: hooks con react-query
- `components/`: UI reutilizable del feature
- `pages/`: vistas conectadas a router

Luego:
- Registrar rutas en `frontend/src/app/router/router.tsx`
- Exportar superficie publica en `frontend/src/features/<feature>/index.ts`

## 4) Criterios de calidad del template

Para mantener el template sano:
- Imports claros y consistentes
- Nombres de archivos sin typos
- Una responsabilidad por archivo
- Comentarios solo en zonas de extension o decisiones clave
- Cero codigo duplicado o archivos legacy dentro de `src`

## 5) Convenciones de nombres

- Backend:
  - Clases: `PascalCase`
  - Funciones/metodos: `snake_case`
  - Archivos: `snake_case.py`
- Frontend:
  - Componentes: `PascalCase.tsx`
  - Hooks: `useXxx.ts`
  - Tipos: `*.types.ts`

## 6) Entregables minimos por iteracion

Al terminar cada feature:
- Migracion aplicada
- API funcionando en `/docs`
- Frontend compila (`npm run build`)
- Tipos TS sin errores (`npx tsc --noEmit`)
- README o notas actualizadas