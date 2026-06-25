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


---

## Ajustes derivados de observaciones

1. Las devoluciones de venta deben afectar ventas, inventario y contabilidad.
2. `Seller` debe poder consultar disponibilidad de productos mediante `inventory.view`.
3. La conciliación bancaria se documenta como subproceso de contabilidad en **segunda etapa**.
4. `CU-601` debe llamarse **Gestionar catálogo de cuentas contables**.
5. El cierre contable se documenta como subproceso de contabilidad en **segunda etapa**.

### Subestructura futura de `accounting`

```text
backend/app/modules/accounting/
├── accounts/                ← catálogo de cuentas contables
├── rules/                   ← reglas contables
├── journal/                 ← asientos de diario
├── fiscal_periods/          ← períodos fiscales
├── closing/                 ← cierre contable (Segunda etapa)
└── bank_reconciliation/     ← conciliación bancaria (Segunda etapa)
```

### Tablas futuras para conciliación bancaria

```text
bank_accounts
bank_transactions
bank_reconciliations
bank_reconciliation_items
```


---

## Subproceso `sales/cash_register`

El arqueo de caja se implementa como subproceso de ventas.

### Backend

```text
backend/app/modules/sales/cash_register/
├── models.py
├── schemas.py
├── repository.py
├── service.py
└── api.py
```

Modelos sugeridos:

```text
CashRegister
CashSession
CashSessionPayment
CashMovement
CashCount
```

### Frontend

```text
frontend/src/features/sales/cash-register/
├── api/
├── hooks/
├── components/
├── pages/
├── types/
└── index.ts
```

Pantallas sugeridas:

```text
Apertura de caja
Resumen de caja
Registro de movimiento manual
Arqueo de caja
Cierre de caja
Historial de cajas
Diferencias de caja
```

Reglas:

- Toda venta o pago debe asociarse a una `cash_session` cuando corresponda.
- El sistema debe usar `business_date` para determinar el día operativo.
- Si una caja ya fue cerrada, las ventas posteriores deben asignarse al siguiente `business_date`.
- Las diferencias de caja deben quedar auditadas.
- Los efectos contables por sobrantes/faltantes pueden implementarse en segunda etapa.
