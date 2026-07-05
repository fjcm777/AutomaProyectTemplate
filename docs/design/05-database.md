# 05 - Database

## Propósito

Este documento define el diccionario técnico de base de datos de Automata. Debe servir como referencia directa para SQLAlchemy, Alembic, validaciones backend, contratos API y desarrollo asistido por IA.

Este documento reemplaza cualquier versión resumida anterior de `05-database.md`.

## Convenciones técnicas

| Concepto | Estándar |
|---|---|
| Motor | PostgreSQL |
| Tablas | plural, snake_case, inglés |
| Columnas | snake_case, inglés |
| PK | `id BIGSERIAL` |
| FK | `BIGINT` |
| Dinero | `NUMERIC(12,2)` |
| Porcentaje | `NUMERIC(5,2)` |
| Tipo de cambio | `NUMERIC(12,6)` |
| Cantidades | `INTEGER` |
| Fecha/hora real | `TIMESTAMPTZ` |
| Día operativo | `DATE` |
| Texto corto | `VARCHAR(n)` |
| Texto largo | `TEXT` |
| JSON | `JSONB` |
| Estado | `VARCHAR(30)` con CHECK o validación backend |
| Borrado lógico | `is_active`, `deleted_at`, `deleted_by` |

## Reglas globales

1. No usar `FLOAT` para dinero.
2. Todo cambio de inventario debe generar `inventory_movements`.
3. Todo cambio de saldo a favor debe generar `customer_balance_movements`.
4. Las reglas complejas viven en `service.py`; DB protege integridad base.
5. Alembic debe crear tablas, constraints, índices y seeds iniciales.
6. No usar `Base.metadata.create_all()` en producción.
7. Las ventas guardan copia histórica de precio, costo e impuesto.
8. Los apartados completados generan una venta en `sales`.


## `users`

Usuarios del sistema.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| username | VARCHAR(50) | No | — | UNIQUE, INDEX | Login del usuario. |
| email | VARCHAR(255) | Sí | NULL | UNIQUE opcional | Correo de contacto; no login. |
| hashed_password | VARCHAR(255) | No | — | — | Hash Argon2. |
| first_name | VARCHAR(100) | No | — | — | Nombre. |
| last_name | VARCHAR(100) | No | — | — | Apellido. |
| is_active | BOOLEAN | No | true | INDEX | Habilita acceso. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado lógico. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario que desactiva. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

Login se realiza únicamente con `username`. El email es informativo.


## `roles`

Roles asignables a usuarios.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(50) | No | — | UNIQUE | Código técnico: admin, seller, etc. |
| name | VARCHAR(100) | No | — | — | Nombre visible. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| is_system | BOOLEAN | No | false | — | Rol base seed. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |


## `permissions`

Permisos sembrados por módulo.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(100) | No | — | UNIQUE | Código `resource.action`. |
| module | VARCHAR(50) | No | — | INDEX | Módulo dueño. |
| name | VARCHAR(150) | No | — | — | Nombre visible. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | — | Creación. |

**Reglas funcionales:**

Los permisos no se crean libremente desde UI en MVP; se siembran con Alembic.


## `user_roles`

Relación N:M entre usuarios y roles.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| user_id | BIGINT | No | — | PK, FK users.id | Usuario. |
| role_id | BIGINT | No | — | PK, FK roles.id | Rol. |
| created_at | TIMESTAMPTZ | No | now() | — | Asignación. |


## `role_permissions`

Relación N:M entre roles y permisos.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| role_id | BIGINT | No | — | PK, FK roles.id | Rol. |
| permission_id | BIGINT | No | — | PK, FK permissions.id | Permiso. |
| created_at | TIMESTAMPTZ | No | now() | — | Asignación. |


## `categories`

Catálogo `categories`.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| name | VARCHAR(100) | No | — | UNIQUE | Nombre. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado lógico. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

Catálogo manejado por módulo `products`.


## `brands`

Catálogo `brands`.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| name | VARCHAR(100) | No | — | UNIQUE | Marca. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado lógico. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

Catálogo manejado por módulo `products`.


## `sizes`

Catálogo `sizes`.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(30) | No | — | UNIQUE | Código talla. |
| name | VARCHAR(50) | No | — | — | Nombre visible. |
| sort_order | INTEGER | No | 0 | INDEX | Orden. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | — | Creación. |

**Reglas funcionales:**

Catálogo manejado por módulo `products`.


## `colors`

Catálogo `colors`.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(30) | No | — | UNIQUE | Código color. |
| name | VARCHAR(50) | No | — | — | Nombre. |
| hex_code | VARCHAR(7) | Sí | NULL | CHECK opcional | Color UI. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | — | Creación. |

**Reglas funcionales:**

Catálogo manejado por módulo `products`.


## `products`

Producto base comercial. No representa stock por sí mismo.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| custom_code | VARCHAR(50) | No | — | UNIQUE | Código interno alfanumérico, ej. F102. |
| name | VARCHAR(150) | No | — | INDEX | Nombre. |
| description | VARCHAR(500) | Sí | NULL | — | Descripción. |
| category_id | BIGINT | Sí | NULL | FK categories.id, INDEX | Categoría. |
| brand_id | BIGINT | Sí | NULL | FK brands.id, INDEX | Marca. |
| segment | VARCHAR(30) | No | 'unisex' | CHECK | men, women, unisex, kids. |
| sale_price | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Precio base. |
| image_url | VARCHAR(500) | Sí | NULL | — | Imagen principal. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado lógico. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

No guarda costo oficial principal. El costo histórico vive en compras, movimientos y venta.


## `product_variants`

Combinación vendible de producto, talla y color.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| product_id | BIGINT | No | — | FK products.id, UNIQUE compuesto | Producto. |
| size_id | BIGINT | Sí | NULL | FK sizes.id, UNIQUE compuesto | Talla. |
| color_id | BIGINT | Sí | NULL | FK colors.id, UNIQUE compuesto | Color. |
| variant_code | VARCHAR(80) | Sí | NULL | UNIQUE opcional | Código interno variante. |
| barcode | VARCHAR(100) | Sí | NULL | UNIQUE opcional | Barcode futuro. |
| sale_price_override | NUMERIC(12,2) | Sí | NULL | CHECK >= 0 | Precio específico. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado lógico. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Índices recomendados:**

`UNIQUE(product_id, size_id, color_id)`.

**Reglas funcionales:**

Si `sale_price_override` es NULL, usar `products.sale_price`.


## `branches`

Sucursal física/operativa.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(30) | No | — | UNIQUE | Código. |
| name | VARCHAR(100) | No | — | — | Nombre. |
| address | VARCHAR(255) | Sí | NULL | — | Dirección. |
| phone | VARCHAR(30) | Sí | NULL | — | Teléfono. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |


## `warehouses`

Bodega lógica o física dentro de una sucursal.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| branch_id | BIGINT | No | — | FK branches.id, INDEX | Sucursal. |
| code | VARCHAR(30) | No | — | UNIQUE | Código. |
| name | VARCHAR(100) | No | — | — | Nombre. |
| warehouse_type | VARCHAR(30) | No | 'storage' | CHECK | storage, display, damaged, supplier_return. |
| is_sellable | BOOLEAN | No | true | INDEX | Si permite venta. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

Bodegas iniciales: principal, exhibición, dañado/no vendible y retorno proveedor.


## `inventory_movement_types`

Tipos de movimiento de inventario sembrados.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(50) | No | — | UNIQUE | Código técnico. |
| name | VARCHAR(100) | No | — | — | Nombre visible. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| direction | VARCHAR(10) | No | — | CHECK in/out/neutral | Dirección. |
| affects_stock | BOOLEAN | No | true | — | Afecta físico. |
| affects_available | BOOLEAN | No | true | — | Afecta disponible. |
| is_system | BOOLEAN | No | true | — | Seed del sistema. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | — | Creación. |

**Reglas funcionales:**

Solo lectura en MVP.


## `inventory_stock`

Saldo actual por variante y bodega.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| product_variant_id | BIGINT | No | — | FK product_variants.id, UNIQUE compuesto | Variante. |
| warehouse_id | BIGINT | No | — | FK warehouses.id, UNIQUE compuesto | Bodega. |
| quantity_on_hand | INTEGER | No | 0 | CHECK >= 0 | Existencia física. |
| quantity_reserved | INTEGER | No | 0 | CHECK >= 0 | Reservado por apartados. |
| quantity_damaged | INTEGER | No | 0 | CHECK >= 0 | Dañado/no vendible. |
| quantity_loaned | INTEGER | No | 0 | CHECK >= 0 | Prestado. |
| quantity_supplier_return | INTEGER | No | 0 | CHECK >= 0 | Separado para retorno proveedor. |
| quantity_available | INTEGER | No | 0 | CHECK >= 0 | Disponible para venta. |
| updated_at | TIMESTAMPTZ | No | now() | — | Última actualización. |

**Índices recomendados:**

`UNIQUE(product_variant_id, warehouse_id)`.

**Reglas funcionales:**

Disponible = físico - reservado - dañado - prestado - retorno proveedor.


## `inventory_movements`

Trazabilidad de todo cambio de inventario.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| product_variant_id | BIGINT | No | — | FK product_variants.id, INDEX | Variante. |
| warehouse_id | BIGINT | No | — | FK warehouses.id, INDEX | Bodega. |
| movement_type_id | BIGINT | No | — | FK inventory_movement_types.id, INDEX | Tipo. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_cost | NUMERIC(12,2) | Sí | NULL | CHECK >= 0 | Costo histórico si aplica. |
| reference_type | VARCHAR(50) | Sí | NULL | INDEX compuesto | Entidad origen. |
| reference_id | BIGINT | Sí | NULL | INDEX compuesto | ID origen. |
| reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día operativo. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha real. |

**Índices recomendados:**

Índice compuesto `(reference_type, reference_id)`, índice por `business_date`.

**Reglas funcionales:**

No actualizar stock sin movimiento asociado.


## `customers`

Clientes del negocio.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| first_name | VARCHAR(100) | No | — | INDEX | Nombre. |
| last_name | VARCHAR(100) | No | — | INDEX | Apellido. |
| phone | VARCHAR(30) | No | — | INDEX | Teléfono. |
| address | VARCHAR(255) | No | — | — | Dirección. |
| foot_size | VARCHAR(20) | No | — | — | Talla de pie. |
| email | VARCHAR(255) | Sí | NULL | — | Correo. |
| identification_number | VARCHAR(50) | Sí | NULL | INDEX opcional | Identificación. |
| birth_date | DATE | Sí | NULL | — | Nacimiento. |
| notes | TEXT | Sí | NULL | — | Notas. |
| photo_url | VARCHAR(500) | Sí | NULL | — | Foto. |
| current_balance | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Saldo a favor. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |

**Reglas funcionales:**

Saldo no se modifica directamente; usar `customer_balance_movements`.


## `customer_balance_movements`

Movimientos de saldo a favor de clientes.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| customer_id | BIGINT | No | — | FK customers.id, INDEX | Cliente. |
| movement_type | VARCHAR(50) | No | — | CHECK/control backend | credit_created, credit_used, adjustment. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| remaining_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Restante. |
| reference_type | VARCHAR(50) | Sí | NULL | INDEX compuesto | Origen. |
| reference_id | BIGINT | Sí | NULL | INDEX compuesto | ID origen. |
| reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día operativo. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |

**Reglas funcionales:**

Devoluciones sobre venta no generan saldo a favor.


## `payment_methods`

Métodos de pago.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| code | VARCHAR(50) | No | — | UNIQUE | cash, transfer, card, customer_credit. |
| name | VARCHAR(100) | No | — | — | Nombre visible. |
| affects_cash | BOOLEAN | No | false | INDEX | Impacta caja. |
| requires_reference | BOOLEAN | No | false | — | Requiere referencia. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |


## `cash_sessions`

Sesiones de caja.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| branch_id | BIGINT | No | — | FK branches.id, INDEX | Sucursal. |
| opened_by | BIGINT | No | — | FK users.id | Usuario apertura. |
| closed_by | BIGINT | Sí | NULL | FK users.id | Usuario cierre. |
| business_date | DATE | No | — | INDEX | Día operativo. |
| status | VARCHAR(30) | No | 'open' | CHECK | open, closed, cancelled. |
| opening_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Monto inicial. |
| expected_amount | NUMERIC(12,2) | No | 0.00 | — | Esperado. |
| counted_amount | NUMERIC(12,2) | Sí | NULL | CHECK >= 0 | Contado. |
| difference_amount | NUMERIC(12,2) | No | 0.00 | — | Diferencia. |
| opened_at | TIMESTAMPTZ | No | now() | — | Apertura. |
| closed_at | TIMESTAMPTZ | Sí | NULL | — | Cierre. |
| notes | VARCHAR(500) | Sí | NULL | — | Notas. |

**Reglas funcionales:**

Caja se agrupa por `business_date`.


## `cash_movements`

Movimientos de caja.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| cash_session_id | BIGINT | No | — | FK cash_sessions.id, INDEX | Caja. |
| payment_method_id | BIGINT | Sí | NULL | FK payment_methods.id | Método. |
| movement_type | VARCHAR(30) | No | — | CHECK in/out | Entrada o salida. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| reference_type | VARCHAR(50) | Sí | NULL | INDEX compuesto | Origen. |
| reference_id | BIGINT | Sí | NULL | INDEX compuesto | ID origen. |
| reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `sales`

Ventas finales del sistema.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| sale_number | VARCHAR(50) | No | — | UNIQUE | Número venta. |
| customer_id | BIGINT | Sí | NULL | FK customers.id, INDEX | Cliente. |
| branch_id | BIGINT | No | — | FK branches.id, INDEX | Sucursal. |
| cash_session_id | BIGINT | Sí | NULL | FK cash_sessions.id | Caja. |
| source_type | VARCHAR(50) | Sí | NULL | INDEX | Origen: layaway. |
| source_id | BIGINT | Sí | NULL | INDEX | ID origen. |
| sale_type | VARCHAR(30) | No | 'cash' | CHECK | cash, credit. |
| status | VARCHAR(30) | No | 'completed' | CHECK | completed, voided, returned_partial, returned_total. |
| payment_status | VARCHAR(30) | No | 'paid' | CHECK | paid, partial, pending. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| subtotal_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Subtotal. |
| discount_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Descuento. |
| tax_name | VARCHAR(50) | Sí | NULL | — | Impuesto histórico. |
| tax_rate | NUMERIC(5,2) | No | 0.00 | CHECK 0-100 | Porcentaje. |
| tax_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Monto impuesto. |
| total_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| paid_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pagado. |
| balance_due | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pendiente. |
| credit_due_date | DATE | Sí | NULL | INDEX | Vencimiento crédito. |
| voided_at | TIMESTAMPTZ | Sí | NULL | — | Anulación. |
| voided_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| void_reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Actualización. |

**Reglas funcionales:**

Apartados completados generan venta con `source_type=layaway`.


## `sale_items`

Detalle de venta.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| sale_id | BIGINT | No | — | FK sales.id, INDEX | Venta. |
| product_variant_id | BIGINT | No | — | FK product_variants.id, INDEX | Variante. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_price | NUMERIC(12,2) | No | — | CHECK >= 0 | Precio histórico. |
| unit_cost | NUMERIC(12,2) | Sí | NULL | CHECK >= 0 | Costo histórico. |
| discount_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Descuento. |
| tax_rate | NUMERIC(5,2) | No | 0.00 | CHECK 0-100 | Impuesto. |
| tax_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Monto impuesto. |
| total_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| returned_quantity | INTEGER | No | 0 | CHECK >= 0 | Devuelto. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |

**Reglas funcionales:**

No recalcular históricos con valores actuales.


## `sale_payments`

Pagos de venta y abonos a crédito.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| sale_id | BIGINT | No | — | FK sales.id, INDEX | Venta. |
| payment_method_id | BIGINT | No | — | FK payment_methods.id | Método. |
| cash_session_id | BIGINT | Sí | NULL | FK cash_sessions.id | Caja. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| payment_reference | VARCHAR(100) | Sí | NULL | — | Referencia. |
| notes | VARCHAR(500) | Sí | NULL | — | Notas. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `sale_returns`

Devoluciones de venta.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| sale_id | BIGINT | No | — | FK sales.id, INDEX | Venta. |
| return_number | VARCHAR(50) | No | — | UNIQUE | Número. |
| refund_payment_method_id | BIGINT | No | — | FK payment_methods.id | Método devolución. |
| cash_session_id | BIGINT | Sí | NULL | FK cash_sessions.id | Caja. |
| reason | VARCHAR(500) | No | — | — | Motivo. |
| total_refund_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Monto devuelto. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |

**Reglas funcionales:**

Devuelve dinero; no genera saldo a favor.


## `sale_return_items`

Detalle de devolución.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| sale_return_id | BIGINT | No | — | FK sale_returns.id, INDEX | Devolución. |
| sale_item_id | BIGINT | No | — | FK sale_items.id, INDEX | Item venta. |
| product_variant_id | BIGINT | No | — | FK product_variants.id | Variante. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_refund_amount | NUMERIC(12,2) | No | — | CHECK >= 0 | Monto unitario. |
| return_to_inventory | BOOLEAN | No | true | — | Regresa inventario. |
| inventory_condition | VARCHAR(30) | No | 'sellable' | CHECK | sellable, damaged, not_sellable. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |


## `layaways`

Apartados.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| layaway_number | VARCHAR(50) | No | — | UNIQUE | Número. |
| customer_id | BIGINT | No | — | FK customers.id, INDEX | Cliente. |
| branch_id | BIGINT | No | — | FK branches.id | Sucursal. |
| cash_session_id | BIGINT | Sí | NULL | FK cash_sessions.id | Caja inicial. |
| status | VARCHAR(30) | No | 'active' | CHECK | active, completed, cancelled, expired. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| due_date | DATE | No | — | INDEX | Vencimiento. |
| subtotal_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Subtotal. |
| discount_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Descuento. |
| tax_name | VARCHAR(50) | Sí | NULL | — | Impuesto histórico. |
| tax_rate | NUMERIC(5,2) | No | 0.00 | CHECK 0-100 | Porcentaje. |
| tax_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Impuesto. |
| total_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| paid_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pagado. |
| balance_due | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pendiente. |
| completed_sale_id | BIGINT | Sí | NULL | FK sales.id | Venta generada. |
| cancel_reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Actualización. |

**Reglas funcionales:**

Al completar, crear venta en `sales` y relacionarla.


## `layaway_items`

Detalle de apartado.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| layaway_id | BIGINT | No | — | FK layaways.id, INDEX | Apartado. |
| product_variant_id | BIGINT | No | — | FK product_variants.id | Variante. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_price | NUMERIC(12,2) | No | — | CHECK >= 0 | Precio histórico. |
| discount_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Descuento. |
| tax_rate | NUMERIC(5,2) | No | 0.00 | CHECK 0-100 | Impuesto. |
| tax_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Monto impuesto. |
| total_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |


## `layaway_payments`

Pagos de apartado.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| layaway_id | BIGINT | No | — | FK layaways.id, INDEX | Apartado. |
| payment_method_id | BIGINT | No | — | FK payment_methods.id | Método. |
| cash_session_id | BIGINT | Sí | NULL | FK cash_sessions.id | Caja. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| payment_reference | VARCHAR(100) | Sí | NULL | — | Referencia. |
| notes | VARCHAR(500) | Sí | NULL | — | Notas. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `suppliers`

Proveedores.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| name | VARCHAR(150) | No | — | INDEX | Nombre. |
| contact_name | VARCHAR(100) | Sí | NULL | — | Contacto. |
| phone | VARCHAR(30) | Sí | NULL | INDEX | Teléfono. |
| email | VARCHAR(255) | Sí | NULL | — | Correo. |
| address | VARCHAR(255) | Sí | NULL | — | Dirección. |
| notes | TEXT | Sí | NULL | — | Notas. |
| current_balance | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Saldo por pagar. |
| is_active | BOOLEAN | No | true | INDEX | Estado. |
| deleted_at | TIMESTAMPTZ | Sí | NULL | — | Borrado. |
| deleted_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX según consulta | Fecha/hora real de creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Última actualización. |


## `purchases`

Compras a proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| purchase_number | VARCHAR(50) | No | — | UNIQUE | Número. |
| supplier_id | BIGINT | No | — | FK suppliers.id, INDEX | Proveedor. |
| branch_id | BIGINT | No | — | FK branches.id | Sucursal. |
| status | VARCHAR(30) | No | 'draft' | CHECK | draft, received, cancelled. |
| purchase_type | VARCHAR(30) | No | 'cash' | CHECK | cash, credit. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| subtotal_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Subtotal. |
| discount_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Descuento. |
| total_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| paid_amount | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pagado. |
| balance_due | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Pendiente. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Actualización. |


## `purchase_items`

Detalle de compra.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| purchase_id | BIGINT | No | — | FK purchases.id, INDEX | Compra. |
| product_variant_id | BIGINT | No | — | FK product_variants.id | Variante. |
| warehouse_id | BIGINT | No | — | FK warehouses.id | Bodega recepción. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_cost | NUMERIC(12,2) | No | — | CHECK >= 0 | Costo histórico. |
| total_cost | NUMERIC(12,2) | No | 0.00 | CHECK >= 0 | Total. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |

**Reglas funcionales:**

Al recibir compra se genera movimiento `purchase_in`.


## `supplier_payments`

Pagos a proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| supplier_id | BIGINT | No | — | FK suppliers.id, INDEX | Proveedor. |
| purchase_id | BIGINT | Sí | NULL | FK purchases.id, INDEX | Compra. |
| payment_method_id | BIGINT | No | — | FK payment_methods.id | Método. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| payment_reference | VARCHAR(100) | Sí | NULL | — | Referencia. |
| notes | VARCHAR(500) | Sí | NULL | — | Notas. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `supplier_returns`

Retornos a proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| return_number | VARCHAR(50) | No | — | UNIQUE | Número. |
| supplier_id | BIGINT | No | — | FK suppliers.id, INDEX | Proveedor. |
| status | VARCHAR(30) | No | 'created' | CHECK | created, sent, pending_compensation, completed, cancelled. |
| compensation_type | VARCHAR(30) | No | 'pending' | CHECK | pending, credit, refund, replacement, none. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| expected_resolution_date | DATE | Sí | NULL | INDEX | Fecha esperada. |
| resolved_at | TIMESTAMPTZ | Sí | NULL | — | Resolución. |
| resolution_notes | VARCHAR(500) | Sí | NULL | — | Notas. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Actualización. |

**Reglas funcionales:**

Pueden quedar pendientes y resolverse días después.


## `supplier_return_items`

Detalle de retorno proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| supplier_return_id | BIGINT | No | — | FK supplier_returns.id, INDEX | Retorno. |
| product_variant_id | BIGINT | No | — | FK product_variants.id | Variante. |
| warehouse_id | BIGINT | No | — | FK warehouses.id | Bodega origen. |
| quantity | INTEGER | No | — | CHECK > 0 | Cantidad. |
| unit_cost | NUMERIC(12,2) | Sí | NULL | CHECK >= 0 | Costo histórico. |
| reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |


## `supplier_credits`

Créditos otorgados por proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| supplier_id | BIGINT | No | — | FK suppliers.id, INDEX | Proveedor. |
| supplier_return_id | BIGINT | Sí | NULL | FK supplier_returns.id | Origen. |
| credit_number | VARCHAR(50) | No | — | UNIQUE | Número. |
| original_amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto original. |
| remaining_amount | NUMERIC(12,2) | No | — | CHECK >= 0 | Restante. |
| status | VARCHAR(30) | No | 'open' | CHECK | open, applied, cancelled. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `supplier_credit_applications`

Aplicaciones de créditos de proveedor.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| supplier_credit_id | BIGINT | No | — | FK supplier_credits.id, INDEX | Crédito. |
| purchase_id | BIGINT | Sí | NULL | FK purchases.id, INDEX | Compra. |
| amount | NUMERIC(12,2) | No | — | CHECK > 0 | Monto. |
| created_by | BIGINT | No | — | FK users.id | Usuario. |
| business_date | DATE | No | CURRENT_DATE | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |


## `settings`

Configuración funcional variable.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| key | VARCHAR(100) | No | — | UNIQUE | Clave. |
| value | TEXT | No | — | — | Valor serializado. |
| value_type | VARCHAR(30) | No | 'string' | CHECK | string, integer, decimal, boolean, json. |
| description | VARCHAR(255) | Sí | NULL | — | Descripción. |
| is_editable | BOOLEAN | No | true | INDEX | Editable UI. |
| is_sensitive | BOOLEAN | No | false | — | Auditoría especial. |
| created_at | TIMESTAMPTZ | No | now() | — | Creación. |
| updated_at | TIMESTAMPTZ | Sí | NULL | — | Actualización. |

**Reglas funcionales:**

Configuración técnica no va aquí; va en `.env`.


## `exchange_rates`

Tipo de cambio manual por fecha.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| rate_date | DATE | No | — | UNIQUE | Fecha. |
| currency_code | VARCHAR(3) | No | 'USD' | — | Moneda. |
| rate | NUMERIC(12,6) | No | — | CHECK > 0 | Tipo cambio. |
| source | VARCHAR(100) | Sí | NULL | — | Fuente. |
| created_by | BIGINT | Sí | NULL | FK users.id | Usuario. |
| created_at | TIMESTAMPTZ | No | now() | — | Fecha. |


## `audit_logs`

Auditoría de acciones sensibles.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| user_id | BIGINT | Sí | NULL | FK users.id, INDEX | Usuario. |
| action | VARCHAR(100) | No | — | INDEX | Acción. |
| entity_type | VARCHAR(100) | No | — | INDEX | Entidad. |
| entity_id | BIGINT | Sí | NULL | INDEX | ID entidad. |
| old_values | JSONB | Sí | NULL | — | Antes. |
| new_values | JSONB | Sí | NULL | — | Después. |
| reason | VARCHAR(500) | Sí | NULL | — | Motivo. |
| ip_address | VARCHAR(45) | Sí | NULL | — | IP. |
| user_agent | VARCHAR(500) | Sí | NULL | — | Agente. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |

**Reglas funcionales:**

No auditar cada consulta; auditar acciones sensibles.


## `business_events`

Eventos internos de negocio.

| Campo | Tipo PostgreSQL | Null | Default | Restricciones / Índices | Descripción |
| --- | --- | --- | --- | --- | --- |
| id | BIGSERIAL | No | auto | PK | Identificador. |
| event_type | VARCHAR(100) | No | — | INDEX | Tipo evento. |
| entity_type | VARCHAR(100) | No | — | INDEX | Entidad. |
| entity_id | BIGINT | Sí | NULL | INDEX | ID entidad. |
| payload | JSONB | Sí | NULL | — | Payload. |
| created_by | BIGINT | Sí | NULL | FK users.id | Usuario/sistema. |
| business_date | DATE | Sí | NULL | INDEX | Día. |
| created_at | TIMESTAMPTZ | No | now() | INDEX | Fecha. |



# Seeds iniciales

## Roles
`admin`, `manager`, `seller`, `cashier`, `warehouse`, `purchasing`, `accountant`.

## Settings
- `sales.tax_enabled`
- `sales.default_tax_rate`
- `sales.tax_name`
- `layaways.default_term_days`
- `layaways.minimum_down_payment_percent`
- `system.default_currency`
- `audit.retention_months`
- `events.retention_months`

## Métodos de pago
- `cash`
- `transfer`
- `card`
- `customer_credit`

## Tipos de movimiento inventario
- `purchase_in`
- `sale_out`
- `sale_void_in`
- `sale_return_in`
- `layaway_reserve`
- `layaway_release`
- `inventory_adjust_in`
- `inventory_adjust_out`
- `transfer_out`
- `transfer_in`
- `mark_damaged`
- `writeoff`
- `loan_out`
- `loan_return`
- `supplier_return_reserved`
- `supplier_return_out`
- `supplier_replacement_in`

# Decisiones futuras fuera del MVP

- Contabilidad formal con asientos.
- Facturación fiscal completa.
- Costeo avanzado promedio/FIFO.
- Multi-moneda operativa.
- Lotes/series.
