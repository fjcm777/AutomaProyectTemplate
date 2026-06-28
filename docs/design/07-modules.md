# 07 - Modules

## Objetivo

Definir cómo se organiza el backend por módulos dentro de un monolito modular.

## Módulos confirmados

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

## Estructura estándar de módulo

```text
modules/
  products/
    api.py
    models.py
    schemas.py
    service.py
    repository.py
```

Responsabilidades:

- `api.py`: endpoints, permisos, request/response HTTP.
- `schemas.py`: Pydantic, entrada y salida.
- `models.py`: SQLAlchemy y relaciones DB.
- `repository.py`: consultas y persistencia.
- `service.py`: reglas de negocio, coordinación y transacciones.

## Comunicación entre módulos

Un módulo solo debe usar otro módulo mediante funciones públicas de `service.py`.

Ejemplo correcto:

```text
sales.service -> inventory.service.decrease_stock()
```

Ejemplo incorrecto:

```text
sales.service modifica inventory_stock directamente
```

## Transacciones

Los casos de uso que afectan varios módulos usan una sola transacción.

El `service.py` principal coordina la transacción.

Los services internos no hacen commit independiente.

## core

Contiene configuración técnica central:

- `config.py`
- `database.py`
- `security.py`
- `permissions.py`
- `dependencies.py`

## shared

Contiene utilidades transversales:

- `pagination.py`
- `errors.py`
- `audit.py`
- `events.py`
- `files.py`

No contiene reglas específicas de negocio.

## jobs

Scripts internos simples:

- `expire_layaways.py`
- `cleanup_audit_logs.py`
- `cleanup_business_events.py`
- `detect_low_stock.py`
- `detect_overdue_customer_credit.py`

No se usará Celery/Redis en MVP.

## SQLAlchemy y Alembic

Cada módulo define sus modelos.

Todos comparten la misma metadata/Base.

Alembic debe importar todos los modelos para autogenerar migraciones.

No usar `Base.metadata.create_all()` en producción.

## Eventos y auditoría

Un evento representa algo importante ocurrido en el negocio.

`business_events` registra qué ocurrió.

`audit_logs` registra quién hizo qué, cuándo y por qué.

## reports

`reports` es solo lectura.

Puede leer varios módulos, pero no modifica datos operativos.

## settings

`settings` es módulo funcional pequeño.

Maneja configuración funcional variable desde DB.

No maneja configuración técnica del servidor.

## Catálogos

En backend, cada catálogo vive en el módulo dueño:

- products: categories, brands, sizes, colors.
- sales: payment_methods.
- inventory: branches, warehouses, movement_types.
- settings: settings, exchange_rates.

En frontend pueden agruparse visualmente en Administración/Catálogos.

## Rutas base

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/products`
- `/api/v1/inventory`
- `/api/v1/customers`
- `/api/v1/sales`
- `/api/v1/layaways`
- `/api/v1/cash`
- `/api/v1/suppliers`
- `/api/v1/purchases`
- `/api/v1/reports`
- `/api/v1/settings`

## Permisos por módulo

Cada módulo debe declarar los permisos que utiliza.

Cada endpoint protegido debe indicar el permiso requerido.
