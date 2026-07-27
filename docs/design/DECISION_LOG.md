# Decision Log - Automata / Calzado Norita

**Fecha de actualizacion:** 2026-07-05

| # | Decision | Estado | Impacto |
|---:|---|---|---|
| 1 | Transferencias internas bodega/exhibicion quedan fuera del MVP inicial. | CONFIRMED | Inventario, API, roadmap |
| 2 | `quantity_available` sera columna generada por PostgreSQL. | CONFIRMED | DB, inventory.service, reportes |
| 3 | Saldo a favor se consume FIFO. | CONFIRMED | customers, sales, layaways |
| 4 | Se agrega `customer_credit_applications`. | CONFIRMED | DB, auditoria, trazabilidad |
| 5 | Saldo a favor puede usarse en ventas y apartados. | CONFIRMED | pagos mixtos, API |
| 6 | Ventas y apartados permiten pagos mixtos. | CONFIRMED | payments, cash |
| 7 | Al anular venta, se restaura saldo a favor usado. | CONFIRMED | sales, customers |
| 8 | Saldo a favor puede reembolsarse al cliente con permiso especial. | CONFIRMED | customers, cash, audit |
| 9 | Estados finales no se reabren. | CONFIRMED | services, state transitions |
| 10 | Retorno proveedor solo se cancela en estado `created`. | CONFIRMED | suppliers |
| 11 | Compra recibida no se cancela directamente. | CONFIRMED | purchases, inventory |
| 12 | Reporte ventas incluye utilidad estimada simple. | CONFIRMED | reports |
| 13 | `09-frontend-routes.md` documenta rutas navegables del frontend, no endpoints backend. | CONFIRMED | frontend, router, QA |
| 14 | `/` redirige a `/dashboard`; `/login` es la unica ruta publica funcional inicial. | CONFIRMED | frontend, auth |
| 15 | Rutas protegidas usan `RequireAuth` + `AppLayout`; `/login` usa `GuestOnly` + `PublicLayout`. | CONFIRMED | frontend, auth, layouts |
| 16 | Convencion frontend: crear usa `/<module>/create` y editar usa `/<module>/:id/edit`. | CONFIRMED | frontend, router |
| 17 | `features/login` debe evolucionar a `features/auth`; dashboard sera `features/dashboard`. | CONFIRMED | frontend, estructura |
| 18 | Rutas administrativas se agrupan bajo `/admin`; catalogos bajo `/admin/catalogs`; settings bajo `/admin/settings`. | CONFIRMED | frontend, admin, RBAC |
| 19 | Sales incluye rutas propias para receipt, void y return. | CONFIRMED | frontend, sales, cash, inventory, audit |
| 20 | Layaways incluye rutas propias para payment, complete y cancel. | CONFIRMED | frontend, layaways, cash, inventory |
| 21 | Cash incluye rutas propias para open, current, movements, close y sessions. | CONFIRMED | frontend, cash, audit |
| 22 | Supplier returns vive bajo `/suppliers/returns`, no bajo `/purchases/:id/return`. | CONFIRMED | frontend, suppliers, purchases, inventory |
| 23 | Inventory loaned y damaged usan rutas propias; transfers queda future/non-MVP. | CONFIRMED | frontend, inventory, MVP |
| 24 | Purchases incluye rutas propias para receive, cancel y payment. | CONFIRMED | frontend, purchases, suppliers |
| 25 | Reports se organiza por area operativa y no requiere `/reports/products`. | CONFIRMED | frontend, reports |


| 26 | `10-validation-rules.md` documenta validaciones frontend/backend, severidad documental y mensajes visibles en español. | CONFIRMED | frontend, backend, QA |
| 27 | El backend es la fuente definitiva de validación para negocio, seguridad, dinero, inventario, estado y auditoría. | CONFIRMED | backend, services |
| 28 | `severity` se usa como clasificación documental (`blocking`, `warning`, `informational`) y no como campo obligatorio del JSON público. | CONFIRMED | validation, API |
| 29 | Errores backend siguen `08-api-contracts.md`: `status_code`, `code`, `message`, `details`. | CONFIRMED | API, frontend |
| 30 | Validaciones múltiples usan `details.errors`; cada error puede incluir `field`, `code` y `message`. | CONFIRMED | API, frontend |
| 31 | Warnings no bloqueantes se devuelven en respuestas exitosas mediante `warnings`. | CONFIRMED | API, frontend |
| 32 | Operaciones críticas multi-módulo deben ser atómicas/transaccionales. | CONFIRMED | architecture, services |
| 33 | Costo unitario en compras debe ser mayor que cero. | CONFIRMED | purchases, inventory |
| 34 | Todo retorno a proveedor resuelto debe tener tipo de resolución. | CONFIRMED | suppliers, inventory |
| 35 | Reportes con rangos demasiado amplios se bloquean si exceden límite configurable. | CONFIRMED | reports |
| 36 | Nombres de catálogos se validan normalizados, ignorando mayúsculas/minúsculas y espacios extra. | CONFIRMED | admin, catalogs |
| 37 | Cambios de settings con procesos activos se manejan según el tipo de configuración. | CONFIRMED | settings |

| 38 | `11-error-handling.md` documenta manejo de errores sin redefinir el contrato API. | CONFIRMED | API, backend, frontend, QA |
| 39 | Errores inesperados usan `system.internal_error`. | CONFIRMED | backend, soporte |
| 40 | Fallos de operaciones atómicas usan `business.transaction_failed`. | CONFIRMED | backend, transacciones |
| 41 | Errores internos, críticos y transaccionales deben incluir `trace_id`. | CONFIRMED | soporte, logging |
| 42 | Producción oculta detalle técnico; development puede mostrar detalle controlado. | CONFIRMED | seguridad, debugging |
| 43 | Categorías funcionales de error usan prefijos por dominio (`auth.*`, `validation.*`, `business.*`, etc.). | CONFIRMED | API, frontend |
| 44 | La ubicación física definitiva de logs técnicos se definirá más adelante. | CONFIRMED | arquitectura, operación |
| 45 | Error handling técnico queda separado de auditoría funcional; auditoría se profundiza en `12-audit-log.md`. | CONFIRMED | audit, backend |

| 46 | `12-audit-log.md` documenta auditoría funcional separada de logs técnicos. | CONFIRMED | audit, backend, DB |
| 47 | La auditoría funcional se guarda en tabla persistente `audit_logs`. | CONFIRMED | DB, trazabilidad |
| 48 | `audit_logs` usa estructura genérica con `action`, `resource_type`, `resource_id`, `operation_result`, `reason`, `before_data`, `after_data` y `metadata`. | CONFIRMED | DB, backend |
| 49 | `operation_result` usa `success`, `failed` y `blocked`. | CONFIRMED | audit, backend |
| 50 | En primera etapa, el audit log funcional se limita a Sales e Inventory. | CONFIRMED | audit, MVP |
| 51 | `before_data` y `after_data` guardan datos resumidos y relevantes, no snapshots completos. | CONFIRMED | audit, storage |
| 52 | `reason` representa el motivo funcional de la acción y es obligatorio solo para operaciones sensibles/correctivas. | CONFIRMED | audit, validation |
| 53 | No habrá interfaz de audit log ni eliminación automática en primera etapa. | CONFIRMED | frontend, DB, operación |


| 54 | `13-development-roadmap.md` organiza el desarrollo por fases incrementales con dependencias y criterios de finalización. | CONFIRMED | roadmap, planificación |
| 55 | Phase 0 establece la base técnica antes de implementar módulos funcionales. | CONFIRMED | backend, DB, Docker, migrations |
| 56 | El orden base confirmado es seguridad/catálogos -> entidades comerciales -> inventario -> caja -> ventas. | CONFIRMED | roadmap, dependencies |
| 57 | Cash base debe implementarse antes de ventas completas; Cash es operativo y no equivale a contabilidad. | CONFIRMED | cash, sales, MVP |
| 58 | Accounting / Contabilidad queda fuera del MVP y se implementará en una etapa futura. | CONFIRMED | accounting, future |
| 59 | Layaways se implementa después de Sales. | CONFIRMED | layaways, sales, inventory, cash |
| 60 | Purchases se implementa después de Layaways y usa productos/variantes existentes; no crea productos desde compras en el MVP. | CONFIRMED | purchases, products, inventory |
| 61 | Supplier Returns, Damaged Goods, Loaned Goods, Sale Returns y Sale Voids son flujos de excepción operativa posteriores a los módulos base. | CONFIRMED | operational flows |
| 62 | Reports se implementa después de datos operativos suficientes; Phase 10 cierra con estabilización, checklist y documentos AI. | CONFIRMED | reports, AI docs, checklist |
