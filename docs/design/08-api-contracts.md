# 08 - API Contracts

## Objetivo

Definir la guía de endpoints del backend: rutas, métodos HTTP, permisos, request/response base, errores y reglas generales de API.

## Convenciones generales

Base URL:

```text
/api/v1
```

Formato principal:

- Request: JSON.
- Response: JSON.
- Uploads: `multipart/form-data`.

Autenticación:

```http
Authorization: Bearer <access_token>
```

Excepciones:

- `POST /api/v1/auth/login`
- `GET /api/v1/health`

## Respuesta estándar

Todas las respuestas JSON deben incluir `status_code`.

El HTTP status real debe coincidir con `status_code` del body.

### Respuesta exitosa

```json
{
  "status_code": 200,
  "message": "OK",
  "data": {}
}
```

### Respuesta de creación

```json
{
  "status_code": 201,
  "message": "Created",
  "data": {
    "id": 10
  }
}
```

### Respuesta de lista

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

### Respuesta de error

```json
{
  "status_code": 404,
  "code": "resource.not_found",
  "message": "El recurso solicitado no existe.",
  "details": {}
}
```

## Códigos HTTP principales

- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `422 Validation Error`
- `500 Internal Server Error`

## Reglas comunes

- `GET` lista: retorna `data.items`, `total`, `page`, `page_size`.
- `GET` detalle: retorna `data` con el objeto.
- `POST` crear: retorna `201` y `data` con id o resumen.
- `PUT` actualizar: retorna `200`.
- `DELETE`: desactiva o aplica borrado lógico.
- Acciones especiales usan `POST`.
- Uploads usan `multipart/form-data`.
- Endpoints protegidos requieren Bearer token y permiso.

## Auth

### POST /api/v1/auth/login

Permiso: ninguno.

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
      "permissions": [
        "products.view",
        "sales.create"
      ]
    }
  }
}
```

### GET /api/v1/auth/me

Permiso: usuario autenticado.

Devuelve usuario, roles y permisos.

### POST /api/v1/auth/logout

Permiso: usuario autenticado.

Regla: el backend responde OK, pero el logout real ocurre eliminando el token en frontend.

## Users / Roles / Permissions

Endpoints:

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

- Login solo usa `username`.
- `email` es dato de contacto.
- `username` obligatorio y único.
- Los permisos se siembran con Alembic.
- En MVP no se crean permisos libremente desde pantalla.

## Products

Endpoints:

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
/api/v1/products/categories
/api/v1/products/brands
/api/v1/products/sizes
/api/v1/products/colors
```

Reglas:

- `products` maneja catálogo, no stock.
- Variantes representan talla y color.
- `sale_price_override` permite precio especial.
- Imagen se sube como `multipart/form-data`.
- DB guarda `image_url`.

## Inventory

Endpoints:

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
/api/v1/inventory/branches
/api/v1/inventory/warehouses
/api/v1/inventory/movement-types
```

Reglas:

- `stock` muestra saldos actuales.
- `movements` muestra trazabilidad.
- Todo ajuste genera movimiento.
- Transferencias generan salida y entrada.
- Mercadería dañada deja de estar disponible.
- Baja requiere permiso especial.
- Mercadería prestada no es venta.
- `movement-types` es solo lectura en MVP.

## Customers

Endpoints:

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

Reglas:

- `first_name`, `last_name`, `phone`, `address` y `foot_size` son obligatorios.
- Foto se guarda como archivo y DB guarda `photo_url`.
- Saldo a favor no se modifica directamente.
- Todo cambio genera `customer_balance_movement`.
- Devoluciones sobre venta no generan saldo a favor.

## Sales

Endpoints:

```text
GET  /api/v1/sales
POST /api/v1/sales
GET  /api/v1/sales/{id}
POST /api/v1/sales/{id}/void
POST /api/v1/sales/{id}/return
GET  /api/v1/sales/{id}/payments
POST /api/v1/sales/{id}/payments
```

Subrecurso:

```text
GET    /api/v1/sales/payment-methods
POST   /api/v1/sales/payment-methods
PUT    /api/v1/sales/payment-methods/{id}
DELETE /api/v1/sales/payment-methods/{id}
```

Reglas:

- Crear venta descuenta inventario.
- Registra pagos.
- Si método afecta caja, registra `cash_movement`.
- Impuesto se toma desde `settings` y se copia a venta/detalle.
- `unit_price`, `unit_cost`, `tax_rate`, `tax_amount` son copia histórica.
- Venta a crédito puede quedar con `balance_due`.
- Si usa saldo a favor, se registra movimiento de saldo.
- Anulación solo mismo `business_date`.
- Anulación revierte inventario, pagos y caja.
- Devolución sobre venta devuelve dinero en el momento.
- Devolución no genera saldo a favor.

## Layaways

Endpoints:

```text
GET  /api/v1/layaways
POST /api/v1/layaways
GET  /api/v1/layaways/{id}
POST /api/v1/layaways/{id}/payments
POST /api/v1/layaways/{id}/cancel
POST /api/v1/layaways/{id}/extend
POST /api/v1/layaways/{id}/complete
```

Reglas:

- Apartado reserva inventario.
- Pagos viven en `layaway_payments`.
- Plazo y pago mínimo se toman de `settings`.
- Cancelación puede generar saldo a favor.
- Cambio de producto se maneja cancelando/liberando y creando nuevo apartado.
- Al completarse, genera una venta en `sales`.
- La venta usa `source_type = "layaway"` y `source_id = layaway.id`.
- No se debe descontar inventario dos veces.

## Cash

Endpoints:

```text
GET  /api/v1/cash/sessions
POST /api/v1/cash/open
GET  /api/v1/cash/sessions/{id}
POST /api/v1/cash/sessions/{id}/close
GET  /api/v1/cash/sessions/{id}/movements
POST /api/v1/cash/sessions/{id}/manual-movement
```

Reglas:

- Cada caja pertenece a un `business_date`.
- Cierre vive en `cash_sessions`.
- `cash_movements` guarda entradas y salidas.
- `expected_amount` se calcula.
- `counted_amount` lo registra usuario.
- `difference_amount` representa diferencia.
- Caja cerrada requiere confirmación para usar siguiente `business_date`.

## Suppliers

Endpoints:

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

- Retornos pueden quedar pendientes.
- Producto puede separarse como no vendible antes de enviarse.
- Compensación puede ser `credit`, `refund`, `replacement` o `none`.
- Crédito genera `supplier_credit`.
- Reemplazo genera entrada `supplier_replacement_in`.

## Purchases

Endpoints:

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

- `purchase_items.unit_cost` guarda costo histórico.
- Al recibir mercadería genera `purchase_in`.
- Compra puede ser contado o crédito.
- `supplier_payments` registra pagos y abonos.
- Crédito de proveedor se aplica mediante `supplier_credit_application`.

## Reports

Endpoints:

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

Regla: solo lectura.

## Settings

Endpoints:

```text
GET /api/v1/settings
GET /api/v1/settings/{key}
PUT /api/v1/settings/{key}

GET  /api/v1/settings/exchange-rates
POST /api/v1/settings/exchange-rates
PUT  /api/v1/settings/exchange-rates/{id}
```

Reglas:

- `settings` vive en DB.
- Solo se modifican settings editables.
- Backend valida `value_type`.
- Configuración técnica sigue en `.env`.
- Cambios sensibles registran auditoría.

Ejemplos:

- `sales.tax_enabled`
- `sales.default_tax_rate`
- `sales.tax_name`
- `layaways.default_term_days`
- `layaways.minimum_down_payment_percent`
- `system.default_currency`
- `audit.retention_months`
- `events.retention_months`
