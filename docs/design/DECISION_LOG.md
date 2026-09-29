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
| 44 | La ubicación física definitiva de logs técnicos quedaba pendiente; decisión reemplazada por v11: stdout/stderr + Docker logs en MVP. | UPDATED | arquitectura, operación |
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


| 63 | `14-mvp-scope.md` define el alcance del MVP separado del roadmap. | CONFIRMED | MVP, documentación |
| 64 | Los módulos reales y workflows operativos deben documentarse por separado en MVP Scope. | CONFIRMED | MVP, modules |
| 65 | Sales y Cash son módulos separados pero integrados; Cash Closing pertenece a Cash. | CONFIRMED | sales, cash |
| 66 | Workflows incluidos en MVP: anulaciones/devoluciones de venta, cierre/diferencias de caja, ajustes, dañados, préstamos, pagos/cancelación de apartados, recepción de compra y retornos a proveedor. | CONFIRMED | MVP, workflows |
| 67 | Funcionalidades fuera del MVP: Accounting, analítica avanzada, integraciones externas, e-commerce, app móvil, audit log UI, BI avanzado y operaciones multi-tienda complejas. | CONFIRMED | MVP, future |
| 68 | Logs técnicos del MVP se emiten por stdout/stderr del backend y son visibles con Docker logs / Docker Compose logs. | CONFIRMED | logs, backend, Docker |
| 69 | No habrá UI de logs técnicos, dashboard de monitoreo, alertas, centralización ni retención formal de logs en el MVP. | CONFIRMED | logs, future |
| 70 | El MVP se considera completo al operar ventas, inventario, caja, apartados, compras, clientes, proveedores, reportes básicos y trazabilidad mínima con documentación alineada. | CONFIRMED | MVP, acceptance |

| 71 | `15-implementation-checklist.md` se organiza como checklist práctico por áreas/fases para implementar, revisar y validar el MVP. | CONFIRMED | implementation, QA, AI-assisted development |
| 72 | La base técnica debe estar estable antes de módulos funcionales: backend, frontend, DB, Docker, migrations, errores, validaciones, logs y estructura modular. | CONFIRMED | technical foundation |
| 73 | El checklist de Security/Auth/RBAC valida login con username, usuarios activos/inactivos, roles, permisos dinámicos y validación backend de permisos. | CONFIRMED | security, auth, RBAC |
| 74 | El checklist por módulo cubre los módulos reales del MVP y sus restricciones, incluyendo Products como catálogo maestro y Purchases sin creación de productos/variantes. | CONFIRMED | modules, MVP |
| 75 | El checklist de workflows críticos valida implementación end-to-end, transaccionalidad, permisos, inventario, caja, auditoría cuando aplique y errores estructurados. | CONFIRMED | workflows, transactions |
| 76 | El checklist Validation/API/Frontend refuerza validaciones backend, contrato API, warnings, trace_id, React Router v6, guards y manejo de errores por formulario. | CONFIRMED | validation, API, frontend |
| 77 | El checklist final confirma audit log limitado, logs técnicos básicos, exclusiones del MVP y criterios para considerar el MVP completo. | CONFIRMED | audit, logs, MVP completion |

---

## v13 - AI documentation decisions

### Decision 78 - Generate derived AI documentation package

**Status:** CONFIRMED  
**Decision:** Generate the derived AI documentation after completing documents `00` through `15`.

Included files:

```text
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```

### Decision 79 - AI documents must not introduce new functional decisions

**Status:** CONFIRMED  
**Decision:** The AI documents are derived from confirmed documentation and must not introduce new scope, modules, workflows, API formats or business rules.

They must summarize, organize and convert confirmed decisions into reusable guidance for AI-assisted development.

### Decision 80 - AI context must reinforce non-negotiable project constraints

**Status:** CONFIRMED  
**Decision:** `AI_CONTEXT.md` must explicitly reinforce the most important decisions:

- Accounting remains outside the MVP.
- Cash is operational and included in MVP.
- Sales and Cash are separate but integrated modules.
- Products is the master catalog.
- Purchases does not create products or variants in MVP.
- Audit Log is limited initially to Sales and Inventory.
- Audit Log has no UI in MVP.
- Technical logs are emitted through backend stdout/stderr and visible with Docker logs.
- API errors use `status_code`, `code`, `message`, `details`.

### Decision 81 - AI development guide as guardrail for implementation

**Status:** CONFIRMED  
**Decision:** `AI_DEVELOPMENT_GUIDE.md` must define how an AI/developer should work with the documentation, including what to check before coding and what not to implement without a confirmed decision.

### Decision 82 - AI task prompts as reusable development prompts

**Status:** CONFIRMED  
**Decision:** `AI_TASK_PROMPTS.md` must provide reusable prompts for backend, frontend, migrations, workflow validation, testing, documentation review and MVP scope evaluation.

---

## v14 - Final documentation package

### Decision 83 - Consolidate final complete documentation package

**Status:** CONFIRMED  
**Decision:** Consolidate the full documentation package after completing documents `00` through `15` and the derived AI documentation files.

Included final baseline:

```text
00-business-context.md
01-business-rules.md
02-process-flows.md
03-use-cases.md
04-architecture.md
05-database.md
06-auth-rbac.md
07-modules.md
08-api-contracts.md
09-frontend-routes.md
10-validation-rules.md
11-error-handling.md
12-audit-log.md
13-development-roadmap.md
14-mvp-scope.md
15-implementation-checklist.md
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
README.md
CODE_ALIGNMENT.md
DECISION_LOG.md
```

This package becomes the current complete documentation baseline for implementation.

---

## v15 - Consistency correction pass

### Decision 84 - Align use cases with confirmed MVP scope

**Status:** CONFIRMED  
**Decision:** `03-use-cases.md` was corrected to remove or reclassify obsolete use cases that contradicted later confirmed decisions.

Confirmed alignment:

- Internal transfers between warehouses/locations are not part of the MVP and must be treated as future scope.
- Purchases use the confirmed MVP state flow: `draft -> received / cancelled`.
- Confirm/reject purchase order flows are not part of the MVP.
- Received purchases are final and must not be directly cancelled or reversed.
- Layaway term must be configurable, not hardcoded as a fixed two-month rule.
- Customer balance/debt handling must not depend on a `credit_limit` field in the MVP.
- Customer debt exceptions use confirmed permissions/override behavior instead of an undefined credit-limit approval workflow.

### Decision 85 - Correct customer balance movement enum in API examples

**Status:** CONFIRMED  
**Decision:** `08-api-contracts.md` was corrected so customer balance adjustment examples use a valid `customer_balance_movements.movement_type` value.

The invalid example value:

```text
credit_adjustment
```

was replaced with a valid confirmed value:

```text
adjustment_in
```

### Decision 86 - Add missing supplier credit apply permission

**Status:** CONFIRMED  
**Decision:** The permission required for applying supplier credits was added to RBAC documentation and aligned with API contracts.

Confirmed permission:

```text
suppliers.credits.apply
```

This closes the gap for:

```text
POST /api/v1/suppliers/credits/{id}/apply
```

### Decision 87 - Update AI documentation status and category alignment notes

**Status:** CONFIRMED  
**Decision:** Documentation references were cleaned up to avoid obsolete implementation guidance.

Confirmed corrections:

- `09-frontend-routes.md` no longer states that AI documentation files are pending/nonexistent.
- `CODE_ALIGNMENT.md` no longer treats category placement as an open question when it is already confirmed by module documentation.

### Decision 88 - Document precedence rule for AI-assisted implementation

**Status:** CONFIRMED  
**Decision:** `AI_DEVELOPMENT_GUIDE.md` was updated to make document precedence explicit when older documents conflict with later confirmed corrections.

Confirmed rule:

```text
When documents conflict, DECISION_LOG.md and the latest corrected documents take precedence over older uncorrected content.
```

This prevents AI-assisted implementation from reintroducing obsolete use cases, endpoints, database fields or workflows.

---

## v16 - Traceability patch

### Decision 89 - Register v15 corrections in DECISION_LOG

**Status:** CONFIRMED  
**Decision:** Add the missing v15 correction decisions to `DECISION_LOG.md` so that the highest-precedence document reflects the consistency corrections already applied in the v15 documentation package.

This is a traceability correction only. It does not introduce new functional scope or change implementation behavior.

---

## v17 - Module boundary enforcement

### Decision 90 - Add import-linter as automated module-boundary enforcement

**Status:** CONFIRMED
**Decision:** Add `16-enforcement.md` and an `import-linter` configuration (`backend/.importlinter`) to verify, automatically, the module independence rules already defined in `07-modules.md` sections 7 and 9 (no cross-module `repository.py`/`models.py` imports, `repository.py` never imports `service.py`).

Enforcement runs in three layers: manual (`lint-imports`), a local pre-commit hook, and CI as a final safety net. This is quality/tooling infrastructure; it does not introduce new functional scope or change business behavior.

The contracts were validated against the disposable example code described in Decision 92, which also surfaced a real cross-module boundary violation that was corrected as part of this change.

---

## v18 - Template base alignment

### Decision 91 - Align the shared technical base with documented architecture

**Status:** CONFIRMED
**Decision:** Before implementing the confirmed MVP modules, the shared technical base (`core/`, `shared/`, `main.py`) was corrected to match already-confirmed documentation, since every future module depends on it:

- Database engine/session migrated from synchronous SQLAlchemy (`Session`) to `AsyncSession`, per the multi-module transaction rule in `07-modules.md`.
- Added a shared response helper (`SuccessResponse[T]`) so every endpoint returns the `{status_code, message, data}` envelope required by `08-api-contracts.md`.
- Replaced framework-native error responses with a custom application error type and global exception handlers, producing `{status_code, code, message, details}` for functional errors, request validation errors and unhandled exceptions.
- Corrected the shared pagination helper to `items/total/page/page_size` and wired it into the "Listar" endpoints, per `08-api-contracts.md` §4.
- Added a logical `is_active` flag so `DELETE` performs a logical deactivation instead of a physical row removal, per `08-api-contracts.md` §4 and the "no eliminación física" rule for catalogs.

This is a correction to match already-confirmed documentation; it does not introduce new functional scope. Verified end-to-end against a real PostgreSQL instance using the disposable example code described in Decision 92, and confirmed `import-linter` contracts still pass.

---

## v19 - Template code is reference-only

### Decision 92 - Example/reference code must be cleaned up before official module development, not extended

**Status:** CONFIRMED
**Decision:** The backend and frontend currently include disposable example code, used only to validate that the shared technical patterns work end-to-end (module layering, response/error envelope, async session handling, module-boundary enforcement) before real MVP development starts. This example code is not, and must not be treated as, a confirmed module of the system, and none of its specific module/feature names should be referenced elsewhere in the confirmed documentation.

Decisions 90 and 91 corrected the shared technical base and validated it through this example code — those corrections (async, envelopes, `import-linter` contracts, the logical-delete migration) are permanent; the example code used to validate them is not.

When official development starts on the first real MVP module (per `13-development-roadmap.md`'s phase order), all disposable example code — backend and frontend alike, including its database migrations — must be removed, not extended. Only the corrected shared base, the enforcement setup, and the confirmed module list in `07-modules.md` carry forward.
