# 04 - Architecture

## Enfoque

Automata usará arquitectura de monolito modular.

Esto significa:

- Un solo backend FastAPI.
- Una sola base de datos PostgreSQL.
- Código separado por módulos funcionales.
- Límites claros para una posible separación futura.

No se usarán microservicios en el MVP.

## Servicios Docker

Servicios base:

- `backend`: FastAPI.
- `frontend`: React + Vite.
- `db`: PostgreSQL.
- Volumen persistente para PostgreSQL.
- Volumen persistente para uploads.

## Backend

Estructura principal:

```text
backend/
  app/
    main.py
    core/
    shared/
    modules/
    jobs/
```

## Módulos funcionales

Módulos confirmados:

- `auth`
- `users`
- `products`
- `inventory`
- `customers`
- `sales`
- `layaways`
- `cash`
- `suppliers`
- `purchases`
- `reports`
- `settings`

## core

`core` contiene configuración técnica central:

- `config.py`
- `database.py`
- `security.py`
- `permissions.py`
- `dependencies.py`

## shared

`shared` contiene utilidades transversales:

- `pagination.py`
- `errors.py`
- `audit.py`
- `events.py`
- `files.py`

No debe contener reglas específicas de negocio.

## Comunicación entre módulos

Los módulos se comunican mediante funciones públicas de `service.py`.

Un módulo no debe modificar directamente tablas internas de otro módulo.

## Transacciones

Los casos de uso que afectan varios módulos se ejecutan en una sola transacción.

El servicio principal coordina la transacción y los servicios internos usan la misma `AsyncSession`.

## API

Base URL:

```text
/api/v1
```

Todas las respuestas JSON deben seguir un formato estándar.

Respuesta exitosa:

```json
{
  "status_code": 200,
  "message": "OK",
  "data": {}
}
```

Respuesta de error:

```json
{
  "status_code": 404,
  "code": "resource.not_found",
  "message": "El recurso solicitado no existe.",
  "details": {}
}
```

El HTTP status real debe coincidir con `status_code`.

## Seguridad

- Login con `username` y contraseña.
- JWT access token simple.
- Sin refresh tokens en MVP.
- Sin sesiones en DB en MVP.
- Token guardado en `sessionStorage`.
- Roles y permisos en DB.
- Backend valida seguridad real.
- Frontend solo muestra u oculta opciones.

## Frontend

El frontend se organizará por experiencia de usuario, no necesariamente igual al backend.

Ejemplo:

- Catálogos pueden verse agrupados en Administración.
- Backend mantiene cada catálogo en su módulo dueño.

## Configuración

Configuración técnica:

- `.env`
- `DATABASE_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `UPLOADS_DIR`

Configuración funcional:

- Tabla `settings`.
- Administrable desde el sistema.
- Sembrada con Alembic.
- Reutilizable para otros negocios.

## Archivos

Imágenes y fotos:

- Se guardan como archivos en uploads.
- DB guarda URL/ruta.
- Backend valida formato y tamaño.
- Puede convertir a WebP.

## Eventos y auditoría

`audit_logs` registra quién hizo qué, cuándo y por qué.

`business_events` registra qué ocurrió en el negocio.

No se usarán colas externas en MVP.

## Jobs

Jobs internos simples:

- `expire_layaways.py`
- `cleanup_audit_logs.py`
- `cleanup_business_events.py`
- `detect_low_stock.py`
- `detect_overdue_customer_credit.py`

No se usará Celery/Redis en MVP.

## Migraciones

Alembic crea estructura y seeds base.

No se usa `Base.metadata.create_all()` en producción.
