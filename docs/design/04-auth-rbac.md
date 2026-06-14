# 04 — Auth + RBAC

## Flujo de Autenticación

```
Login
  │
  ├── POST /auth/login  { email, password }
  │         │
  │         ├── Verificar credenciales (bcrypt)
  │         ├── Generar Access Token  (JWT · expira en 30 min)
  │         └── Generar Refresh Token (JWT · expira en 7 días)
  │
  │   Cada request protegido:
  │         │
  │         ├── Header: Authorization: Bearer <access_token>
  │         ├── Decodificar JWT → obtener user_id + role
  │         ├── Verificar permiso requerido del rol
  │         └── ✅ Continúa  /  ❌ 401 / 403
  │
  └── POST /auth/refresh  { refresh_token }
            └── Emitir nuevo access_token sin re-login
```

---

## Flujo de Verificación de Permiso

```
Request con JWT
      │
      ▼
¿Token válido y no expirado?
      │
   No ──→ 401 Unauthorized
      │
     Sí
      │
      ▼
¿Usuario activo?
      │
   No ──→ 403 Forbidden
      │
     Sí
      │
      ▼
¿El rol del usuario tiene el permiso requerido?
      │
   No ──→ 403 Forbidden  "No tienes permiso para esta acción"
      │
     Sí
      │
      ▼
✅ Ejecutar endpoint
```

---

## Endpoints del Módulo Auth

| Método | Endpoint | Permiso requerido | Descripción |
|--------|----------|-------------------|-------------|
| `POST` | `/auth/login` | Público | Login, retorna access y refresh token |
| `POST` | `/auth/logout` | Autenticado | Revoca el refresh token |
| `POST` | `/auth/refresh` | Público | Renueva el access token |
| `GET` | `/auth/me` | Autenticado | Info del usuario actual + permisos |
| `GET` | `/users` | `users.view` | Lista de usuarios |
| `POST` | `/users` | `users.manage` | Crear usuario |
| `PUT` | `/users/{id}` | `users.manage` | Editar usuario |
| `GET` | `/roles` | `users.manage` | Lista de roles con sus permisos |

---

## Permisos del Sistema

| Módulo | Acción | Descripción |
|--------|--------|-------------|
| `users` | `view` | Ver lista de usuarios |
| `users` | `manage` | Crear, editar y desactivar usuarios |
| `inventory` | `view` | Ver productos y stock |
| `inventory` | `edit` | Crear y editar productos |
| `inventory` | `adjust` | Realizar ajustes de inventario |
| `inventory` | `transfer` | Trasladar stock entre bodegas |
| `sales` | `view` | Ver facturas y cotizaciones |
| `sales` | `create` | Crear facturas y cotizaciones |
| `sales` | `cancel` | Anular facturas emitidas |
| `sales` | `discount` | Aplicar descuentos en ventas |
| `sales` | `collect` | Registrar pagos de clientes |
| `customers` | `view` | Ver ficha de clientes |
| `customers` | `manage` | Crear y editar clientes |
| `customers` | `credit_view` | Ver crédito y estado de cuenta |
| `customers` | `credit_approve` | Aprobar o modificar límite de crédito |
| `suppliers` | `view` | Ver proveedores y órdenes de compra |
| `suppliers` | `manage` | Crear y editar proveedores |
| `suppliers` | `purchase_order` | Crear órdenes de compra |
| `suppliers` | `pay` | Registrar pagos a proveedores |
| `reports` | `sales` | Ver reportes de ventas |
| `reports` | `inventory` | Ver reportes de inventario |
| `reports` | `financial` | Ver reportes financieros, CxC y CxP |
| `reports` | `dashboard` | Ver dashboard general |

---

## Roles y sus Permisos

### Admin
> Acceso total al sistema

Todos los permisos.

---

### Manager
> Supervisión, reportes y administración de clientes, sin gestión de usuarios

| Módulo | Permisos |
|--------|---------|
| `inventory` | `view` |
| `sales` | `view`, `cancel` |
| `customers` | `view`, `manage`, `credit_view`, `credit_approve` |
| `suppliers` | `view` |
| `reports` | `sales`, `inventory`, `financial`, `dashboard` |

---

### Seller
> Ventas, cobro en punto de venta y consulta de clientes

| Módulo | Permisos |
|--------|---------|
| `inventory` | `view` |
| `sales` | `view`, `create`, `discount`, `collect` |
| `customers` | `view`, `manage`, `credit_view` |
| `reports` | `sales` |

---

### Cashier
> Cobro y registro de pagos

| Módulo | Permisos |
|--------|---------|
| `sales` | `view`, `collect` |
| `customers` | `view`, `credit_view` |

---

### Warehouse
> Gestión completa de inventario

| Módulo | Permisos |
|--------|---------|
| `inventory` | `view`, `edit`, `adjust`, `transfer` |
| `suppliers` | `view`, `purchase_order` |
| `reports` | `inventory` |

---

### Purchasing
> Gestión de proveedores y órdenes de compra

| Módulo | Permisos |
|--------|---------|
| `inventory` | `view` |
| `suppliers` | `view`, `manage`, `purchase_order`, `pay` |

---

## Estructura del Módulo en FastAPI

```
backend/app/modules/auth/
├── api.py           ← Endpoints: /login, /logout, /refresh, /me, /users, /roles
├── models.py        ← User, Role, Permission, UserRoles, RolePermission, RefreshToken, ActivityLog
├── schemas.py       ← LoginRequest, TokenResponse, UserOut, UserCreate, RoleOut...
├── repository.py    ← Queries a la base de datos
├── service.py       ← Lógica: verificar password, generar JWT, unificar permisos de múltiples roles
└── dependencies.py  ← get_current_user(), require_permission()
```

### Uso de `require_permission()` en otros módulos

```python
# Cualquier endpoint del sistema usa el mismo patrón:

@router.post("/invoices")
async def create_invoice(
    data: InvoiceCreate,
    user = Depends(require_permission("sales.create"))
):
    ...

@router.delete("/invoices/{id}")
async def cancel_invoice(
    id: UUID,
    user = Depends(require_permission("sales.cancel"))
):
    ...

@router.get("/reports/financial")
async def financial_report(
    user = Depends(require_permission("reports.financial"))
):
    ...
```

---

## Seed Data

```sql
-- Roles base del sistema
INSERT INTO roles (name, description) VALUES
('admin',      'Acceso total al sistema'),
('manager',    'Supervisión y reportes, sin gestión de usuarios'),
('seller',     'Ventas, cotizaciones y consulta de clientes'),
('cashier',    'Cobro y registro de pagos'),
('warehouse',  'Gestión completa de inventario'),
('purchasing', 'Gestión de proveedores y órdenes de compra');

-- Permisos del sistema
INSERT INTO permissions (module, action, description) VALUES
('users',       'view',           'Ver lista de usuarios'),
('users',       'manage',         'Crear, editar y desactivar usuarios'),
('inventory',   'view',           'Ver productos y stock'),
('inventory',   'edit',           'Crear y editar productos'),
('inventory',   'adjust',         'Realizar ajustes de inventario'),
('inventory',   'transfer',       'Trasladar stock entre bodegas'),
('sales',       'view',           'Ver facturas y cotizaciones'),
('sales',       'create',         'Crear facturas y cotizaciones'),
('sales',       'cancel',         'Anular facturas emitidas'),
('sales',       'discount',       'Aplicar descuentos en ventas'),
('sales',       'collect',        'Registrar pagos de clientes'),
('customers',   'view',           'Ver ficha de clientes'),
('customers',   'manage',         'Crear y editar clientes'),
('customers',   'credit_view',    'Ver crédito y estado de cuenta'),
('customers',   'credit_approve', 'Aprobar o modificar límite de crédito'),
('suppliers',   'view',           'Ver proveedores y órdenes de compra'),
('suppliers',   'manage',         'Crear y editar proveedores'),
('suppliers',   'purchase_order', 'Crear órdenes de compra'),
('suppliers',   'pay',            'Registrar pagos a proveedores'),
('reports',     'sales',          'Ver reportes de ventas'),
('reports',     'inventory',      'Ver reportes de inventario'),
('reports',     'financial',      'Ver reportes financieros, CxC y CxP'),
('reports',     'dashboard',      'Ver dashboard general');
```
