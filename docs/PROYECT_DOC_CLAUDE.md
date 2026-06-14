# AutomaProyectTemplate — Guía de Arquitectura y Mantenimiento

Template full-stack para sistemas de gestión (inventario, facturación, etc.).
Stack: **FastAPI + PostgreSQL** (backend) · **React + TypeScript + Tailwind** (frontend) · **Docker Compose** (infraestructura).

---

## Tabla de Contenidos

1. [Estructura general del proyecto](#1-estructura-general-del-proyecto)
2. [Backend](#2-backend)
   - [Estructura de carpetas](#21-estructura-de-carpetas)
   - [Flujo de una petición](#22-flujo-de-una-petición)
   - [Cómo agregar un módulo nuevo](#23-cómo-agregar-un-módulo-nuevo)
   - [Reglas de programación](#24-reglas-de-programación-backend)
3. [Frontend](#3-frontend)
   - [Estructura de carpetas](#31-estructura-de-carpetas)
   - [Flujo de datos](#32-flujo-de-datos)
   - [Cómo agregar una feature nueva](#33-cómo-agregar-una-feature-nueva)
   - [Reglas de programación](#34-reglas-de-programación-frontend)
4. [Infraestructura y Docker](#4-infraestructura-y-docker)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Comandos frecuentes](#6-comandos-frecuentes)

---

## 1. Estructura general del proyecto

```
AutomaProyectTemplate/
├── backend/          # API REST en FastAPI (Python)
├── frontend/         # SPA en React + TypeScript
├── docs/             # Documentación adicional
├── docker-compose.yml
├── .env              # Variables de entorno compartidas (nunca al repositorio)
└── CLAUDE.md         # Este archivo
```

El `.env` raíz es la única fuente de configuración para todos los servicios.
Docker Compose monta el código fuente como volumen, así que los cambios en los archivos se reflejan en caliente sin reconstruir la imagen.

---

## 2. Backend

### 2.1 Estructura de carpetas

```
backend/
├── app/
│   ├── main.py                  # Punto de entrada: crea la app FastAPI y registra routers
│   ├── core/
│   │   ├── config.py            # Configuración via pydantic-settings (lee .env)
│   │   ├── database.py          # Engine SQLAlchemy, SessionLocal, Base, TimestampMixin
│   │   └── dependencies.py      # get_db(): inyecta sesión de BD en cada request
│   ├── db/
│   │   └── base.py              # Importa todos los modelos para que Alembic los detecte
│   ├── modules/                 # Un subdirectorio por dominio de negocio
│   │   ├── health/
│   │   │   └── api.py           # GET /api/v1/health
│   │   ├── categories/
│   │   │   ├── api.py           # Router FastAPI (endpoints HTTP)
│   │   │   ├── service.py       # Lógica de negocio
│   │   │   ├── repository.py    # Acceso a base de datos
│   │   │   ├── models.py        # Modelo SQLAlchemy (tabla)
│   │   │   └── schemas.py       # Schemas Pydantic (request / response)
│   │   └── products/            # Misma estructura que categories
│   └── shared/
│       ├── exceptions.py        # Helpers: not_found(), bad_request()
│       └── pagination.py        # Constantes y PaginatedResponse[T]
├── migrations/
│   ├── env.py                   # Configuración de Alembic
│   └── versions/                # Archivos de migración generados
├── requirements.txt
├── alembic.ini
└── Dockerfile
```

### 2.2 Flujo de una petición

```
HTTP Request
    │
    ▼
api.py  (Router FastAPI)
    │  valida el payload con el schema Pydantic de entrada
    │  inyecta Session de BD via Depends(get_db)
    ▼
service.py  (Lógica de negocio)
    │  aplica reglas: validaciones cruzadas, integridad de FK
    │  nunca toca la BD directamente
    ▼
repository.py  (Acceso a datos)
    │  ejecuta queries SQLAlchemy
    │  llama db.commit() / db.refresh()
    ▼
models.py  (ORM)
    │  mapea filas de PostgreSQL a objetos Python
    ▼
schemas.py  (Response)
    └  serializa el objeto ORM → JSON (response_model)
```

**Regla clave:** cada capa solo habla con la capa inmediatamente inferior. El `api.py` nunca llama al `repository` directamente.

### 2.3 Cómo agregar un módulo nuevo

Ejemplo: agregar el módulo `suppliers` (proveedores).

**Paso 1 — Crear la carpeta del módulo**

```
backend/app/modules/suppliers/
├── __init__.py
├── models.py
├── schemas.py
├── repository.py
├── service.py
└── api.py
```

**Paso 2 — Definir el modelo (`models.py`)**

```python
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin

class Supplier(TimestampMixin, Base):
    __tablename__ = "suppliers"

    id: Mapped[int]  = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), index=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
```

- Siempre heredar `TimestampMixin, Base` en ese orden.
- Usar `Mapped[tipo]` + `mapped_column()` (SQLAlchemy 2.0).
- Precios/montos siempre con `Numeric(10, 2)`, nunca `Float`.

**Paso 3 — Definir los schemas (`schemas.py`)**

```python
from pydantic import BaseModel

class SupplierBase(BaseModel):
    name: str
    phone: str | None = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    model_config = {"from_attributes": True}

class SupplierUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
```

- `SupplierBase`: campos comunes.
- `SupplierCreate`: lo que recibe el POST.
- `SupplierResponse`: lo que devuelve la API (siempre incluye `id` y `model_config`).
- `SupplierUpdate`: todos los campos opcionales para PATCH/PUT parcial.
- Si hay campos de tipo `Decimal`, agregar `@field_serializer` para serializarlos como `float` en JSON.

**Paso 4 — Implementar el repositorio (`repository.py`)**

```python
from sqlalchemy.orm import Session
from app.modules.suppliers.models import Supplier

class SupplierRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Supplier]:
        return self.db.query(Supplier).order_by(Supplier.id.desc()).all()

    def get(self, supplier_id: int) -> Supplier | None:
        return self.db.query(Supplier).filter(Supplier.id == supplier_id).first()

    def create(self, data: dict) -> Supplier:
        obj = Supplier(**data)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self, obj: Supplier, data: dict) -> Supplier:
        for key, value in data.items():
            setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, obj: Supplier) -> None:
        self.db.delete(obj)
        self.db.commit()
```

**Paso 5 — Implementar el servicio (`service.py`)**

```python
from app.modules.suppliers.repository import SupplierRepository
from app.modules.suppliers.schemas import SupplierCreate, SupplierUpdate
from app.shared.exceptions import not_found

class SupplierService:
    def __init__(self, repository: SupplierRepository):
        self.repository = repository

    def list_suppliers(self):
        return self.repository.list()

    def get_supplier(self, supplier_id: int):
        obj = self.repository.get(supplier_id)
        if not obj:
            raise not_found("Supplier not found")
        return obj

    def create_supplier(self, data: SupplierCreate):
        return self.repository.create(data.model_dump())

    def update_supplier(self, supplier_id: int, data: SupplierUpdate):
        obj = self.get_supplier(supplier_id)
        return self.repository.update(obj, data.model_dump(exclude_unset=True))

    def delete_supplier(self, supplier_id: int):
        obj = self.get_supplier(supplier_id)
        self.repository.delete(obj)
```

**Paso 6 — Definir los endpoints (`api.py`)**

```python
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.modules.suppliers.repository import SupplierRepository
from app.modules.suppliers.schemas import SupplierCreate, SupplierResponse, SupplierUpdate
from app.modules.suppliers.service import SupplierService

router = APIRouter(prefix="/suppliers", tags=["suppliers"])

def get_service(db: Session = Depends(get_db)) -> SupplierService:
    return SupplierService(SupplierRepository(db))

@router.get("/", response_model=list[SupplierResponse])
def list_suppliers(service: SupplierService = Depends(get_service)):
    return service.list_suppliers()

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int, service: SupplierService = Depends(get_service)):
    return service.get_supplier(supplier_id)

@router.post("/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(payload: SupplierCreate, service: SupplierService = Depends(get_service)):
    return service.create_supplier(payload)

@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(supplier_id: int, payload: SupplierUpdate, service: SupplierService = Depends(get_service)):
    return service.update_supplier(supplier_id, payload)

@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: int, service: SupplierService = Depends(get_service)):
    service.delete_supplier(supplier_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
```

**Paso 7 — Registrar el modelo en Alembic (`db/base.py`)**

```python
from app.core.database import Base
from app.modules.categories.models import Category
from app.modules.products.models import Product
from app.modules.suppliers.models import Supplier   # <-- agregar

__all__ = ["Base", "Category", "Product", "Supplier"]
```

**Paso 8 — Registrar el router en `main.py`**

```python
from app.modules.suppliers.api import router as suppliers_router

app.include_router(suppliers_router, prefix=settings.API_V1_PREFIX)
```

**Paso 9 — Crear y aplicar la migración**

```bash
docker exec store_backend alembic revision --autogenerate -m "add suppliers"
docker exec store_backend alembic upgrade head
```

### 2.4 Reglas de programación (Backend)

| Regla | Detalle |
|-------|---------|
| **Tipos de dinero** | Siempre `Numeric(10, 2)` en modelos y `Decimal` en schemas. Agregar `@field_serializer` para devolver `float` en JSON. |
| **Timestamps** | Todo modelo hereda `TimestampMixin, Base`. El orden importa: mixin primero. |
| **Errores HTTP** | Usar solo `not_found()` y `bad_request()` de `shared/exceptions.py`. No lanzar `HTTPException` directamente en el código de negocio. |
| **Validación FK** | Verificar existencia de claves foráneas en el `service`, no en el `repository` ni en el `api`. |
| **Commit** | Solo el `repository` llama `db.commit()`. El `service` y el `api` no lo hacen. |
| **Schemas de respuesta** | Siempre declarar `response_model` en cada endpoint. Nunca devolver un objeto ORM sin schema. |
| **Paginación** | Usar `PaginatedResponse[T]` de `shared/pagination.py` para cualquier endpoint de lista que pueda crecer. |
| **Nombres** | Módulo en singular (`product`, `supplier`). Router con prefijo en plural (`/products`, `/suppliers`). |
| **Migraciones** | Nunca editar manualmente el esquema de la BD. Siempre vía `alembic revision --autogenerate`. |

---

## 3. Frontend

### 3.1 Estructura de carpetas

```
frontend/src/
├── main.tsx                     # Punto de entrada: monta React, QueryClient, ThemeProvider, Router
├── app.tsx                      # Layout raíz: sidebar fijo, header, <Outlet /> para el contenido
├── app/
│   └── router/
│       └── router.tsx           # Definición de todas las rutas (React Router v6)
├── features/                    # Un subdirectorio por dominio de negocio
│   └── products/
│       ├── api/
│       │   └── products.ts      # Funciones HTTP puras (llaman a apiFetch)
│       ├── hooks/
│       │   ├── useProducts.ts   # useQuery para listar
│       │   ├── useCreateProduct.ts
│       │   ├── useUpdateProduct.ts
│       │   └── useDeleteProduct.ts
│       ├── components/
│       │   ├── ProductForm.tsx  # Formulario reutilizable (create y edit)
│       │   └── ProductTable.tsx # Tabla de listado
│       ├── pages/
│       │   ├── ProductsPage.tsx
│       │   ├── ProductCreatePage.tsx
│       │   ├── ProductDetailPage.tsx
│       │   └── ProductEditPage.tsx
│       ├── types/
│       │   └── product.types.ts # Interfaces TypeScript del dominio
│       └── index.ts             # Barrel export (re-exporta lo público)
└── shared/
    ├── api/
    │   └── clients.ts           # apiFetch: cliente HTTP centralizado con manejo de errores
    ├── contexts/
    │   └── theme-context.tsx    # ThemeProvider + useThemeContext (dark/light)
    ├── components/              # Componentes UI reutilizables entre features
    ├── hooks/                   # Hooks genéricos reutilizables
    ├── types/                   # Tipos compartidos entre features
    ├── constants/               # Constantes globales
    └── utils/                   # Funciones utilitarias puras
```

### 3.2 Flujo de datos

```
Page (página)
    │  usa hooks para disparar queries/mutations
    ▼
Hook (useQuery / useMutation de React Query)
    │  gestiona caché, loading, error, refetch automático
    ▼
API function  (products.ts)
    │  llama a apiFetch con el endpoint y método HTTP
    ▼
apiFetch  (shared/api/clients.ts)
    │  agrega headers, maneja errores HTTP, parsea JSON
    ▼
Backend API  (http://localhost:8000/api/v1/...)
```

**React Query** es el estado del servidor. No usar `useState` para datos que vienen de la API.
**ThemeContext** es el único estado global de UI. Cualquier otro estado es local al componente.

### 3.3 Cómo agregar una feature nueva

Ejemplo: agregar la feature `suppliers` (proveedores).

**Paso 1 — Crear la estructura de carpetas**

```
frontend/src/features/suppliers/
├── api/
│   └── suppliers.ts
├── hooks/
│   ├── useSuppliers.ts
│   └── useCreateSupplier.ts
├── components/
│   └── SupplierForm.tsx
├── pages/
│   ├── SuppliersPage.tsx
│   └── SupplierCreatePage.tsx
├── types/
│   └── supplier.types.ts
└── index.ts
```

**Paso 2 — Definir los tipos (`types/supplier.types.ts`)**

```typescript
export type Supplier = {
  id: number
  name: string
  phone: string | null
}

export type CreateSupplierPayload = {
  name: string
  phone?: string | null
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>
```

**Paso 3 — Implementar las funciones HTTP (`api/suppliers.ts`)**

```typescript
import { apiFetch } from "@/shared/api/clients"
import { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from "../types/supplier.types"

export const getSuppliers = () =>
  apiFetch<Supplier[]>("/suppliers/")

export const getSupplierById = (id: number) =>
  apiFetch<Supplier>(`/suppliers/${id}`)

export const createSupplier = (payload: CreateSupplierPayload) =>
  apiFetch<Supplier>("/suppliers/", { method: "POST", body: JSON.stringify(payload) })

export const updateSupplier = (id: number, payload: UpdateSupplierPayload) =>
  apiFetch<Supplier>(`/suppliers/${id}`, { method: "PUT", body: JSON.stringify(payload) })

export const deleteSupplier = (id: number) =>
  apiFetch<void>(`/suppliers/${id}`, { method: "DELETE" })
```

**Paso 4 — Crear los hooks (`hooks/useSuppliers.ts`)**

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSuppliers, createSupplier } from "../api/suppliers"

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}
```

- `queryKey` es el identificador del caché. Siempre array: `["suppliers"]`, `["suppliers", id]`.
- `invalidateQueries` en `onSuccess` refresca la lista automáticamente tras crear/editar/eliminar.

**Paso 5 — Crear las páginas y componentes**

Cada página es un componente React simple que usa los hooks.
Los componentes en `components/` son piezas reutilizables dentro de la feature (formularios, tablas).

**Paso 6 — Registrar las rutas (`app/router/router.tsx`)**

```typescript
import { SuppliersPage } from "../../features/suppliers/pages/SuppliersPage"
import { SupplierCreatePage } from "../../features/suppliers/pages/SupplierCreatePage"

// Dentro del array children del router:
{
  path: "suppliers",
  children: [
    { index: true, element: <SuppliersPage /> },
    { path: "new", element: <SupplierCreatePage /> },
  ],
},
```

**Paso 7 — Agregar al menú de navegación (`app.tsx`)**

```typescript
// Agregar al array navigation:
{
  label: "Proveedores",
  to: "/suppliers",
  icon: <svg .../>
}
```

**Paso 8 — Exportar desde el barrel (`index.ts`)**

```typescript
export * from "./pages/SuppliersPage"
export * from "./hooks/useSuppliers"
export type { Supplier } from "./types/supplier.types"
```

### 3.4 Reglas de programación (Frontend)

| Regla | Detalle |
|-------|---------|
| **Estado del servidor** | Todo dato que venga de la API vive en React Query. Nunca en `useState`. |
| **Estado de UI** | Solo para estado visual local (modal abierto, input controlado). Siempre `useState` local al componente. |
| **Alias de importación** | Usar `@/` para importaciones absolutas desde `src/`. Ejemplo: `import { apiFetch } from "@/shared/api/clients"`. Nunca rutas relativas que suban más de un nivel (`../../`). |
| **Tipos** | Todo tiene tipo TypeScript explícito. Prohibido usar `any`. Los tipos del dominio van en `types/nombre.types.ts` dentro de la feature. |
| **apiFetch** | Toda llamada HTTP pasa por `apiFetch` de `shared/api/clients.ts`. Nunca hacer `fetch` o llamadas directas en un hook o componente. |
| **queryKey** | Siempre array. Lista general: `["entidad"]`. Detalle: `["entidad", id]`. Esto garantiza que el caché se invalide correctamente. |
| **invalidateQueries** | Siempre llamar en `onSuccess` de mutations que modifican datos (create, update, delete). |
| **Componentes** | Functional components con hooks. Sin clases. Sin lógica de negocio dentro de JSX — extraer a variables o funciones antes del return. |
| **Estilos** | Solo Tailwind CSS. Sin CSS inline ni archivos `.css` por componente. Clases condicionales con template literals o arrays `.join(" ")`. |
| **Nombres de archivos** | PascalCase para componentes y páginas (`ProductForm.tsx`). camelCase para hooks, tipos y funciones (`useProducts.ts`, `products.ts`). |
| **Barrel exports** | Cada feature expone su API pública vía `index.ts`. Otras features importan desde `@/features/products` nunca desde rutas internas. |

---

## 4. Infraestructura y Docker

### Servicios

| Servicio | Container | Puerto | Imagen |
|----------|-----------|--------|--------|
| Base de datos | `store_db` | 5432 | postgres:16 |
| API Backend | `store_backend` | 8000 | python:3.12-slim |
| App Frontend | `store_frontend` | 5173 | node:20-alpine |

### Orden de arranque

Docker Compose garantiza el orden:
`store_db` (healthy) → `store_backend` → `store_frontend`

El backend espera a que PostgreSQL responda al healthcheck antes de iniciar.

### Volúmenes

El código fuente se monta como volumen en ambos contenedores:
- Backend: `./backend → /code` — Uvicorn con `--reload` detecta cambios automáticamente.
- Frontend: `./frontend → /app` — Vite HMR actualiza el navegador sin reconstruir.

Esto significa que **no hay que reconstruir la imagen** para ver cambios en el código durante desarrollo. Solo se reconstruye cuando cambia `requirements.txt` o `package.json`.

### Cuándo reconstruir

```bash
# Solo cuando cambien dependencias
docker-compose up --build
```

```bash
# Para cambios de código normales (más rápido)
docker-compose up
```

---

## 5. Variables de entorno

Todas las variables viven en el `.env` raíz. El backend las lee vía `pydantic-settings`.

| Variable | Uso | Ejemplo |
|----------|-----|---------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nombre de la base de datos | `store_db` |
| `POSTGRES_PORT` | Puerto expuesto al host | `5432` |
| `DATABASE_URL` | URL completa para SQLAlchemy | `postgresql://postgres:postgres@db:5432/store_db` |
| `BACKEND_PORT` | Puerto del API expuesto al host | `8000` |
| `FRONTEND_PORT` | Puerto del frontend expuesto al host | `5173` |
| `APP_NAME` | Nombre de la API en Swagger | `Store API` |
| `API_V1_PREFIX` | Prefijo de todas las rutas | `/api/v1` |
| `BACKEND_CORS_ORIGINS` | Orígenes permitidos (JSON array) | `["http://localhost:5173"]` |

El frontend lee su URL del API desde `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 6. Comandos frecuentes

```bash
# Levantar todo el stack
docker-compose up --build -d

# Ver logs de un servicio
docker logs store_backend -f
docker logs store_frontend -f

# Aplicar migraciones pendientes
docker exec store_backend alembic upgrade head

# Generar nueva migración tras cambiar modelos
docker exec store_backend alembic revision --autogenerate -m "descripcion"

# Ver estado actual de migraciones
docker exec store_backend alembic current

# Revertir última migración
docker exec store_backend alembic downgrade -1

# Abrir shell en el backend
docker exec -it store_backend bash

# Acceder a PostgreSQL
docker exec -it store_db psql -U postgres -d store_db

# Reiniciar un servicio sin reconstruir
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v
```

---

## 7. URLs en desarrollo

| Recurso | URL |
|---------|-----|
| Aplicación frontend | http://localhost:5173 |
| API Backend | http://localhost:8000 |
| Swagger UI (docs interactivos) | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health check | http://localhost:8000/api/v1/health |
