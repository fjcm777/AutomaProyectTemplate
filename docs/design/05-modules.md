# 05 — Estructura de Módulos

## Patrón de un Módulo Backend

Cada módulo sigue exactamente la misma estructura de 5 capas:

```
modules/<nombre>/
├── api.py          ← Endpoints (FastAPI Router)
├── models.py       ← Modelos SQLAlchemy (tablas de DB)
├── schemas.py      ← Schemas Pydantic (validación y serialización)
├── repository.py   ← Acceso a base de datos (queries)
└── service.py      ← Lógica de negocio
```

### Responsabilidad de cada capa

| Archivo | Responsabilidad |
|---------|----------------|
| `api.py` | Recibe el request HTTP, valida con schemas, llama al service, retorna respuesta |
| `models.py` | Define la estructura de las tablas en PostgreSQL |
| `schemas.py` | Define qué datos entran y salen de cada endpoint |
| `repository.py` | Todas las queries a la DB. Sin lógica de negocio |
| `service.py` | Lógica de negocio. Orquesta el repository. Lanza excepciones de dominio |

---

## Patrón de un Módulo Frontend

Cada feature sigue la misma estructura:

```
features/<nombre>/
├── pages/          ← Páginas completas (rutas)
├── components/     ← Componentes específicos del módulo
├── hooks/          ← Hooks con TanStack Query
├── api/            ← Llamadas HTTP al backend
└── types/          ← Tipos TypeScript del módulo
```

---

## Estructura Completa del Proyecto

### Backend

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py               ← Settings con pydantic-settings
│   │   ├── database.py             ← Engine y SessionLocal
│   │   └── dependencies.py        ← Dependencias compartidas
│   ├── db/
│   │   └── base.py                 ← Importa todos los modelos (para Alembic)
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── api.py
│   │   │   ├── models.py           ← User, Role, Permission, RolePermission
│   │   │   │                          RefreshToken, ActivityLog
│   │   │   ├── schemas.py          ← LoginRequest, TokenResponse, UserOut
│   │   │   │                          UserCreate, UserUpdate, RoleOut
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── dependencies.py    ← get_current_user(), require_permission()
│   │   │
│   │   ├── inventory/
│   │   │   ├── api.py
│   │   │   ├── models.py           ← Product, Category, Warehouse
│   │   │   │                          Stock, StockMovement
│   │   │   ├── schemas.py          ← ProductCreate, ProductOut, StockOut
│   │   │   │                          StockMovementOut, WarehouseOut
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── sales/
│   │   │   ├── api.py
│   │   │   ├── models.py           ← Invoice, InvoiceItem
│   │   │   │                          Quote, QuoteItem, CustomerPayment
│   │   │   ├── schemas.py          ← InvoiceCreate, InvoiceOut
│   │   │   │                          QuoteCreate, PaymentCreate
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── customers/
│   │   │   ├── api.py
│   │   │   ├── models.py           ← Customer, CustomerCreditLog
│   │   │   ├── schemas.py          ← CustomerCreate, CustomerOut
│   │   │   │                          CreditLogOut
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── suppliers/
│   │   │   ├── api.py
│   │   │   ├── models.py           ← Supplier, PurchaseOrder
│   │   │   │                          PurchaseOrderItem, SupplierPayment
│   │   │   ├── schemas.py          ← SupplierCreate, PurchaseOrderCreate
│   │   │   │                          PurchaseOrderOut
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   └── reports/
│   │       ├── api.py
│   │       ├── schemas.py          ← SalesReportOut, InventoryReportOut
│   │       │                          FinancialReportOut, DashboardOut
│   │       └── service.py          ← Queries analíticas (sin modelos propios)
│   │
│   └── main.py                     ← Registro de routers, CORS, middleware
│
├── alembic/
│   ├── versions/                   ← Archivos de migración
│   └── env.py
├── alembic.ini
├── requirements.txt
└── Dockerfile
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.tsx                 ← Shell principal de la app
│   │   └── router/
│   │       └── router.tsx          ← Definición de rutas con React Router
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── pages/
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   ├── StockPage.tsx
│   │   │   │   └── StockMovementsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── StockTable.tsx
│   │   │   │   └── StockAdjustmentModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useStock.ts
│   │   │   ├── api/
│   │   │   │   └── inventoryApi.ts
│   │   │   └── types/
│   │   │       └── inventory.types.ts
│   │   │
│   │   ├── sales/
│   │   │   ├── pages/
│   │   │   │   ├── InvoicesPage.tsx
│   │   │   │   ├── InvoiceDetailPage.tsx
│   │   │   │   ├── CreateInvoicePage.tsx
│   │   │   │   └── QuotesPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   ├── InvoiceTable.tsx
│   │   │   │   ├── InvoiceItemsTable.tsx
│   │   │   │   └── PaymentModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useInvoices.ts
│   │   │   │   └── useQuotes.ts
│   │   │   ├── api/
│   │   │   │   └── salesApi.ts
│   │   │   └── types/
│   │   │       └── sales.types.ts
│   │   │
│   │   ├── customers/
│   │   │   ├── pages/
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   └── CustomerDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   ├── CustomerTable.tsx
│   │   │   │   └── CreditStatementModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCustomers.ts
│   │   │   ├── api/
│   │   │   │   └── customersApi.ts
│   │   │   └── types/
│   │   │       └── customers.types.ts
│   │   │
│   │   ├── suppliers/
│   │   │   ├── pages/
│   │   │   │   ├── SuppliersPage.tsx
│   │   │   │   └── PurchaseOrdersPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── SupplierForm.tsx
│   │   │   │   └── PurchaseOrderForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSuppliers.ts
│   │   │   ├── api/
│   │   │   │   └── suppliersApi.ts
│   │   │   └── types/
│   │   │       └── suppliers.types.ts
│   │   │
│   │   └── reports/
│   │       ├── pages/
│   │       │   ├── DashboardPage.tsx
│   │       │   ├── SalesReportPage.tsx
│   │       │   ├── InventoryReportPage.tsx
│   │       │   └── FinancialReportPage.tsx
│   │       ├── components/
│   │       │   ├── KpiCard.tsx
│   │       │   └── ReportChart.tsx
│   │       ├── hooks/
│   │       │   └── useReports.ts
│   │       ├── api/
│   │       │   └── reportsApi.ts
│   │       └── types/
│   │           └── reports.types.ts
│   │
│   └── shared/
│       ├── api/
│       │   └── apiClient.ts        ← Cliente HTTP centralizado (fetch wrapper)
│       ├── components/
│       │   ├── Button.tsx
│       │   ├── Table.tsx
│       │   ├── Modal.tsx
│       │   ├── Form/
│       │   ├── Pagination.tsx
│       │   └── PermissionGuard.tsx ← Oculta UI según permisos del usuario
│       ├── hooks/
│       │   ├── usePagination.ts
│       │   └── useDebounce.ts
│       ├── types/
│       │   └── common.types.ts     ← PaginatedResponse<T>, ApiError, etc.
│       └── utils/
│           └── formatters.ts       ← Fechas, moneda, etc.
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── Dockerfile
```

---

## Cómo Agregar un Nuevo Módulo

### Backend — checklist

- [ ] Crear carpeta `backend/app/modules/<nombre>/`
- [ ] Crear los 5 archivos: `api.py`, `models.py`, `schemas.py`, `repository.py`, `service.py`
- [ ] Importar el modelo en `backend/app/db/base.py`
- [ ] Registrar el router en `backend/app/main.py`
- [ ] Crear migración: `alembic revision --autogenerate -m "add <nombre> module"`
- [ ] Agregar los permisos del módulo en la tabla `permissions`

### Frontend — checklist

- [ ] Crear carpeta `frontend/src/features/<nombre>/`
- [ ] Crear subcarpetas: `pages/`, `components/`, `hooks/`, `api/`, `types/`
- [ ] Crear el archivo de tipos: `<nombre>.types.ts`
- [ ] Crear el archivo de API: `<nombre>Api.ts`
- [ ] Agregar las rutas en `router.tsx`
- [ ] Agregar el enlace en el menú de navegación
