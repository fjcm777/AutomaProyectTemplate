# 01 — Arquitectura del Sistema

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | FastAPI + Python | 3.12 / 0.115 |
| ORM | SQLAlchemy | 2.0 |
| Migraciones | Alembic | 1.15 |
| Validación | Pydantic v2 | 2.10 |
| Base de datos | PostgreSQL | 16 |
| Frontend | React + TypeScript | 18.3 / 5.4 |
| Build tool | Vite | 6.2 |
| State / Fetching | TanStack Query | v5 |
| Estilos | Tailwind CSS | 3.4 |
| Infraestructura | Docker + Docker Compose | v2 |

---

## Patrón Arquitectónico

El sistema usa **Modular Monolith con Vertical Slice** tanto en backend como frontend.

Cada módulo es completamente independiente y sigue el mismo patrón de 5 capas:

```
Model → Schema → Repository → Service → API
```

### Ventajas de este patrón

- Agregar un módulo nuevo no afecta los existentes
- Cada módulo puede evolucionar de forma independiente
- Facilita el mantenimiento y las pruebas unitarias
- Permite migrar módulos a microservicios en el futuro si es necesario

---

## Estructura de Carpetas

### Backend

```
backend/app/
├── core/
│   ├── config.py           ← Variables de entorno y settings
│   ├── database.py         ← Engine y sesión de SQLAlchemy
│   └── dependencies.py     ← Dependencias compartidas
├── db/
│   └── base.py             ← Registro de modelos para Alembic
├── modules/
│   ├── auth/               ← Autenticación y usuarios
│   ├── inventory/          ← Inventario
│   ├── sales/              ← Ventas y facturación
│   ├── customers/          ← Clientes y crédito
│   ├── suppliers/          ← Proveedores
│   └── reports/            ← Reportes
└── main.py                 ← Registro de routers y configuración de la app
```

### Frontend

```
frontend/src/
├── app/
│   ├── app.tsx
│   └── router/
│       └── router.tsx
├── features/
│   ├── auth/
│   ├── inventory/
│   ├── sales/
│   ├── customers/
│   ├── suppliers/
│   └── reports/
└── shared/
    ├── api/
    │   └── apiClient.ts    ← Cliente HTTP centralizado
    ├── components/         ← Componentes reutilizables (Button, Table, Modal...)
    ├── hooks/              ← Hooks genéricos (usePagination, useDebounce...)
    ├── types/              ← Tipos globales
    └── utils/
```

---

## Convenciones de Nombres

### Backend (Python)

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Carpetas de módulos | `snake_case` | `inventory/`, `sales/` |
| Archivos | `snake_case` | `api.py`, `models.py` |
| Modelos SQLAlchemy | `PascalCase` | `Product`, `SalesInvoice` |
| Tablas en DB | `snake_case` plural | `products`, `invoice_items` |
| Columnas en DB | `snake_case` | `unit_price`, `created_at` |
| Schemas Pydantic | `PascalCase` + sufijo | `ProductCreate`, `InvoiceOut` |
| Funciones / variables | `snake_case` | `get_current_user()` |

### Frontend (TypeScript)

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Carpetas features | `kebab-case` | `inventory/`, `sales/` |
| Componentes | `PascalCase` | `InvoiceTable.tsx` |
| Hooks | `camelCase` + `use` | `useInvoices.ts` |
| Archivos API | `camelCase` | `invoicesApi.ts` |
| Types / Interfaces | `PascalCase` | `Invoice`, `Product` |
| Variables / funciones | `camelCase` | `fetchInvoices()` |

---

## Mapeo de Módulos

| Módulo | Carpeta backend | Carpeta frontend | Tablas principales |
|--------|----------------|-----------------|-------------------|
| Autenticación | `auth/` | `auth/` | `users`, `roles`, `permissions` |
| Inventario | `inventory/` | `inventory/` | `products`, `stock`, `stock_movements` |
| Ventas | `sales/` | `sales/` | `invoices`, `invoice_items`, `quotes` |
| Clientes | `customers/` | `customers/` | `customers`, `customer_credit_log` |
| Proveedores | `suppliers/` | `suppliers/` | `suppliers`, `purchase_orders` |
| Reportes | `reports/` | `reports/` | *(vistas/queries, sin tablas propias)* |
