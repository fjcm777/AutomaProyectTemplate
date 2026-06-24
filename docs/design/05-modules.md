# 05 — Módulos del Sistema

## Patrón General Backend

Cada módulo funcional sigue la estructura:

```text
backend/app/modules/<module>/
├── api.py
├── models.py
├── schemas.py
├── repository.py
└── service.py
```

| Capa | Responsabilidad |
|------|-----------------|
| `api.py` | Endpoints HTTP, dependencias, status codes |
| `models.py` | Modelos SQLAlchemy |
| `schemas.py` | Schemas Pydantic |
| `repository.py` | Consultas y persistencia |
| `service.py` | Reglas de negocio |

---

## Módulos Backend

```text
backend/app/modules/
├── auth/
├── inventory/
├── sales/
├── customers/
├── suppliers/
├── reports/
└── accounting/          ← futuro
```

### `auth`

Modelos sugeridos:

```text
User
Role
Permission
RefreshToken
ActivityLog
```

### `inventory`

Modelos sugeridos:

```text
Category
Size
Color
Product
ProductVariant
Warehouse
Stock
StockReservation
StockMovement
```

`StockReservation` soporta apartados reservando unidades sin descontarlas definitivamente del inventario físico.

### `sales`

Modelos sugeridos:

```text
Invoice
InvoiceItem
CustomerPayment
SalesReturn
SalesReturnItem
Layaway
LayawayItem
LayawayPayment
LayawayAlert
```

El sistema de apartado debe implementarse como subproceso de ventas, no como módulo funcional independiente.

### `customers`

Modelos sugeridos:

```text
Customer
CustomerCreditLog
```

Debe permitir estado de cuenta, saldo de crédito, saldo vencido, abonos y consulta de apartados del cliente.

### `suppliers`

Modelos sugeridos:

```text
Supplier
PurchaseOrder
PurchaseOrderItem
PurchaseReturn
PurchaseReturnItem
SupplierPayment
```

### `reports`

No requiere modelos propios en la primera versión. Puede usar queries, vistas SQL o servicios de agregación.

### `accounting` (futuro)

Modelos sugeridos:

```text
ChartOfAccount
AccountingRule
FiscalPeriod
JournalEntry
JournalEntryLine
```

No debe ser llamado directamente por ventas o inventario. Debe consumir eventos internos.

---

## Infraestructura Interna Compartida

```text
backend/app/shared/
├── events/
│   ├── models.py
│   ├── schemas.py
│   ├── repository.py
│   └── service.py
├── audit/
├── notifications/
├── exceptions.py
└── pagination.py
```

### `shared/events`

No es módulo funcional. Sirve para registrar eventos como:

```text
invoice_issued
invoice_cancelled
customer_payment_received
layaway_created
layaway_payment_received
layaway_completed
layaway_overdue
purchase_order_received
inventory_adjustment_registered
```

---

## Patrón General Frontend

```text
frontend/src/features/<feature>/
├── api/
├── hooks/
├── components/
├── pages/
├── types/
└── index.ts
```

### `sales` en frontend

```text
frontend/src/features/sales/
├── api/
├── hooks/
├── components/
│   ├── invoices/
│   ├── payments/
│   ├── returns/
│   └── layaways/
├── pages/
│   ├── invoices/
│   └── layaways/
├── types/
└── index.ts
```

---

## Checklist para agregar un módulo

### Backend

1. Crear carpeta en `backend/app/modules/<module>/`.
2. Crear `models.py`, `schemas.py`, `repository.py`, `service.py`, `api.py`.
3. Registrar router en `main.py`.
4. Importar modelos en `db/base.py`.
5. Crear migración Alembic.
6. Agregar permisos RBAC.
7. Agregar tests.

### Frontend

1. Crear carpeta en `frontend/src/features/<feature>/`.
2. Crear tipos.
3. Crear cliente API.
4. Crear hooks React Query.
5. Crear páginas y componentes.
6. Registrar rutas.
7. Agregar navegación si aplica.

---

## Reglas de diseño

- No llamar repositorios desde `api.py`; siempre pasar por `service.py`.
- No mezclar reglas de venta, inventario y contabilidad directamente.
- Usar eventos internos para procesos cruzados.
- No eliminar documentos transaccionales; anular o revertir.
- Mantener el sistema de apartado dentro de ventas.
- Mantener reserva de inventario dentro de inventario.
