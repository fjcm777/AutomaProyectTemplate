# 07 - Módulos del backend

Proyecto: **Automata**  
Fecha de actualización: 2026-06-28

## 1. Objetivo

Este documento define cómo se organizará el backend de Automata por módulos funcionales.

El objetivo es mantener un **monolito modular**, fácil de entender, mantener y extender, evitando que las reglas de negocio se mezclen entre áreas del sistema.

## 2. Enfoque general

Automata usará un solo backend FastAPI organizado por módulos.

```text
Monolito modular.
Un solo despliegue backend.
Una sola base de datos PostgreSQL.
Módulos separados por dominio funcional.
Comunicación interna mediante servicios públicos.
```

No se usarán microservicios en el MVP.

La estructura debe permitir que, si el sistema crece, algunos módulos puedan separarse con menor esfuerzo en una etapa futura.

## 3. Estructura general sugerida

```text
backend/
  app/
    main.py

    core/
      config.py
      database.py
      security.py
      permissions.py
      dependencies.py

    shared/
      pagination.py
      errors.py
      audit.py
      events.py
      files.py

    modules/
      auth/
      users/
      products/
      inventory/
      customers/
      sales/
      layaways/
      cash/
      suppliers/
      purchases/
      reports/
      settings/

    jobs/
      expire_layaways.py
      cleanup_audit_logs.py
      cleanup_business_events.py
      detect_low_stock.py
      detect_overdue_customer_credit.py
```

## 4. Módulos funcionales confirmados

```text
auth
users
products
inventory
customers
sales
layaways
cash
suppliers
purchases
reports
settings
```

## 5. Responsabilidad de cada módulo

### 5.1 `auth/`

Responsable de login, generación de JWT, validación del usuario actual y dependencias de autenticación.

Reglas:

```text
El login será únicamente con username y contraseña.
El JWT identifica al usuario.
Los permisos se consultan desde DB.
```

### 5.2 `users/`

Responsable de usuarios, roles, permisos, asignación de roles, reset manual de contraseña y activación/desactivación de usuarios.

Tablas relacionadas:

```text
users
roles
permissions
user_roles
role_permissions
```

### 5.3 `products/`

Responsable del catálogo de productos: productos base, variantes, categorías, marcas, tallas, colores, segmentos e imagen principal.

Tablas relacionadas:

```text
products
product_variants
categories
brands
sizes
colors
```

Regla:

```text
products no calcula inventario por su cuenta.
Si necesita disponibilidad, consulta funciones públicas de inventory.service.
```

### 5.4 `inventory/`

Responsable de stock actual, movimientos de inventario, bodegas, sucursales, disponibilidad, transferencias, ajustes, mercadería dañada, mercadería prestada y retornos a proveedor desde el punto de vista de inventario.

Tablas relacionadas:

```text
branches
warehouses
inventory_stock
inventory_movements
inventory_movement_types
```

Regla:

```text
inventory protege las reglas relacionadas con existencia, disponibilidad y movimientos.
Otros módulos no deben modificar inventory_stock directamente.
```

### 5.5 `customers/`

Responsable de clientes, foto del cliente, saldo a favor y movimientos de saldo a favor.

Tablas relacionadas:

```text
customers
customer_balance_movements
```

Regla:

```text
customers maneja saldo a favor del cliente.
La deuda por venta a crédito vive en sales.
```

### 5.6 `sales/`

Responsable de ventas de contado, ventas a crédito, pagos y abonos, anulación de ventas, devoluciones sobre venta, impuestos aplicados a ventas y métodos de pago.

Tablas relacionadas:

```text
sales
sale_items
sale_payments
sale_returns
sale_return_items
payment_methods
```

Reglas:

```text
sales puede llamar a inventory para descontar stock.
sales puede llamar a cash para registrar movimientos de caja.
sales puede llamar a customers para aplicar saldo a favor.
sales no debe modificar directamente tablas internas de esos módulos.
```

### 5.7 `layaways/`

Responsable de apartados, productos apartados, pagos, cancelación, vencimiento, extensión de plazo y conversión de apartado completado en venta.

Tablas relacionadas:

```text
layaways
layaway_items
layaway_payments
```

Reglas:

```text
layaways reserva inventario usando inventory.service.
Si genera saldo a favor, usa customers.service.
Si se completa y se convierte en venta, usa sales.service.
```

### 5.8 `cash/`

Responsable de apertura de caja, cierre, arqueo, movimientos de caja y business_date operativo.

Tablas relacionadas:

```text
cash_sessions
cash_movements
```

### 5.9 `suppliers/`

Responsable de proveedores, retornos a proveedor, créditos de proveedor, aplicaciones de crédito de proveedor y resolución de retornos pendientes.

Tablas relacionadas:

```text
suppliers
supplier_returns
supplier_return_items
supplier_credits
supplier_credit_applications
```

Regla:

```text
Los retornos a proveedor pueden quedar pendientes de resolución.
La compensación puede resolverse como crédito, reembolso, reemplazo o sin compensación.
```

### 5.10 `purchases/`

Responsable de compras, recepción de mercadería, costos históricos, cuentas por pagar básicas y pagos a proveedor.

Tablas relacionadas:

```text
purchases
purchase_items
supplier_payments
```

Reglas:

```text
purchases registra entradas de inventario usando inventory.service.
purchases puede aplicar créditos de proveedor usando suppliers.service.
```

### 5.11 `reports/`

Responsable de consultar datos, consolidar información, aplicar filtros y preparar resultados para pantalla o exportación futura.

Reglas:

```text
reports será solo lectura en el MVP.
reports puede consultar datos de varios módulos.
reports no debe modificar datos operativos.
```

Reportes MVP sugeridos:

```text
Ventas por business_date.
Inventario disponible por producto/talla/color/bodega.
Productos con stock bajo.
Créditos pendientes de clientes.
Apartados activos o vencidos.
Movimientos de caja por día.
Compras por proveedor.
Retornos a proveedor pendientes.
```

### 5.12 `settings/`

Responsable de la configuración funcional variable del negocio.

Ejemplos:

```text
sales.tax_enabled
sales.default_tax_rate
sales.tax_name
layaways.default_term_days
layaways.minimum_down_payment_percent
system.default_currency
audit.retention_months
events.retention_months
```

Estructura:

```text
modules/
  settings/
    api.py
    models.py
    schemas.py
    service.py
    repository.py
```

Reglas:

```text
settings/ permite consultar configuraciones funcionales.
settings/ permite actualizar solo configuraciones editables.
settings/ valida el tipo de valor según value_type.
settings/ no maneja configuración técnica del servidor.
settings/ debe registrar auditoría cuando se modifique una configuración sensible.
```

Diferencia clave:

```text
core/config.py -> configuración técnica desde .env.
settings/      -> configuración funcional administrable desde DB.
```

## 6. Estructura interna estándar de cada módulo

Estructura recomendada:

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

```text
api.py        -> endpoints, permisos y entrada/salida HTTP.
schemas.py    -> modelos Pydantic, request/response.
models.py     -> modelos SQLAlchemy y relaciones DB.
repository.py -> consultas y persistencia en DB.
service.py    -> reglas de negocio, coordinación y transacciones.
```

No todos los módulos necesitan todos los archivos desde el primer día. Por ejemplo, `reports/` puede no necesitar `models.py` si solo consulta tablas existentes.

## 7. Comunicación entre módulos

Regla principal:

```text
Un módulo puede usar otro módulo únicamente a través de funciones públicas de su service.py.
```

Ejemplo correcto:

```text
sales.service.create_sale()
  llama inventory.service.decrease_stock()
  llama cash.service.register_sale_payment()
  llama customers.service.apply_customer_balance()
```

Ejemplo incorrecto:

```text
sales.service modifica inventory_stock directamente.
sales.service inserta cash_movements directamente.
sales.service modifica customers.current_balance directamente.
```

Cada módulo debe proteger sus propias reglas.

## 8. Transacciones entre módulos

Los casos de uso que afecten varios módulos deben ejecutarse dentro de una sola transacción de base de datos.

Ejemplo: venta de contado.

```text
1. Crear venta.
2. Crear sale_items.
3. Descontar inventario.
4. Registrar pago.
5. Registrar movimiento de caja.
6. Registrar auditoría/evento.
7. Confirmar transacción.
```

Si algo falla, toda la operación se revierte.

Reglas:

```text
El service.py principal coordina la transacción.
Los services internos usan la misma AsyncSession.
Los services internos no hacen commit independiente.
Si ocurre un error, se revierte toda la operación.
```

## 9. Reglas de imports y dependencias

Flujo recomendado:

```text
api.py
  ↓
service.py
  ↓
repository.py
  ↓
database
```

Reglas:

```text
api.py puede llamar a service.py.
service.py puede llamar a repository.py.
service.py puede llamar a services públicos de otros módulos.
repository.py no debe llamar a service.py.
repository.py no debe llamar a repositories de otros módulos directamente.
models.py no debe importar services.
schemas.py no debe importar services.
```

## 10. Separación entre core, shared, modules y jobs

### `core/`

Configuración técnica central:

```text
config.py        -> lee .env y configuración técnica.
database.py      -> engine, AsyncSession, Base.
security.py      -> JWT, hash de password, verificación de contraseña.
permissions.py   -> helpers/dependencias para validar permisos.
dependencies.py  -> dependencias comunes de FastAPI.
```

### `shared/`

Utilidades transversales reutilizables:

```text
pagination.py -> paginación estándar.
errors.py     -> errores estándar del sistema.
audit.py      -> helper para registrar auditoría.
events.py     -> helper para registrar eventos internos.
files.py      -> manejo común de archivos e imágenes.
```

Regla:

```text
shared/ no debe contener reglas específicas de negocio.
Las reglas específicas viven en service.py del módulo correspondiente.
```

### `jobs/`

Contiene tareas internas simples.

## 11. Jobs internos

Jobs confirmados:

```text
expire_layaways.py
cleanup_audit_logs.py
cleanup_business_events.py
detect_low_stock.py
detect_overdue_customer_credit.py
```

Reglas:

```text
jobs/ contendrá scripts internos simples.
No se usará Celery/Redis en MVP.
Los jobs usarán services existentes.
Los jobs podrán ejecutarse manualmente o por cron/scheduler externo.
cleanup_business_events.py se mantiene como job válido para limpieza futura o por política de retención.
```

Ejemplo correcto:

```text
expire_layaways.py llama layaways.service.expire_overdue_layaways().
```

## 12. Modelos SQLAlchemy, Base y Alembic

Reglas:

```text
Cada módulo define sus propios modelos SQLAlchemy.
Todos los modelos comparten la misma metadata/Base.
Alembic debe importar todos los modelos para autogenerar migraciones correctamente.
No se deben crear tablas manualmente con Base.metadata.create_all() en producción.
```

Se recomienda un archivo central para que Alembic conozca todos los modelos.

Ejemplo:

```text
backend/app/db/base.py
```

Ese archivo importará modelos de los módulos, no para usarlos directamente, sino para registrar metadata.

## 13. Contratos públicos entre módulos

Cada módulo tendrá funciones públicas en `service.py`. Esas funciones serán el contrato interno para otros módulos.

Ejemplos:

```text
inventory.service.get_availability()
inventory.service.decrease_stock()
inventory.service.reserve_stock()
inventory.service.release_reserved_stock()

cash.service.get_open_cash_session()
cash.service.register_cash_movement()

customers.service.apply_customer_balance()
customers.service.create_customer_balance_movement()
```

Regla:

```text
Otros módulos no deben importar repositories ni modificar tablas internas directamente.
```

## 14. Eventos y auditoría desde módulos

Un evento representa que algo importante ocurrió en el negocio.

Diferencia:

```text
audit_logs      -> quién hizo qué, cuándo y por qué.
business_events -> qué ocurrió en el negocio.
```

Reglas:

```text
Los módulos pueden registrar eventos usando shared/events.py.
Los módulos pueden registrar auditoría usando shared/audit.py.
La decisión de cuándo auditar vive en service.py del módulo.
No se auditan consultas normales.
Se auditan operaciones sensibles.
No se usarán colas externas como Kafka/RabbitMQ en MVP.
```

Ejemplos:

```text
sale.created
sale.voided
sale.returned
payment.received
inventory.adjusted
cash.closed
purchase.created
supplier.credit.generated
```

## 15. Catálogos backend vs frontend

Regla confirmada:

```text
El backend se organiza por dominio.
El frontend se organiza por experiencia de usuario.
```

En backend, los catálogos pertenecen al módulo dueño del dominio.

```text
products/
  categories
  brands
  sizes
  colors

sales/
  payment_methods

inventory/
  branches
  warehouses
  inventory_movement_types

settings/
  settings
  exchange_rates
```

En frontend, esos catálogos pueden agruparse visualmente en una sección administrativa común.

```text
Administración
  Catálogos
    Categorías
    Marcas
    Tallas
    Colores
    Métodos de pago
    Sucursales
    Bodegas
  Configuración
  Usuarios y roles
```

Aunque en pantalla estén agrupados, cada página consume el endpoint del módulo dueño.

## 16. Guía general de rutas por módulo

Rutas base:

```text
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/inventory
/api/v1/customers
/api/v1/sales
/api/v1/layaways
/api/v1/cash
/api/v1/suppliers
/api/v1/purchases
/api/v1/reports
/api/v1/settings
```

Subrutas:

```text
/api/v1/products/categories
/api/v1/products/brands
/api/v1/products/sizes
/api/v1/products/colors

/api/v1/sales/payment-methods

/api/v1/inventory/branches
/api/v1/inventory/warehouses
/api/v1/inventory/movement-types

/api/v1/settings/exchange-rates
```

Regla:

```text
Las rutas reflejan el módulo dueño del dominio, aunque el frontend las agrupe visualmente de otra forma.
```

## 17. Permisos por módulo

Cada módulo debe declarar los permisos que utiliza.

Reglas:

```text
Cada endpoint protegido debe indicar el permiso requerido.
Los permisos se crean como seeds de Alembic.
El backend valida permisos con la dependencia reutilizable definida en 06-auth-rbac.md.
```

Ejemplo:

```text
sales
- sales.view
- sales.create
- sales.void
- sales.return
- sales.credit_create
- sales.credit_payment
```

## 18. Reglas finales

```text
Backend organizado por dominio.
Frontend organizado por experiencia de usuario.
Los catálogos viven en el módulo dueño en backend.
Los catálogos pueden agruparse visualmente en frontend.
settings será módulo funcional pequeño.
reports será solo lectura en MVP.
Los módulos se comunican por services públicos.
Los casos multi-módulo usan una sola transacción.
Los services internos no hacen commit independiente.
shared contiene utilidades transversales, no reglas específicas de negocio.
```

---

## Ajustes complementarios v4

### Inventory loans

El módulo `inventory` también es responsable de `inventory_loans`.

Responsabilidades:

- Crear préstamo.
- Retornar préstamo.
- Convertir préstamo en venta coordinando con `sales.service`.
- Mantener `quantity_loaned`.
- Recalcular `quantity_available`.

Tablas relacionadas:

- `inventory_loans`
- `inventory_stock`
- `inventory_movements`

### Disponibilidad

La disponibilidad persistida en `inventory_stock.quantity_available` solo debe recalcularse desde `inventory.service`.

Otros módulos deben solicitar operaciones públicas del módulo inventory.

### Estados

Cada módulo debe validar transiciones de estado desde `service.py`.

Ejemplos:

- `sales.service` valida anulación/devolución.
- `layaways.service` valida completar/cancelar/vencer.
- `cash.service` valida cierre de caja.
- `suppliers.service` valida resolución de retorno proveedor.

---

# Complemento v5 - Responsabilidades ajustadas

## customers.service

| Operacion | Descripcion |
|---|---|
| `apply_customer_credit_fifo` | Consume saldo FIFO para venta/apartado |
| `refund_customer_credit` | Reembolsa saldo con autorizacion |
| `restore_customer_credit` | Restaura saldo usado al anular venta |
| `create_credit_application` | Registra trazabilidad en `customer_credit_applications` |

## inventory.service

- Actualiza cantidades base de `inventory_stock`.
- No escribe `quantity_available`.
- PostgreSQL calcula `quantity_available`.
- Transferencias internas bodega/exhibicion quedan fuera del MVP inicial.

## purchases.service

- Solo compras `draft` pueden cancelarse.
- Compras `received` son finales y se corrigen con procesos compensatorios.

## suppliers.service

- Solo retornos proveedor `created` pueden cancelarse.
- Retornos enviados o pendientes deben resolverse.

## reports.service

Calcula utilidad estimada simple usando `sale_items`.

```text
estimated_profit =
sum((unit_price * quantity - discount_amount) - (unit_cost * quantity))
```
