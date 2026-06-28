# 06 - Auth & RBAC

## Enfoque

Autenticación simple y segura para MVP.

Decisiones:

- Login únicamente con `username` y contraseña.
- JWT access token simple.
- Sin refresh token en MVP.
- Sin sesiones en DB.
- Sin OAuth externo.
- Sin 2FA.
- Token guardado en `sessionStorage`.
- Roles y permisos en DB.

## Login

Endpoint:

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

El email puede existir como dato de contacto, pero no se usa para iniciar sesión.

## JWT

El token incluye lo mínimo:

- `sub`: id del usuario.
- `exp`: expiración.

La duración por defecto será 8 horas:

```text
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

Esta configuración vive en `.env`.

## Logout

En MVP:

- El frontend elimina el token de `sessionStorage`.
- No se usa blacklist de tokens.
- No se invalidan tokens en backend antes de expirar.

Cada request protegida debe validar que el usuario siga activo en DB.

## Passwords

- Hash con Argon2.
- Nunca guardar contraseña en texto plano.
- Usuarios creados por administrador.
- Reset manual por administrador.
- Sin recuperación por correo en MVP.
- Sin cambio obligatorio de contraseña en MVP.

## Tablas

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

## Permisos

Formato:

```text
recurso.accion
```

Ejemplos:

- `products.view`
- `sales.create`
- `sales.void`
- `cash.close`
- `settings.update`

## Roles base

- `admin`
- `manager`
- `seller`
- `cashier`
- `warehouse`
- `purchasing`
- `accountant`

Los roles son plantillas iniciales modificables por el administrador.

## Validación backend

Cada endpoint protegido declara su permiso requerido.

Ejemplo:

```python
require_permission("sales.void")
```

El frontend solo muestra u oculta opciones. La seguridad real vive en el backend.
