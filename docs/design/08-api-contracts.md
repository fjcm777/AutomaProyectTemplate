# 08 - API Contracts

## Propósito

Este documento define los contratos de API de Automata hasta el MVP. Debe guiar endpoints FastAPI, schemas Pydantic, servicios frontend, manejo de errores y desarrollo asistido por IA.

La API debe ser consistente, predecible y suficientemente explícita para que el frontend y el backend puedan desarrollarse por módulos sin perder reglas de negocio.

---

## 1. Convenciones generales

| Concepto | Decisión |
|---|---|
| Base URL | `/api/v1` |
| Request/response principal | JSON |
| Uploads | `multipart/form-data` |
| Auth | Bearer token |
| Paginación | `items`, `total`, `page`, `page_size` |
| Acciones especiales | `POST` |
| Reports | Solo lectura |
| Movement types | Solo lectura en MVP |

Header de autenticación:

```http
Authorization: Bearer <access_token>
```

Endpoints públicos iniciales:

```text
POST /api/v1/auth/login
GET  /api/v1/health
```

---

## 2. Formato estándar de respuesta

Todas las respuestas JSON deben incluir `status_code` en el body.

Regla obligatoria:

```text
El HTTP status real debe coincidir con status_code del body.
```

### 2.1 Éxito

```json
{
  "status_code": 200,
  "message": "OK",
  "data": {}
}
```

### 2.2 Creación

```json
{
  "status_code": 201,
  "message": "Created",
  "data": {
    "id": 10
  }
}
```

### 2.3 Lista paginada

```json
{
  "status_code": 200,
  "message": "OK",
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "page_size": 20
  }
}
```

### 2.4 Error

```json
{
  "status_code": 404,
  "code": "resource.not_found",
  "message": "El recurso solicitado no existe.",
  "details": {
    "resource": "product",
    "id": 15
  }
}
```

---

## 3. HTTP status codes

| Código | Uso |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Regla de negocio inválida o request inconsistente |
| 401 | No autenticado |
| 403 | Sin permiso |
| 404 | Recurso no encontrado |
| 409 | Conflicto de estado o duplicado |
| 422 | Validación de schema |
| 500 | Error interno |

---

## 4. Reglas CRUD comunes

| Acción | Método | Regla |
|---|---|---|
| Listar | GET | Devuelve `items`, `total`, `page`, `page_size` |
| Detalle | GET | Devuelve objeto en `data` |
| Crear | POST | Devuelve 201 y `data.id` |
| Actualizar | PUT | Devuelve 200 y resumen |
| Desactivar | DELETE | Borrado lógico, no físico |
| Acción especial | POST | Usar verbo funcional en ruta |
| Upload | POST | `multipart/form-data` |

---

## 5. Query params comunes

Listas paginadas pueden usar:

```text
page
page_size
search
is_active
sort_by
sort_dir
```

Filtros por fecha deben usar:

```text
business_date_from
business_date_to
created_at_from
created_at_to
```

---

## 6. Auth

### Endpoints

```text
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### POST /auth/login

Request:

```json
{
  "username": "admin",
  "password": "********"
}
```

Response:

```json
{
  "status_code": 200,
  "message": "Login successful.",
  "data": {
    "access_token": "jwt_token",
    "token_type": "bearer",
    "expires_in": 28800,
    "user": {
      "id": 1,
      "username": "admin",
      "first_name": "Administrador",
      "last_name": "Sistema",
      "permissions": ["products.view", "sales.create"]
    }
  }
}
```

Reglas:

- Login solo con `username`.
- Email no se usa para login.
- Token dura 8 horas por defecto.
- Logout elimina token en frontend.

---

## 7. Users / Roles / Permissions

```text
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
POST   /api/v1/users/{id}/reset-password

GET    /api/v1/roles
POST   /api/v1/roles
PUT    /api/v1/roles/{id}
POST   /api/v1/roles/{id}/permissions

GET    /api/v1/permissions
```

Reglas:

- `username` obligatorio y único.
- `email` contacto opcional.
- DELETE desactiva.
- `roles/{id}/permissions` reemplaza permisos del rol.
- Permisos se siembran con Alembic.

Permisos:

```text
users.view/create/update/deactivate/reset_password
roles.view/create/update/assign_permissions
```

---

## 8. Products

```text
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/{id}
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
POST   /api/v1/products/{id}/image
POST   /api/v1/products/{id}/variants
PUT    /api/v1/products/variants/{variant_id}
DELETE /api/v1/products/variants/{variant_id}
```

Catálogos:

```text
GET/POST/PUT/DELETE /api/v1/products/categories
GET/POST/PUT/DELETE /api/v1/products/brands
GET/POST/PUT/DELETE /api/v1/products/sizes
GET/POST/PUT/DELETE /api/v1/products/colors
```

Crear producto:

```json
{
  "custom_code": "F102",
  "name": "Zapato escolar negro",
  "description": "Zapato escolar para niño",
  "category_id": 1,
  "brand_id": 1,
  "segment": "kids",
  "sale_price": 650.00
}
```

Crear variante:

```json
{
  "size_id": 1,
  "color_id": 1,
  "variant_code": "F102-37-NEGRO",
  "barcode": null,
  "sale_price_override": null
}
```

Reglas:

- Products maneja catálogo, no stock.
- Variantes representan talla/color.
- Imagen con `multipart/form-data`.
- DB guarda `image_url`.

---

## 9. Inventory

```text
GET  /api/v1/inventory/stock
GET  /api/v1/inventory/movements
POST /api/v1/inventory/adjustments
POST /api/v1/inventory/transfers
POST /api/v1/inventory/damaged
POST /api/v1/inventory/writeoff
POST /api/v1/inventory/loans
POST /api/v1/inventory/loans/{id}/return
```

Subrecursos:

```text
GET/POST/PUT/DELETE /api/v1/inventory/branches
GET/POST/PUT/DELETE /api/v1/inventory/warehouses
GET               /api/v1/inventory/movement-types
```

Filtros de stock:

```text
product_id
product_variant_id
warehouse_id
branch_id
category_id
brand_id
search
```

Ajuste:

```json
{
  "product_variant_id": 10,
  "warehouse_id": 1,
  "direction": "in",
  "quantity": 5,
  "unit_cost": 300.00,
  "reason": "Ajuste por conteo físico",
  "business_date": "2026-06-28"
}
```

Transferencia:

```json
{
  "product_variant_id": 10,
  "source_warehouse_id": 1,
  "target_warehouse_id": 2,
  "quantity": 3,
  "reason": "Traslado a exhibición",
  "business_date": "2026-06-28"
}
```

Reglas:

- Todo cambio genera movimiento.
- Transferencia genera salida y entrada.
- Dañado deja de estar disponible.
- Baja reduce existencia física.
- Prestado no es venta.
- Movement types solo lectura.

---

## 10. Customers

```text
GET    /api/v1/customers
POST   /api/v1/customers
GET    /api/v1/customers/{id}
PUT    /api/v1/customers/{id}
DELETE /api/v1/customers/{id}
POST   /api/v1/customers/{id}/photo
GET    /api/v1/customers/{id}/balance-movements
POST   /api/v1/customers/{id}/balance-adjustment
```

Crear cliente:

```json
{
  "first_name": "María",
  "last_name": "López",
  "phone": "8888-8888",
  "address": "Managua",
  "foot_size": "37",
  "email": null,
  "identification_number": "001-000000-0000A",
  "birth_date": null,
  "notes": "Cliente frecuente"
}
```

Ajuste saldo:

```json
{
  "movement_type": "credit_adjustment",
  "amount": 100.00,
  "reason": "Ajuste autorizado por gerencia.",
  "business_date": "2026-06-28"
}
```

Reglas:

- Saldo no se modifica directamente.
- Todo cambio genera movimiento.
- Devoluciones de venta no generan saldo a favor.

---

## 11. Sales

```text
GET  /api/v1/sales
POST /api/v1/sales
GET  /api/v1/sales/{id}
POST /api/v1/sales/{id}/void
POST /api/v1/sales/{id}/return
GET  /api/v1/sales/{id}/payments
POST /api/v1/sales/{id}/payments
GET/POST/PUT/DELETE /api/v1/sales/payment-methods
```

Crear venta:

```json
{
  "customer_id": 1,
  "sale_type": "cash",
  "business_date": "2026-06-28",
  "items": [
    {
      "product_variant_id": 10,
      "quantity": 1,
      "unit_price": 650.00,
      "discount_amount": 0.00
    }
  ],
  "payments": [
    {
      "payment_method_id": 1,
      "amount": 650.00,
      "payment_reference": null,
      "notes": null
    }
  ]
}
```

Anular:

```json
{
  "void_reason": "Error operativo en talla seleccionada.",
  "business_date": "2026-06-28"
}
```

Devolución:

```json
{
  "refund_payment_method_id": 1,
  "reason": "Cliente devuelve producto.",
  "business_date": "2026-06-28",
  "items": [
    {
      "sale_item_id": 50,
      "quantity": 1,
      "return_to_inventory": true,
      "inventory_condition": "sellable"
    }
  ]
}
```

Reglas:

- Venta descuenta inventario.
- Método con `affects_cash` registra caja.
- Venta crédito requiere cliente.
- Anulación solo mismo `business_date`.
- Devolución devuelve dinero y no genera saldo a favor.

---

## 12. Layaways

```text
GET  /api/v1/layaways
POST /api/v1/layaways
GET  /api/v1/layaways/{id}
POST /api/v1/layaways/{id}/payments
POST /api/v1/layaways/{id}/cancel
POST /api/v1/layaways/{id}/extend
POST /api/v1/layaways/{id}/complete
```

Crear apartado:

```json
{
  "customer_id": 1,
  "business_date": "2026-06-28",
  "due_date": "2026-08-28",
  "items": [
    {
      "product_variant_id": 10,
      "quantity": 1,
      "unit_price": 650.00
    }
  ],
  "initial_payment": {
    "payment_method_id": 1,
    "amount": 200.00
  }
}
```

Completar:

```json
{
  "business_date": "2026-06-28"
}
```

Reglas:

- Apartado reserva inventario.
- Pago mínimo y plazo vienen de `settings`.
- Cancelación puede generar saldo a favor.
- Completar genera venta en `sales`.
- Venta usa `source_type = "layaway"` y `source_id`.
- No descontar inventario dos veces.

---

## 13. Cash

```text
GET  /api/v1/cash/sessions
POST /api/v1/cash/open
GET  /api/v1/cash/sessions/{id}
POST /api/v1/cash/sessions/{id}/close
GET  /api/v1/cash/sessions/{id}/movements
POST /api/v1/cash/sessions/{id}/manual-movement
```

Abrir:

```json
{
  "branch_id": 1,
  "business_date": "2026-06-28",
  "opening_amount": 1000.00
}
```

Cerrar:

```json
{
  "counted_amount": 5400.00,
  "notes": "Cierre sin observaciones"
}
```

Reglas:

- Caja pertenece a `business_date`.
- Cierre calcula esperado, contado y diferencia.
- Movimiento manual requiere motivo.

---

## 14. Suppliers

```text
GET    /api/v1/suppliers
POST   /api/v1/suppliers
GET    /api/v1/suppliers/{id}
PUT    /api/v1/suppliers/{id}
DELETE /api/v1/suppliers/{id}
GET  /api/v1/suppliers/returns
POST /api/v1/suppliers/returns
GET  /api/v1/suppliers/returns/{id}
POST /api/v1/suppliers/returns/{id}/send
POST /api/v1/suppliers/returns/{id}/resolve
GET  /api/v1/suppliers/credits
POST /api/v1/suppliers/credits/{id}/apply
```

Reglas:

- Retorno a proveedor puede quedar pendiente.
- Producto puede separarse como no vendible.
- Resolución: credit, refund, replacement, none.
- Reemplazo genera entrada de inventario.

---

## 15. Purchases

```text
GET  /api/v1/purchases
POST /api/v1/purchases
GET  /api/v1/purchases/{id}
POST /api/v1/purchases/{id}/receive
POST /api/v1/purchases/{id}/cancel
GET  /api/v1/purchases/{id}/payments
POST /api/v1/purchases/{id}/payments
```

Reglas:

- Compra puede ser contado o crédito.
- Recepción genera `purchase_in`.
- `purchase_items.unit_cost` guarda costo histórico.
- Crédito proveedor se aplica mediante `supplier_credit_applications`.

---

## 16. Reports

```text
GET /api/v1/reports/sales
GET /api/v1/reports/inventory
GET /api/v1/reports/low-stock
GET /api/v1/reports/customer-credits
GET /api/v1/reports/layaways
GET /api/v1/reports/cash
GET /api/v1/reports/purchases
GET /api/v1/reports/supplier-returns
```

Regla:

```text
reports es solo lectura.
```

---

## 17. Settings

```text
GET /api/v1/settings
GET /api/v1/settings/{key}
PUT /api/v1/settings/{key}
GET  /api/v1/settings/exchange-rates
POST /api/v1/settings/exchange-rates
PUT  /api/v1/settings/exchange-rates/{id}
```

Reglas:

- Solo modificar settings editables.
- Backend valida `value_type`.
- Cambios sensibles auditan.
- Configuración técnica sigue en `.env`.

---

## 18. Códigos de error funcionales

| Código | Uso |
|---|---|
| `auth.invalid_credentials` | Login inválido |
| `auth.unauthorized` | Falta token |
| `auth.forbidden` | Sin permiso |
| `resource.not_found` | Recurso no existe |
| `resource.duplicate` | Valor único duplicado |
| `business.invalid_state` | Estado no permite acción |
| `inventory.insufficient_stock` | Stock insuficiente |
| `sales.void_not_allowed` | Anulación no permitida |
| `sales.return_not_allowed` | Devolución no permitida |
| `layaway.not_ready_to_complete` | Apartado no puede completarse |
| `cash.session_closed` | Caja cerrada |
| `validation.invalid_input` | Validación general |

---

## Complemento v4 - Acciones críticas

Esta sección completa endpoints críticos que requieren más detalle por afectar varios módulos.

### POST `/api/v1/inventory/loans`

Permiso:

```text
inventory.loan
```

Request:

```json
{
  "customer_id": null,
  "borrower_name": "Persona de confianza",
  "borrower_phone": "8888-8888",
  "product_variant_id": 10,
  "warehouse_id": 1,
  "quantity": 1,
  "expected_return_date": "2026-07-15",
  "reason": "Préstamo autorizado",
  "business_date": "2026-06-28"
}
```

Tablas afectadas:

- `inventory_loans`
- `inventory_stock`
- `inventory_movements`
- `business_events`

Eventos:

```text
inventory.loaned
```

Errores esperados:

- `inventory.insufficient_stock`
- `validation.invalid_input`
- `auth.forbidden`

### POST `/api/v1/inventory/loans/{id}/return`

Permiso:

```text
inventory.return_loan
```

Reglas:

- Solo préstamos `active`.
- Cambia préstamo a `returned`.
- Genera movimiento `loan_return`.
- Recalcula disponibilidad.

Evento:

```text
inventory.loan_returned
```

### POST `/api/v1/inventory/loans/{id}/convert-to-sale`

Permisos:

```text
inventory.loan
sales.create
```

Reglas:

- Solo préstamos `active`.
- Genera venta en `sales`.
- Marca préstamo como `converted_to_sale`.
- Guarda `converted_sale_id`.
- No descuenta inventario dos veces.

Eventos:

```text
inventory.loan_converted_to_sale
sale.created
```

### POST `/api/v1/sales`

Tablas afectadas:

- `sales`
- `sale_items`
- `sale_payments`
- `inventory_stock`
- `inventory_movements`
- `cash_movements`
- `business_events`

Eventos:

```text
sale.created
```

Errores esperados:

- `inventory.insufficient_stock`
- `cash.session_closed`
- `sales.customer_required_for_credit`
- `validation.invalid_input`

### POST `/api/v1/sales/{id}/void`

Tablas afectadas:

- `sales`
- `sale_payments`
- `inventory_stock`
- `inventory_movements`
- `cash_movements`
- `audit_logs`
- `business_events`

Eventos:

```text
sale.voided
```

Errores esperados:

- `sales.void_not_allowed`
- `business.invalid_state`
- `auth.forbidden`

### POST `/api/v1/sales/{id}/return`

Tablas afectadas:

- `sale_returns`
- `sale_return_items`
- `sales`
- `sale_items`
- `inventory_stock`
- `inventory_movements`
- `cash_movements`
- `audit_logs`
- `business_events`

Eventos:

```text
sale.returned
```

Errores esperados:

- `sales.return_not_allowed`
- `business.invalid_state`
- `auth.forbidden`

### POST `/api/v1/layaways/{id}/complete`

Tablas afectadas:

- `layaways`
- `sales`
- `sale_items`
- `sale_payments`
- `inventory_stock`
- `inventory_movements`
- `business_events`

Eventos:

```text
layaway.completed
sale.created
```

Errores esperados:

- `layaway.not_ready_to_complete`
- `business.invalid_state`
- `auth.forbidden`

### POST `/api/v1/suppliers/returns/{id}/resolve`

Tablas afectadas según resolución:

- `supplier_returns`
- `supplier_credits`
- `supplier_credit_applications`
- `inventory_stock`
- `inventory_movements`
- `audit_logs`
- `business_events`

Eventos:

```text
supplier_return.resolved
```

Errores esperados:

- `supplier_return.invalid_state`
- `validation.invalid_input`
- `auth.forbidden`

---

## Salidas mínimas de reportes

### GET `/api/v1/reports/sales`

Debe incluir:

```json
{
  "total_sales_amount": 0.00,
  "total_sales_count": 0,
  "cash_sales_amount": 0.00,
  "credit_sales_amount": 0.00,
  "returned_amount": 0.00,
  "voided_amount": 0.00,
  "tax_amount": 0.00
}
```

### GET `/api/v1/reports/inventory`

Debe incluir por variante/bodega:

```json
{
  "product_variant_id": 10,
  "warehouse_id": 1,
  "quantity_on_hand": 0,
  "quantity_available": 0,
  "quantity_reserved": 0,
  "quantity_damaged": 0,
  "quantity_loaned": 0,
  "quantity_supplier_return": 0
}
```

### GET `/api/v1/reports/cash`

Debe incluir:

```json
{
  "cash_session_id": 1,
  "business_date": "2026-06-28",
  "opening_amount": 0.00,
  "expected_amount": 0.00,
  "counted_amount": 0.00,
  "difference_amount": 0.00
}
```

---

# Complemento v5 - Contratos ajustados

## Pagos mixtos

Ventas y apartados aceptan multiples metodos de pago.

```json
{
  "customer_id": 1,
  "sale_type": "cash",
  "items": [
    { "product_variant_id": 10, "quantity": 1, "unit_price": 1000.00 }
  ],
  "payments": [
    { "payment_method_code": "customer_credit", "amount": 500.00 },
    { "payment_method_code": "cash", "amount": 500.00 }
  ]
}
```

Reglas:

- `customer_credit` requiere cliente.
- `customer_credit` no afecta caja.
- Pagos con `affects_cash=true` generan `cash_movements`.
- La suma de pagos no debe exceder el total requerido.

## POST `/api/v1/customers/{id}/credit-refund`

Reembolsa saldo a favor del cliente.

Permiso: `customers.balance_refund`

```json
{
  "amount": 500.00,
  "payment_method_id": 1,
  "reason": "Reembolso autorizado de saldo a favor",
  "business_date": "2026-06-28"
}
```

Tablas afectadas:

- `customers`
- `customer_balance_movements`
- `customer_credit_applications`
- `cash_movements` si metodo afecta caja
- `audit_logs`
- `business_events`

Errores:

| Codigo | Causa |
|---|---|
| customer.insufficient_credit | Saldo insuficiente |
| auth.forbidden | Sin permiso |
| validation.invalid_input | Monto/motivo invalido |
| cash.session_closed | Caja cerrada si metodo afecta caja |

## POST `/api/v1/sales/{id}/void`

Si la venta uso `customer_credit`, la anulacion restaura el saldo usado.

## POST `/api/v1/purchases/{id}/cancel`

Solo permitido si `purchases.status = draft`.

Si la compra esta `received`, devolver:

```json
{
  "status_code": 409,
  "code": "business.invalid_state",
  "message": "Una compra recibida no puede cancelarse directamente.",
  "details": { "current_status": "received" }
}
```

## POST `/api/v1/suppliers/returns/{id}/cancel`

Solo permitido si `supplier_returns.status = created`.

## GET `/api/v1/reports/sales`

Salida minima ampliada:

```json
{
  "total_sales_amount": 0.00,
  "total_sales_count": 0,
  "cash_sales_amount": 0.00,
  "credit_sales_amount": 0.00,
  "returned_amount": 0.00,
  "voided_amount": 0.00,
  "tax_amount": 0.00,
  "estimated_cost": 0.00,
  "estimated_profit": 0.00,
  "estimated_margin_percent": 0.00
}
```

`estimated_profit` es utilidad operativa estimada, no contabilidad formal.
