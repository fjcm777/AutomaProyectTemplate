# 05 - Database

## Convenciones generales

- Base de datos: PostgreSQL.
- Tablas: plural, snake_case, inglés.
- Columnas: snake_case, inglés.
- Primary key estándar: `id`.
- Fechas reales: `created_at`, `updated_at` con timezone.
- Día operativo: `business_date` tipo `DATE`.
- Montos: `NUMERIC(12,2)`.
- Tipo de cambio: `NUMERIC(12,6)`.
- Cantidades: `INTEGER`.
- Estados: `status`.
- Borrado lógico: `is_active`, `deleted_at`, `deleted_by`.

## Productos y variantes

Tablas:

- `products`
- `product_variants`
- `categories`
- `brands`
- `sizes`
- `colors`

`products`:

- `id`
- `name`
- `custom_code`
- `description`
- `category_id`
- `brand_id`
- `segment`
- `sale_price`
- `image_url`
- `is_active`
- `created_at`
- `updated_at`
- `deleted_at`
- `deleted_by`

`product_variants`:

- `id`
- `product_id`
- `size_id`
- `color_id`
- `barcode`
- `variant_code`
- `sale_price_override`
- `is_active`
- `created_at`
- `updated_at`
- `deleted_at`
- `deleted_by`

Regla: si `sale_price_override` es NULL, se usa `products.sale_price`.

## Inventario

Tablas:

- `branches`
- `warehouses`
- `inventory_stock`
- `inventory_movements`
- `inventory_movement_types`

`inventory_stock`:

- `id`
- `product_variant_id`
- `warehouse_id`
- `quantity_on_hand`
- `quantity_reserved`
- `quantity_damaged`
- `quantity_loaned`
- `quantity_supplier_return`
- `quantity_available`
- `updated_at`

Restricción:

```text
UNIQUE(product_variant_id, warehouse_id)
```

`inventory_movement_types`:

- `id`
- `code`
- `name`
- `description`
- `direction`
- `affects_stock`
- `affects_available`
- `is_system`
- `is_active`
- `created_at`
- `updated_at`

`inventory_movements`:

- `id`
- `product_variant_id`
- `warehouse_id`
- `movement_type_id`
- `quantity`
- `unit_cost`
- `reference_type`
- `reference_id`
- `reason`
- `created_by`
- `created_at`
- `business_date`

## Clientes

Tabla `customers`:

- `id`
- `first_name`
- `last_name`
- `phone`
- `address`
- `foot_size`
- `email`
- `identification_number`
- `birth_date`
- `notes`
- `photo_url`
- `current_balance`
- `is_active`
- `created_at`
- `updated_at`
- `deleted_at`
- `deleted_by`

Tabla `customer_balance_movements`:

- `id`
- `customer_id`
- `movement_type`
- `amount`
- `remaining_amount`
- `reference_type`
- `reference_id`
- `reason`
- `created_by`
- `created_at`
- `business_date`

## Ventas

Tablas:

- `sales`
- `sale_items`
- `sale_payments`
- `sale_returns`
- `sale_return_items`
- `payment_methods`

`sales`:

- `id`
- `sale_number`
- `customer_id`
- `branch_id`
- `cash_session_id`
- `source_type`
- `source_id`
- `sale_type`
- `status`
- `payment_status`
- `business_date`
- `subtotal_amount`
- `discount_amount`
- `tax_name`
- `tax_rate`
- `tax_amount`
- `total_amount`
- `paid_amount`
- `balance_due`
- `credit_due_date`
- `voided_at`
- `voided_by`
- `void_reason`
- `created_by`
- `created_at`
- `updated_at`

`sale_items`:

- `id`
- `sale_id`
- `product_variant_id`
- `quantity`
- `unit_price`
- `unit_cost`
- `discount_amount`
- `tax_rate`
- `tax_amount`
- `total_amount`
- `returned_quantity`
- `created_at`

Regla: ventas originadas desde apartados usan `source_type = "layaway"` y `source_id = layaways.id`.

## Apartados

Tablas:

- `layaways`
- `layaway_items`
- `layaway_payments`

Al completar un apartado, se genera una venta en `sales`.

## Caja

Tablas:

- `cash_sessions`
- `cash_movements`

`cash_sessions` contiene apertura y cierre de caja.

`cash_movements` contiene entradas y salidas.

## Proveedores y compras

Tablas:

- `suppliers`
- `purchases`
- `purchase_items`
- `supplier_payments`
- `supplier_returns`
- `supplier_return_items`
- `supplier_credits`
- `supplier_credit_applications`

Retornos a proveedor pueden quedar pendientes de resolución.

## Configuración, eventos y auditoría

Tablas:

- `settings`
- `exchange_rates`
- `audit_logs`
- `business_events`

`settings` vive en DB y guarda configuración funcional variable.

## Auth/RBAC

Tablas:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

Login solo con `username`.

## Seeds iniciales

Alembic debe sembrar:

- settings
- branches
- warehouses
- payment_methods
- categories
- brands
- sizes
- colors
- inventory_movement_types
- roles
- permissions
- role_permissions
- usuario admin inicial

## Constraints e índices

Restricciones importantes:

- `products.custom_code UNIQUE`
- `product_variants UNIQUE(product_id, size_id, color_id)`
- `inventory_stock UNIQUE(product_variant_id, warehouse_id)`
- `inventory_movement_types.code UNIQUE`
- `settings.key UNIQUE`
- `users.username UNIQUE`
- `roles.code UNIQUE`
- `permissions.code UNIQUE`

Checks:

- montos >= 0
- cantidades >= 0
- `tax_rate >= 0 AND tax_rate <= 100`
