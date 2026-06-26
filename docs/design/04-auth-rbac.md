# 04 — Auth + RBAC

## Flujo de Autenticación

```text
Login
  │
  ├── POST /auth/login { email, password }
  │     ├── Verificar credenciales
  │     ├── Generar Access Token
  │     └── Generar Refresh Token
  │
  ├── Requests protegidos
  │     ├── Authorization: Bearer <token>
  │     ├── Decodificar JWT
  │     ├── Verificar usuario activo
  │     ├── Verificar permisos
  │     └── Continuar / 401 / 403
  │
  └── POST /auth/refresh { refresh_token }
```

---

## Endpoints de Auth

| Método | Endpoint | Permiso requerido | Descripción |
|--------|----------|-------------------|-------------|
| `POST` | `/auth/login` | Público | Login |
| `POST` | `/auth/logout` | Autenticado | Revoca refresh token |
| `POST` | `/auth/refresh` | Público | Renueva access token |
| `GET` | `/auth/me` | Autenticado | Usuario actual y permisos |
| `GET` | `/users` | `users.view` | Lista usuarios |
| `POST` | `/users` | `users.manage` | Crear usuario |
| `PUT` | `/users/{id}` | `users.manage` | Editar usuario |
| `GET` | `/roles` | `users.manage` | Lista roles |
| `POST` | `/auth/revoke-sessions/{user_id}` | `users.manage` | Revoca sesiones activas de usuario |

---

## Permisos del Sistema

| Módulo | Acción | Descripción |
|--------|--------|-------------|
| `users` | `view` | Ver usuarios |
| `users` | `manage` | Crear, editar, desactivar usuarios y revocar sesiones |
| `inventory` | `view` | Ver productos y stock |
| `inventory` | `edit` | Crear y editar productos |
| `inventory` | `adjust` | Ajustes de inventario |
| `inventory` | `transfer` | Traslados entre bodegas |
| `inventory` | `reserve` | Reservar o liberar stock por apartado |
| `sales` | `view` | Ver facturas, pagos y apartados |
| `sales` | `create` | Crear ventas/facturas |
| `sales` | `cancel` | Anular facturas |
| `sales` | `discount` | Aplicar descuentos |
| `sales` | `collect` | Registrar pagos |
| `sales` | `layaway_create` | Crear apartados |
| `sales` | `layaway_pay` | Registrar pagos de apartados |
| `sales` | `layaway_cancel` | Cancelar apartados |
| `sales` | `layaway_release` | Liberar inventario de apartados vencidos/cancelados |
| `customers` | `view` | Ver clientes |
| `customers` | `manage` | Crear y editar clientes |
| `customers` | `credit_view` | Ver crédito y estado de cuenta |
| `customers` | `credit_approve` | Aprobar o modificar crédito |
| `suppliers` | `view` | Ver proveedores y órdenes |
| `suppliers` | `manage` | Crear y editar proveedores |
| `suppliers` | `purchase_order` | Crear órdenes de compra |
| `suppliers` | `pay` | Registrar pagos a proveedores |
| `reports` | `sales` | Reportes de ventas |
| `reports` | `inventory` | Reportes de inventario |
| `reports` | `financial` | CxC, CxP y reportes financieros operativos |
| `reports` | `dashboard` | Dashboard |
| `reports` | `audit` | Reporte de auditoría |
| `accounting` | `view` | Ver información contable |
| `accounting` | `manage_accounts` | Gestionar catálogo de cuentas |
| `accounting` | `manage_rules` | Configurar reglas contables |
| `accounting` | `post_entries` | Crear/aprobar asientos |
| `accounting` | `cancel_entries` | Anular asientos |
| `accounting` | `reports` | Ver reportes contables |
| `accounting` | `close_period` | Cierre de período |

---

## Roles y Permisos

### Admin

Acceso total.

### Manager

| Módulo | Permisos |
|--------|----------|
| `inventory` | `view` |
| `sales` | `view`, `cancel` |
| `customers` | `view`, `manage`, `credit_view`, `credit_approve` |
| `suppliers` | `view` |
| `reports` | `sales`, `inventory`, `financial`, `dashboard`, `audit` |

### Seller

| Módulo | Permisos |
|--------|----------|
| `inventory` | `view` |
| `sales` | `view`, `create`, `discount`, `collect`, `layaway_create`, `layaway_pay` |
| `customers` | `view`, `manage`, `credit_view` |
| `reports` | `sales` |

### Cashier

| Módulo | Permisos |
|--------|----------|
| `sales` | `view`, `collect`, `layaway_pay` |
| `customers` | `view`, `credit_view` |

### Warehouse

| Módulo | Permisos |
|--------|----------|
| `inventory` | `view`, `edit`, `adjust`, `transfer`, `reserve` |
| `suppliers` | `view`, `purchase_order` |
| `reports` | `inventory` |

### Purchasing

| Módulo | Permisos |
|--------|----------|
| `inventory` | `view` |
| `suppliers` | `view`, `manage`, `purchase_order`, `pay` |

### Accountant

| Módulo | Permisos |
|--------|----------|
| `sales` | `view` |
| `customers` | `view`, `credit_view` |
| `suppliers` | `view` |
| `reports` | `financial` |
| `accounting` | `view`, `manage_accounts`, `manage_rules`, `post_entries`, `cancel_entries`, `reports`, `close_period` |

---

## Observaciones

- `Accountant` es un rol preparado para una fase futura.
- Los permisos de apartado pertenecen a `sales`.
- La reserva/liberación de inventario por apartado requiere permiso de inventario o acción automática del sistema.
- La revocación de sesiones se implementa revocando refresh tokens activos.


---

## Permisos adicionales por observaciones

| Módulo | Acción | Descripción |
|--------|--------|-------------|
| `inventory` | `view` | Permite a Seller consultar productos disponibles |
| `sales` | `return` | Registrar devoluciones de venta |
| `accounting` | `close_period` | Cerrar período contable **(Segunda etapa)** |
| `accounting` | `reopen_period` | Reabrir período contable con permiso especial **(Segunda etapa)** |
| `accounting` | `generate_closing_entries` | Generar asientos de cierre **(Segunda etapa)** |
| `accounting` | `bank_reconciliation_view` | Ver conciliaciones bancarias **(Segunda etapa)** |
| `accounting` | `bank_reconciliation_manage` | Gestionar conciliaciones bancarias **(Segunda etapa)** |
| `accounting` | `import_bank_transactions` | Importar movimientos bancarios **(Segunda etapa)** |

Notas:

- `Seller` debe tener `inventory.view` para confirmar existencia de productos a clientes.
- Las devoluciones sobre ventas deben quedar auditadas y generar efectos en inventario y contabilidad.
- Los permisos de cierre contable y conciliación bancaria pertenecen a segunda etapa.


---

## Permisos adicionales para caja y arqueo

| Módulo | Acción | Descripción |
|--------|--------|-------------|
| `cash` | `open` | Abrir caja del día operativo |
| `cash` | `view` | Consultar resumen esperado de caja |
| `cash` | `movement` | Registrar movimientos manuales de caja |
| `cash` | `count` | Realizar arqueo de caja |
| `cash` | `close` | Cerrar caja |
| `cash` | `reopen` | Reabrir caja con permiso especial |
| `cash` | `approve_difference` | Aprobar diferencias de caja |

| Rol | Permisos sugeridos |
|-----|--------------------|
| Cashier | `cash.open`, `cash.view`, `cash.movement`, `cash.count`, `cash.close` |
| Seller | Consulta de caja asociada a sus ventas |
| Manager | `cash.view`, `cash.count`, `cash.close`, `cash.approve_difference`, `cash.reopen` |
| Admin | Todos los permisos de caja |
| Accountant | Consulta de caja y diferencias, principalmente para segunda etapa contable |


---

## Permisos adicionales para mercadería prestada, dañada y retorno a proveedor

| Módulo | Acción | Descripción |
|---|---|---|
| `inventory` | `loan_goods_create` | Registrar mercadería prestada |
| `inventory` | `loan_goods_return` | Registrar devolución de mercadería prestada |
| `inventory` | `loan_goods_convert_sale` | Convertir mercadería prestada en venta |
| `inventory` | `loan_goods_view` | Consultar mercadería prestada |
| `inventory` | `damaged_goods_create` | Registrar mercadería dañada |
| `inventory` | `damaged_goods_view` | Consultar mercadería dañada |
| `inventory` | `damaged_goods_write_off` | Dar de baja mercadería dañada |
| `suppliers` | `supplier_return_create` | Registrar retorno a proveedor |
| `suppliers` | `supplier_return_manage` | Gestionar estados de retorno |
| `suppliers` | `supplier_credit_create` | Registrar crédito a favor |
| `suppliers` | `supplier_credit_apply` | Aplicar crédito a compra futura |
| `suppliers` | `supplier_credit_view` | Consultar créditos disponibles |

| Rol | Permisos sugeridos |
|---|---|
| Seller | Mercadería prestada y conversión en venta |
| Warehouse | Mercadería prestada, devolución, mercadería dañada y salida por retorno |
| Purchasing | Retorno a proveedor y créditos de proveedor |
| Manager | Aprobación, baja y gestión de diferencias |
| Admin | Todos los permisos |
| Accountant | Consulta de créditos y efectos contables en segunda etapa |
