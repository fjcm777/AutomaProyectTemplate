# 04 - Architecture

Proyecto: **Automata**  
Negocio: **Calzado Norita**  
Fecha de actualizacion: 2026-06-28

## 1. Objetivo

Este documento define la arquitectura tecnica base de Automata, un sistema ERP adaptado a una tienda de calzado, ropa y accesorios.

La arquitectura debe permitir iniciar con un MVP mantenible, simple y de bajo costo, pero preparado para crecer si el negocio lo requiere.

## 2. Stack tecnico

Automata usara:

- Backend: FastAPI.
- Frontend: React + TypeScript + Vite.
- Base de datos: PostgreSQL.
- ORM: SQLAlchemy 2.x async.
- Migraciones: Alembic.
- Contenedores: Docker Compose.
- Autenticacion: token/JWT.
- Arquitectura: monolito modular.

## 3. Principios arquitectonicos

- Iniciar como monolito modular.
- Evitar microservicios al inicio.
- Mantener limites claros entre modulos.
- Permitir separacion futura de modulos si el sistema crece.
- Evitar complejidad innecesaria.
- Priorizar trazabilidad, consistencia de datos y facilidad de soporte.
- Usar nombres tecnicos en ingles e interfaz en espanol.

## 4. Monolito modular

Automata sera un monolito modular.

Esto significa que todos los modulos viviran dentro de una misma aplicacion backend, pero separados por responsabilidades.

```text
backend/app/modules/
├── products/
├── inventory/
├── sales/
├── layaways/
├── cash/
└── reports/
```

La modularidad no significa aislamiento absoluto. Los modulos pueden coordinarse entre si, pero deben hacerlo mediante servicios publicos y no manipulando internamente la logica o tablas de otros modulos de forma desordenada.

## 5. Estructura backend

Estructura base recomendada:

```text
backend/
├── alembic/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── security.py
│   │   ├── permissions.py
│   │   └── logging.py
│   ├── shared/
│   │   ├── errors.py
│   │   ├── pagination.py
│   │   ├── audit.py
│   │   ├── events.py
│   │   └── files.py
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── sales/
│   │   ├── layaways/
│   │   ├── cash/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   └── reports/
│   └── jobs/
├── tests/
├── uploads/
├── Dockerfile
└── requirements.txt / pyproject.toml
```

### 5.1 core

`core/` contendra configuracion y componentes tecnicos centrales:

- `config.py`: variables de entorno.
- `db.py`: conexion a PostgreSQL y `AsyncSession`.
- `security.py`: JWT, hashing y autenticacion.
- `permissions.py`: constantes de permisos para evitar errores de strings.
- `logging.py`: configuracion de logs tecnicos.

### 5.2 shared

`shared/` contendra utilidades reutilizables:

- `errors.py`: errores estandar de negocio.
- `pagination.py`: paginacion comun.
- `audit.py`: auditoria selectiva.
- `events.py`: eventos internos.
- `files.py`: manejo de uploads e imagenes.

### 5.3 modules

`modules/` contendra modulos funcionales del negocio.

Cada modulo seguira la estructura:

```text
api.py
schemas.py
models.py
service.py
repository.py
```

Responsabilidades:

- `api.py`: endpoints FastAPI, validacion de permisos y llamada a servicios.
- `schemas.py`: schemas Pydantic de request/response.
- `models.py`: modelos SQLAlchemy.
- `repository.py`: acceso a base de datos.
- `service.py`: reglas de negocio y coordinacion con otros modulos.

### 5.4 jobs

`jobs/` contendra tareas programadas simples versionadas en el repositorio.

Ejemplos:

- `cleanup_audit_logs.py`
- `cleanup_business_events.py`
- `expire_layaways.py`
- `detect_low_stock.py`
- `detect_overdue_customer_credit.py`

En el MVP no se usara Celery, Redis ni un sistema complejo de colas.

## 6. Modulos backend del MVP

Automata iniciara con estos modulos funcionales:

- `auth`: login, JWT y usuario autenticado.
- `users`: usuarios, roles, permisos y asignaciones.
- `products`: catalogo, variantes, categorias, marcas, tallas, colores, segmento, codigo personalizado e imagen principal.
- `inventory`: stock, disponibilidad, bodegas, entradas, salidas, ajustes, transferencias, mercaderia danada, mercaderia prestada y reservas.
- `customers`: clientes, historial basico, saldos pendientes y saldos a favor.
- `sales`: ventas de contado, credito, pagos, anulaciones, devoluciones y cuentas por cobrar basicas.
- `layaways`: apartados, abonos, cancelaciones, vencimientos, extension de plazo y saldo a favor por apartado.
- `cash`: apertura, movimientos, arqueo, diferencias, cierre y `business_date`.
- `suppliers`: proveedores, retornos, creditos e historial.
- `purchases`: compras, recepcion, costos historicos, pagos y cuentas por pagar basicas.
- `reports`: reportes consolidados.

`reports` sera principalmente de lectura y no modificara datos operativos.

## 7. Utilidades compartidas

No seran modulos funcionales independientes:

- Auditoria: `shared/audit.py`.
- Eventos: `shared/events.py`.
- Errores: `shared/errors.py`.
- Archivos: `shared/files.py`.
- Paginacion: `shared/pagination.py`.

El modulo `accounting` queda documentado como etapa futura.

## 8. Comunicacion entre modulos

Reglas:

- Los modulos pueden comunicarse usando servicios publicos.
- Cada modulo conserva la propiedad de sus reglas internas.
- No se deben duplicar reglas de otro modulo.
- No se deben manipular directamente tablas internas de otro modulo si existe un servicio responsable.
- Las dependencias entre modulos deben ser explicitas y justificadas por procesos de negocio.
- Se evitaran dependencias circulares fuertes.

Ejemplo correcto:

```text
sales/service.py llama inventory/service.py para descontar inventario.
```

Ejemplo incorrecto:

```text
sales/service.py calcula disponibilidad leyendo internamente todas las tablas de inventory.
```

## 9. Dependencias esperadas

### sales

Puede depender de customers, products, inventory, cash, users, shared/audit y shared/events.

### layaways

Puede depender de customers, products, inventory, cash, sales, shared/audit y shared/events.

### purchases

Puede depender de suppliers, products, inventory, cash, shared/audit y shared/events.

### cash

Puede depender de users, shared/audit y shared/events. Otros modulos pueden depender de `cash` para registrar pagos o movimientos.

### reports

Puede consultar sales, inventory, products, customers, cash, layaways, purchases y suppliers, pero no debe modificar datos operativos.

## 10. Arquitectura frontend

El frontend se organizara por features.

Estructura base:

```text
frontend/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers/
│   │   └── layout/
│   ├── routes/
│   │   └── router.tsx
│   ├── shared/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── constants/
│   └── features/
│       ├── auth/
│       ├── products/
│       ├── inventory/
│       ├── customers/
│       ├── sales/
│       ├── layaways/
│       ├── cash/
│       ├── suppliers/
│       ├── purchases/
│       └── reports/
├── public/
├── Dockerfile
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Una feature puede consumir varios endpoints del backend si el flujo lo requiere. Por ejemplo, `features/sales` puede consumir productos, inventario, clientes, ventas y caja.

## 11. Rutas frontend

El frontend usara rutas centralizadas.

Ejemplos:

```text
/products
/products/create
/products/:id
/products/:id/edit
/sales
/sales/create
/sales/:id
/layaways
/layaways/create
/layaways/:id
/cash
/cash/current
/cash/closing
/reports
/reports/inventory
/reports/sales
```

Reglas:

- Las rutas internas requieren autenticacion.
- Las rutas o acciones sensibles pueden validar permisos visuales.
- La autorizacion real siempre sera validada por backend.

## 12. API versionada y contratos

La API usara prefijo versionado:

```text
/api/v1
```

OpenAPI/Swagger sera la referencia tecnica principal.

Ademas, existira `08-api-contracts.md` como resumen funcional/tecnico con endpoint, metodo HTTP, permiso requerido, request, response, errores esperados y reglas relevantes.

## 13. Seguridad y permisos

Automata usara:

- Autenticacion con token/JWT.
- Roles y permisos dinamicos en base de datos.
- Validacion real de permisos en backend.
- Validacion visual en frontend solo para experiencia de usuario.

Tablas esperadas:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

`core/permissions.py` podra contener constantes para evitar errores de strings y apoyar seeds iniciales, pero la autorizacion real se resuelve contra la base de datos.

### 13.1 Nomenclatura de permisos

Los permisos usaran formato:

```text
recurso.accion
```

Ejemplos:

```text
products.view
products.create
products.update
products.deactivate
sales.view
sales.create
sales.void
sales.return
inventory.view
inventory.adjust
inventory.transfer
inventory.mark_damaged
cash.view
cash.open
cash.close
cash.manual_movement
layaways.view
layaways.create
layaways.cancel
layaways.extend
reports.sales.view
reports.inventory.view
```

El backend validara usando el codigo tecnico. En pantalla pueden mostrarse nombres en espanol.

## 14. Base de datos y migraciones

Automata usara PostgreSQL.

Reglas:

- SQLAlchemy async para modelos y acceso a datos.
- Alembic para crear y modificar estructura.
- Alembic tambien manejara seeds tecnicos/base iniciales.
- No se usara `Base.metadata.create_all()` como mecanismo de creacion de tablas en produccion.
- No se usaran queries manuales sueltos como mecanismo principal de inicializacion.

Seeds que pueden vivir en Alembic:

- Permisos base.
- Roles base.
- Relacion rol-permiso inicial.
- Usuario administrador inicial, si aplica.
- Configuracion inicial.
- Bodega principal.
- Caja principal.
- Segmentos: hombre, mujer, unisex.
- Categorias iniciales.
- Tallas iniciales.
- Colores iniciales.
- Metodos de pago.
- Tipos de movimiento de inventario.
- Estados base.

Los datos operativos masivos o muy cambiantes podran cargarse despues mediante importadores, pantallas administrativas o scripts controlados si el negocio lo requiere.

## 15. Transacciones

Las operaciones criticas de negocio deben ejecutarse dentro de transacciones de base de datos.

Aplica especialmente a ventas, apartados, pagos, caja, inventario, compras, retornos a proveedor y contabilidad futura.

La capa `service.py` coordinara la transaccion cuando el flujo afecte varias tablas o modulos. Si una parte falla, toda la operacion debe revertirse.

## 16. Validaciones

- `schemas.py`: validaciones de estructura con Pydantic.
- `service.py`: reglas de negocio.
- Base de datos: integridad con foreign keys, unique constraints, checks e indices.
- Frontend: validaciones visuales para mejorar experiencia.

El backend sera siempre la fuente real de validacion.

## 17. Errores estandar

El backend usara errores estandar de negocio.

Formato recomendado:

```json
{
  "code": "inventory.not_available",
  "message": "No hay inventario disponible para este producto.",
  "details": {
    "product_id": 15,
    "requested_qty": 2,
    "available_qty": 1
  }
}
```

Ubicacion sugerida: `backend/app/shared/errors.py`.

## 18. Auditoria selectiva

Automata usara auditoria selectiva, no auditoria de todo.

No se auditaran consultas normales como consultar producto, buscar cliente, ver listado o filtrar productos.

Si se auditaran operaciones sensibles: ventas, anulaciones, devoluciones, apartados, ajustes de inventario, caja, compras, retornos a proveedor, cambios de clientes, cambios de roles/permisos y contabilidad futura.

La auditoria sera registrada desde backend.

Ubicacion sugerida: `backend/app/shared/audit.py`.

Campos recomendados:

- Usuario.
- Accion.
- Entidad.
- ID de entidad.
- Fecha/hora.
- Motivo.
- Valor anterior si aplica.
- Valor nuevo si aplica.
- IP/dispositivo si aplica.

## 19. Eventos internos

Automata usara eventos internos de negocio.

Ejemplos:

```text
sale.created
sale.voided
sale.returned
payment.received
layaway.created
layaway.completed
inventory.adjusted
cash.closed
purchase.created
supplier.credit.generated
```

En el MVP los eventos viviran dentro del backend. No se usara Kafka, RabbitMQ ni mensajeria externa.

Ubicacion sugerida: `backend/app/shared/events.py`.

## 20. Retencion y limpieza

En el MVP no se implementaran tablas historicas.

Reglas:

- Las tablas principales conservaran registros importantes mediante estados o borrado logico.
- `audit_logs` y `business_events` podran limpiarse por antiguedad.
- La politica de retencion podra ser configurable.
- No se eliminaran registros recientes ni necesarios para procesos abiertos o investigaciones activas.

## 21. Borrado logico y estados

Automata usara borrado logico o estados para registros importantes.

No se eliminaran fisicamente registros con impacto historico, financiero, operativo o de inventario.

Ejemplos de campos:

```text
is_active
status
deleted_at
deleted_by
delete_reason
```

El borrado fisico se reservara para datos temporales, tokens expirados, archivos temporales y registros temporales de importacion.

## 22. Fechas y zona horaria

Automata usara:

- `created_at`: fecha/hora real del registro.
- `updated_at`: fecha/hora real de actualizacion.
- `business_date`: dia operativo.

Reglas:

- Campos de fecha/hora reales usaran zona horaria.
- En SQLAlchemy se usara `DateTime(timezone=True)`.
- En PostgreSQL se recomienda `TIMESTAMP WITH TIME ZONE`.
- `business_date` sera tipo `DATE`.
- Reportes de ventas, caja y pagos usaran `business_date` cuando corresponda.

## 23. Archivos e imagenes

Automata permitira una imagen principal por producto desde el MVP.

Reglas:

- La imagen no se guarda como binario en DB.
- La imagen se guarda como archivo.
- La base de datos guarda ruta o URL.
- Formato recomendado: WebP.
- Galeria de multiples imagenes queda para segunda etapa.

Ejemplo:

```text
uploads/products/product-F102-main.webp
products.image_url = "/media/products/product-F102-main.webp"
```

## 24. Seguridad de uploads

Los uploads seran validados desde backend.

Reglas:

- No confiar en el nombre original del archivo.
- Solo permitir formatos definidos: jpg, jpeg, png, webp.
- Validar tamano maximo.
- Convertir/comprimir a WebP.
- Generar nombre interno seguro.
- Guardar en carpeta controlada.
- No permitir rutas fuera de `UPLOADS_DIR`.
- Guardar en DB solo la ruta publica.
- El frontend puede validar para mejorar experiencia, pero la validacion real es del backend.

Variables sugeridas:

```text
UPLOADS_DIR=/app/uploads
MAX_PRODUCT_IMAGE_SIZE_MB=5
```

La carpeta de uploads debe persistir con volumen Docker.

## 25. Configuracion y variables de entorno

La configuracion sensible y variable se manejara con variables de entorno y `core/config.py`.

Ejemplos:

```text
DATABASE_URL
SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES
API_V1_PREFIX
ENVIRONMENT
UPLOADS_DIR
MAX_PRODUCT_IMAGE_SIZE_MB
DEFAULT_CURRENCY
```

No se deben quemar valores sensibles o variables en el codigo.

## 26. Logging tecnico

Los logs tecnicos seran diferentes de la auditoria.

Deben registrar errores inesperados, fallos de conexion a DB, errores en jobs, errores al procesar imagenes, tiempo de respuesta de endpoints criticos e inicio/cierre de aplicacion.

No deben registrar contrasenas, tokens JWT, claves secretas ni datos sensibles innecesarios.

En el MVP se usara logging estandar de Python con salida a consola o archivo.

## 27. Testing

Automata tendra pruebas automatizadas para reglas criticas de negocio, permisos y transacciones.

Prioridad inicial: backend.

Herramientas sugeridas:

- pytest.
- pytest-asyncio.
- httpx / AsyncClient.
- pytest-cov.
- PostgreSQL de testing en Docker.

Frontend:

- Vitest.
- React Testing Library.
- Playwright mas adelante.

Las herramientas de IA podran asistir generando tests, pero las reglas fuente deben venir de la documentacion funcional y tecnica del proyecto.

## 28. Docker Compose y entorno

Docker Compose sera parte de la arquitectura base.

Servicios principales:

- backend FastAPI.
- frontend React/Vite.
- PostgreSQL.

Reglas:

- PostgreSQL debe tener volumen persistente desde desarrollo.
- Uploads debe tener volumen persistente.
- El entorno de desarrollo debe parecerse lo mas posible a produccion.
- No se agregara complejidad innecesaria separando muchos ambientes desde el inicio.

## 29. Despliegue inicial

Automata usara despliegue inicial simple basado en Docker Compose.

Puede ejecutarse en PC local del negocio, mini servidor local, servidor dedicado o VPS economico.

Reglas:

- Bajo costo.
- Facilidad de soporte.
- Persistencia de datos.
- Sin Kubernetes en MVP.
- Ejecutar migraciones Alembic antes de arrancar una nueva version.

## 30. Backups

Automata tendra estrategia basica de backups desde el MVP.

Respaldar:

- PostgreSQL.
- Carpeta uploads.

Los backups podran hacerse con scripts simples.

Antes de actualizar el sistema debe existir backup reciente.

## 31. Actualizaciones

Proceso recomendado:

1. Realizar backup de PostgreSQL y uploads.
2. Bajar/copiar nueva version del codigo.
3. Reconstruir contenedores si aplica.
4. Ejecutar migraciones Alembic.
5. Levantar servicios.
6. Verificar backend, frontend y DB.

Los cambios de estructura y seeds base deben aplicarse mediante Alembic.

## 32. Control de versiones y trabajo con IA

Automata usara Git.

Reglas:

- No sera obligatorio crear ramas para cada cambio en el MVP.
- Las ramas seran opcionales para cambios grandes, riesgosos o experimentales.
- Los commits deben ser claros y representar unidades logicas.
- La IA puede modificar o sugerir codigo.
- El desarrollador revisara los cambios y hara commits manualmente.

## 33. Nombres tecnicos e interfaz

Reglas:

- Nombres tecnicos en ingles.
- Interfaz visible para usuario en espanol.
- Consistencia entre backend, frontend, DB, permisos y eventos.

Ejemplo:

```text
Tabla: products
Endpoint: /api/v1/products
Frontend: features/products
Permiso: products.create
Evento: product.created
Pantalla: Productos
```

## 34. Health checks y monitoreo basico

Automata tendra endpoints basicos de health check.

MVP minimo:

```text
GET /api/v1/health
```

Opcional:

```text
GET /api/v1/health/db
```

No se implementara monitoreo externo complejo desde el inicio.

## 35. Decisiones explicitas fuera del MVP

No se implementara en el MVP:

- Microservicios.
- Kubernetes.
- Kafka/RabbitMQ.
- Celery/Redis.
- Galeria multiple de imagenes.
- Storage externo tipo S3/Cloudinary/Azure Blob.
- Contabilidad completa.
- Tablas historicas.
- Ambientes complejos separados, salvo que sea necesario despues.

## 36. Reglas para desarrollo asistido por IA

Cuando se use IA para generar codigo, debe seguir esta documentacion.

Prompt recomendado:

```text
Implementa el modulo indicado siguiendo 01-business-rules.md, 02-process-flows.md, 03-use-cases.md y 04-architecture.md.

No cambies reglas de negocio sin justificarlo.

Manten la estructura api.py, schemas.py, models.py, service.py y repository.py.

Usa transacciones cuando el flujo modifique varias tablas o modulos.

Agrega pruebas para reglas criticas.

Al final, resume archivos modificados, cambios realizados y pendientes.
```

La documentacion es la fuente de verdad para evitar que la IA invente reglas.
