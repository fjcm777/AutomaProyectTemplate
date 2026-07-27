# 06 - Autenticación, usuarios, roles y permisos

Proyecto: **Automata**  
Fecha de actualización: 2026-06-28

## 1. Objetivo

Este documento define cómo funcionará la autenticación y autorización en Automata durante el MVP.

El objetivo es mantener un sistema **simple, práctico y seguro**, evitando complejidad innecesaria en el flujo de autenticación.

## 2. Enfoque general

Para el MVP se usará:

```text
Login con username y contraseña.
JWT access token simple.
Roles y permisos almacenados en base de datos.
Validación real de permisos en backend.
Frontend solo muestra u oculta opciones según permisos.
```

No se incluirá en el MVP:

```text
Refresh tokens.
Sesiones complejas en base de datos.
Blacklist de tokens.
OAuth externo.
SSO.
2FA.
Recuperación automática por correo.
Cookies HTTP-only.
```

Estas opciones pueden evaluarse en una etapa futura si el sistema crece o si el contexto operativo lo requiere.

## 3. Login

El login se realizará únicamente con `username` y contraseña.

Endpoint sugerido:

```text
POST /api/v1/auth/login
```

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
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "permissions": [
      "products.view",
      "sales.create"
    ]
  }
}
```

Reglas:

```text
El username es obligatorio y único.
El email puede existir como dato informativo o de contacto.
No se permitirá login con email en el MVP.
```

## 4. JWT access token

El backend generará un JWT access token después de validar las credenciales.

El token debe contener lo mínimo necesario:

```text
sub = user_id
exp = fecha/hora de expiración
```

Opcionalmente puede incluir:

```text
username
```

No se recomienda guardar todos los permisos dentro del token para el MVP, porque los permisos pueden cambiar en DB. El token identifica al usuario; los permisos se consultan desde base de datos.

## 5. Duración del token

Duración por defecto:

```text
8 horas
```

Variable técnica en `.env`:

```text
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

Esta configuración vive en `.env` porque es una configuración técnica de seguridad, no una regla funcional del negocio.

## 6. Logout

El logout del MVP será simple:

```text
El frontend elimina el token guardado.
El usuario queda fuera del sistema.
```

No se invalidará el token en backend antes de su expiración, porque eso requeriría blacklist de tokens o sesiones en DB.

Regla de seguridad:

```text
Cada request protegida debe validar que el usuario siga activo en DB.
```

Si un administrador desactiva un usuario, aunque el token aún no haya expirado, el backend debe rechazar nuevas operaciones de ese usuario.

## 7. Almacenamiento del token en frontend

Durante el MVP, el frontend guardará el `access_token` en:

```text
sessionStorage
```

Reglas:

```text
Al iniciar sesión, el frontend guarda el token en sessionStorage.
Al cerrar sesión, el frontend elimina el token.
Al cerrar navegador o pestaña, el usuario deberá iniciar sesión nuevamente.
No se usará localStorage en MVP.
No se usarán cookies HTTP-only en MVP.
```

Esta decisión favorece simplicidad y reduce persistencia innecesaria del token en equipos usados para operación administrativa.

## 8. Contraseñas

Las contraseñas se guardarán usando hash seguro.

Recomendación técnica:

```text
Argon2 vía pwdlib[argon2]
```

Reglas:

```text
Nunca guardar contraseñas en texto plano.
Nunca retornar password_hash desde la API.
Nunca registrar contraseñas en logs.
```

## 9. Creación y reset de usuarios

Los usuarios serán creados por un administrador.

Flujo de creación:

```text
1. Administrador crea usuario.
2. Define username, email opcional, nombre, apellido, teléfono opcional y contraseña temporal.
3. Asigna uno o más roles.
4. El usuario puede iniciar sesión con su username y contraseña.
```

Reset de contraseña:

```text
1. Usuario solicita reset al administrador.
2. Administrador define una nueva contraseña temporal.
3. Backend actualiza password_hash.
4. Usuario inicia sesión con la nueva contraseña.
```

No habrá recuperación automática por correo en MVP.

No habrá cambio obligatorio de contraseña en MVP.

## 10. Modelo RBAC

Automata usará RBAC simple basado en usuarios, roles y permisos.

Tablas:

```text
users
roles
permissions
user_roles
role_permissions
```

Reglas:

```text
Un usuario puede tener uno o más roles.
Un rol puede tener muchos permisos.
Los permisos son la base real de autorización.
Los roles son agrupadores configurables.
```

## 11. Tabla users

Campos relevantes:

```text
id
username
email
password_hash
first_name
last_name
phone
is_active
is_superuser
last_login_at
created_at
updated_at
deleted_at
deleted_by
```

Restricciones recomendadas:

```text
username UNIQUE NOT NULL
email UNIQUE
```

Regla:

```text
username se usa para login.
email queda como dato informativo/contacto.
```

## 12. Tabla roles

Campos:

```text
id
name
code
description
is_system
is_active
created_at
updated_at
```

Regla:

```text
Los nombres de roles pueden cambiar.
La seguridad real depende de permissions, no del nombre visible del rol.
```

Roles base:

```text
admin
manager
seller
cashier
warehouse
purchasing
accountant
```

## 13. Tabla permissions

Campos:

```text
id
code
name
description
module
is_active
created_at
updated_at
```

Formato de permisos:

```text
recurso.accion
```

Ejemplos:

```text
products.view
sales.create
sales.void
cash.close
settings.update
```

Los permisos del sistema serán sembrados con Alembic y no se borrarán físicamente. Se podrán activar/desactivar si aplica.

## 14. Permisos base del MVP

### Productos

```text
products.view
products.create
products.update
products.deactivate
```

### Inventario

```text
inventory.view
inventory.adjust
inventory.transfer
inventory.mark_damaged
inventory.writeoff
inventory.loan
inventory.return_loan
inventory.supplier_return
```

### Clientes

```text
customers.view
customers.create
customers.update
customers.deactivate
customers.balance_adjust
```

### Ventas

```text
sales.view
sales.create
sales.void
sales.return
sales.credit_create
sales.credit_payment
```

### Apartados

```text
layaways.view
layaways.create
layaways.cancel
layaways.extend
layaways.payment
```

### Caja

```text
cash.view
cash.open
cash.close
cash.manual_movement
```

### Proveedores

```text
suppliers.view
suppliers.create
suppliers.update
suppliers.deactivate
```

### Compras

```text
purchases.view
purchases.create
purchases.pay
purchases.cancel
```

### Retornos a proveedor

```text
supplier_returns.view
supplier_returns.create
supplier_returns.resolve
```

### Reportes

```text
reports.sales.view
reports.inventory.view
reports.cash.view
reports.customers.view
reports.purchases.view
```

### Configuración y usuarios

```text
settings.view
settings.update

users.view
users.create
users.update
users.deactivate
users.reset_password

roles.view
roles.create
roles.update
roles.assign_permissions
```

### Auditoría

```text
audit.view
```

## 15. Roles base y permisos iniciales

Los roles iniciales son una plantilla. El administrador podrá ajustar permisos según la operación real del negocio.

### admin

```text
Todos los permisos.
```

### manager

Operación y supervisión general, excepto administración técnica sensible.

Incluye permisos de productos, inventario, clientes, ventas, apartados, caja, proveedores, compras, retornos y reportes.

### seller

Enfocado en ventas, clientes y apartados básicos.

```text
products.view
inventory.view
customers.view
customers.create
customers.update
sales.view
sales.create
sales.credit_create
sales.credit_payment
layaways.view
layaways.create
layaways.payment
```

No incluye por defecto:

```text
sales.void
sales.return
layaways.cancel
layaways.extend
customers.balance_adjust
```

### cashier

Enfocado en caja, pagos y cobros.

```text
products.view
inventory.view
customers.view
sales.view
sales.create
sales.credit_payment
layaways.view
layaways.payment
cash.view
cash.open
cash.close
cash.manual_movement
reports.cash.view
```

### warehouse

Enfocado en inventario físico.

```text
products.view
inventory.view
inventory.adjust
inventory.transfer
inventory.mark_damaged
inventory.loan
inventory.return_loan
inventory.supplier_return
supplier_returns.view
supplier_returns.create
```

No incluye por defecto:

```text
inventory.writeoff
```

### purchasing

Enfocado en proveedores y compras.

```text
products.view
inventory.view
suppliers.view
suppliers.create
suppliers.update
purchases.view
purchases.create
purchases.pay
supplier_returns.view
supplier_returns.create
supplier_returns.resolve
reports.purchases.view
reports.inventory.view
```

### accountant

Enfocado en consulta, reportes y auditoría.

```text
sales.view
cash.view
customers.view
suppliers.view
purchases.view
reports.sales.view
reports.inventory.view
reports.cash.view
reports.customers.view
reports.purchases.view
audit.view
```

No incluye permisos operativos por defecto.

## 16. Validación de permisos en backend

El backend tendrá una dependencia reutilizable para validar permisos.

Ejemplo conceptual:

```python
require_permission("sales.void")
```

Uso conceptual:

```python
@router.post("/sales/{sale_id}/void")
async def void_sale(
    sale_id: int,
    current_user = Depends(require_permission("sales.void"))
):
    ...
```

Regla:

```text
Cada endpoint protegido debe declarar claramente el permiso requerido.
```

Ejemplos:

```text
GET    /products              products.view
POST   /products              products.create
PUT    /products/{id}         products.update
DELETE /products/{id}         products.deactivate

POST   /sales                 sales.create
POST   /sales/{id}/void       sales.void
POST   /sales/{id}/return     sales.return

POST   /cash/open             cash.open
POST   /cash/close            cash.close

PUT    /settings/{key}        settings.update
```

## 17. Frontend y visibilidad

El frontend usará los permisos del usuario para mejorar la experiencia.

Ejemplos:

```text
Si el usuario no tiene sales.void, no mostrar botón Anular venta.
Si el usuario no tiene settings.update, no mostrar edición de configuración.
```

Regla principal:

```text
El frontend no es seguridad real.
La seguridad real siempre se valida en backend.
```

## 18. Seeds con Alembic

Alembic debe sembrar:

```text
roles base
permissions base
role_permissions iniciales
usuario admin inicial
```

El usuario admin inicial debe tener permisos completos.

## 19. Errores esperados

Credenciales incorrectas:

```json
{
  "code": "auth.invalid_credentials",
  "message": "Usuario o contraseña inválidos."
}
```

Token inválido o expirado:

```json
{
  "code": "auth.invalid_token",
  "message": "La sesión no es válida o expiró."
}
```

Usuario inactivo:

```json
{
  "code": "auth.user_inactive",
  "message": "El usuario está inactivo."
}
```

Permiso insuficiente:

```json
{
  "code": "auth.forbidden",
  "message": "No tiene permiso para realizar esta acción."
}
```

## 20. Decisiones finales

```text
Login únicamente con username.
JWT access token simple.
Duración de token: 8 horas por defecto.
Duración configurada en .env.
Token guardado en sessionStorage.
Logout simple eliminando token en frontend.
Sin refresh tokens en MVP.
Sin sesiones en DB en MVP.
Sin blacklist de tokens en MVP.
Sin OAuth externo en MVP.
Sin 2FA en MVP.
Contraseñas con hash Argon2.
Usuarios creados por administrador.
Reset manual de contraseña por administrador.
Roles y permisos en DB.
Permisos consultados desde DB.
Backend valida permisos reales.
Frontend solo muestra u oculta opciones.
Permisos y roles base sembrados con Alembic.
Usuario admin inicial sembrado con Alembic.
```

---

# Complemento v5 - Permisos adicionales

| Permiso | Modulo | Uso |
|---|---|---|
| customers.balance_refund | customers | Reembolsar saldo a favor del cliente |
| reports.sales.profit.view | reports | Ver utilidad estimada en reportes de ventas |

Reglas:

- `customers.balance_refund` debe asignarse solo a roles de confianza, por ejemplo `admin` o `manager`.
- Todo reembolso de saldo a favor requiere motivo y auditoria.
- `reports.sales.profit.view` puede separarse de `reports.sales.view` si se desea limitar acceso a margenes.


---

## Complemento v7 - Validaciones de permisos y respuestas de error

El frontend puede ocultar rutas, botones o acciones según permisos para mejorar la experiencia,
pero la autorización real debe validarse siempre en backend.

Mensajes visibles recomendados:

| Caso | Mensaje |
|---|---|
| Ruta/sección no permitida | `No tiene acceso a esta sección.` |
| Acción no permitida | `No tiene permiso para realizar esta acción.` |

Respuesta estándar para acción sin permiso:

```json
{
  "status_code": 403,
  "code": "auth.forbidden",
  "message": "No tiene permiso para realizar esta acción.",
  "details": {
    "resource": "sale",
    "operation": "void_sale",
    "required_permission": "sales.void"
  }
}
```

Regla:

```text
Ningún endpoint protegido debe depender únicamente de validaciones del frontend.
```
