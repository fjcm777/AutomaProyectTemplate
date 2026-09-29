# CODE_ALIGNMENT - Revisión del proyecto actual

## Propósito

Este documento explica cómo debe interpretarse el estado del código del repositorio frente a la documentación funcional/técnica confirmada.

## Estado actual del código

El repositorio incluye un backend FastAPI y un frontend React + TypeScript + Vite con una estructura de **ejemplo desechable**: valida que el patrón de capas (`api.py`/`service.py`/`repository.py`/`models.py`/`schemas.py` en backend), el enforcement de límites entre módulos (`16-enforcement.md`) y el contrato de API (`08-api-contracts.md`) funcionan de extremo a extremo contra una base de datos real, antes de empezar a construir los módulos de negocio confirmados.

Ese código de ejemplo es solo referencia técnica. Se elimina al iniciar desarrollo oficial del primer módulo real del MVP y no debe extenderse ni tratarse como un módulo confirmado (ver `DECISION_LOG.md`, decisión de limpieza de código de plantilla).

## Interpretación correcta

```text
El código actual no limita el diseño final.
La documentación debe guiar la evolución del código.
Los módulos del MVP se implementarán progresivamente siguiendo la documentación,
no extendiendo el código de ejemplo existente.
```

## Módulos confirmados del MVP

El diseño documentado (`07-modules.md`) incluye:

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

Ninguno de estos módulos está implementado todavía en el código.

## Regla de trabajo para continuar

Para continuar cualquier implementación o ajuste documental, se debe tomar en cuenta:

- La arquitectura objetivo (`04-architecture.md`, `07-modules.md`).
- Los permisos definidos en `06-auth-rbac.md`.
- Los contratos definidos en `08-api-contracts.md`.
- Las rutas objetivo de `09-frontend-routes.md`.

---

# Complemento v5

La documentacion v5 incluye decisiones objetivo que pueden no existir aun en el codigo actual:

| Elemento | Estado esperado |
|---|---|
| `inventory_loans` | Pendiente de implementar |
| `customer_credit_applications` | Pendiente de implementar |
| `quantity_available` generado por PostgreSQL | Pendiente de migracion |
| Reembolso de saldo a favor | Pendiente de implementar |
| Utilidad estimada en reportes | Pendiente de implementar |
| Restriccion de estados finales | Pendiente de implementar en services |
| Transferencias internas | Fuera del MVP inicial |

---

# Complemento 09 - Frontend routes

`09-frontend-routes.md` define el diseño objetivo de rutas navegables del frontend.

## Estructura frontend objetivo

```text
frontend/src/
  app/
    router/
      router.tsx
    layouts/
      AppLayout.tsx
      PublicLayout.tsx
    guards/
      RequireAuth.tsx
      GuestOnly.tsx
  features/
    auth/
    dashboard/
    products/
    customers/
    suppliers/
    inventory/
    sales/
    layaways/
    cash/
    purchases/
    reports/
    admin/
  shared/
```

## Regla de alineacion

El código de ejemplo actual es una base técnica desechable, no una referencia de rutas. La implementación frontend debe tomar como referencia `09-frontend-routes.md` y mantener consistencia con:

- `06-auth-rbac.md` para permisos;
- `08-api-contracts.md` para consumo de API;
- `01-business-rules.md` y `02-process-flows.md` para flujos criticos.


---

# Complemento v7 - Validaciones, errores y transacciones

`10-validation-rules.md` define el patrón objetivo para validaciones del sistema.

## Implicaciones para el código

| Área | Ajuste esperado |
|---|---|
| Schemas | Validar estructura, tipos básicos, campos requeridos y formatos simples. |
| Services | Validar reglas de negocio, permisos funcionales, estados, stock, caja, saldos y transacciones. |
| Repositories | Persistencia y consultas; no deben contener reglas de negocio principales. |
| API handlers | Orquestar request/response, dependencias, permisos y conversión a respuestas estándar. |
| Frontend | Validar para UX, mostrar mensajes en español y respetar respuestas del backend. |

## Errores backend

El código debe respetar `08-api-contracts.md`:

```json
{
  "status_code": 422,
  "code": "validation.invalid_input",
  "message": "Hay campos inválidos. Revise la información ingresada.",
  "details": {
    "errors": []
  }
}
```

No debe implementarse una estructura paralela con `error_code`.

## Warnings

Las advertencias no bloqueantes deben regresar en respuestas exitosas mediante `warnings`.

Ejemplo:

```json
{
  "status_code": 200,
  "message": "Pago registrado correctamente.",
  "data": {},
  "warnings": [
    {
      "code": "layaway.expired_payment_allowed",
      "message": "El apartado está vencido, pero puede registrar el pago si desea continuar."
    }
  ]
}
```

## Transacciones

Los services que afecten múltiples módulos deben ejecutar la operación como una transacción atómica.
Esto aplica a ventas, apartados, devoluciones, anulaciones, compras recibidas, retornos a proveedor,
bajas de inventario, conversiones de préstamos a venta y cierre de caja.


---

# Complemento v8 - Error handling

`11-error-handling.md` define el patrón objetivo para manejo de errores del sistema.

## Implicaciones para el código

| Área | Ajuste esperado |
|---|---|
| Excepciones estándar | Helpers compartidos que respondan con `status_code`, `code`, `message` y `details`. |
| API handlers | Convertir excepciones controladas en respuestas API estándar sin duplicar lógica por endpoint. |
| Services | Lanzar errores funcionales para reglas de negocio, estados, permisos, inventario, caja y transacciones. |
| Repositories | No deben convertir errores técnicos en mensajes de usuario; deben propagar fallos a capas superiores. |
| Frontend | Consumir `message`, `details.errors` y `warnings` sin inventar mensajes técnicos. |
| Logging | Registrar errores relevantes internamente y usar `trace_id` en errores internos, críticos y transaccionales. |

## Códigos confirmados

```text
system.internal_error
business.transaction_failed
```

## Reglas importantes

- No implementar una estructura paralela con `error_code`.
- No hacer `severity` obligatorio en el JSON público.
- No exponer stack traces, SQL, constraints, tokens, secretos ni rutas internas en producción.
- En `development` puede existir detalle técnico controlado dentro de `details.debug`.
- Los logs técnicos del MVP deben emitirse por stdout/stderr del backend y ser visibles mediante Docker logs / Docker Compose logs; la centralización, monitoreo, alertas y retención formal quedan para etapa posterior.
- Error handling técnico no reemplaza auditoría funcional.

## Alineación agregada por 12-audit-log.md

La auditoría funcional debe implementarse como capacidad compartida de backend, preferiblemente en `shared/audit.py`, pero su alcance inicial queda limitado a operaciones sensibles de Sales e Inventory.

Reglas de implementación:

```text
- No crear interfaz frontend de audit log en primera etapa.
- No auditar consultas normales.
- No auditar todavía todos los módulos.
- Registrar audit_logs desde service.py/backend, no desde frontend.
- El frontend solo envía reason cuando la operación lo requiera.
- El backend completa user_id, action, resource_type, resource_id, operation_result, before_data, after_data, metadata, ip_address, user_agent y created_at.
- before_data y after_data deben ser resumidos y relevantes, no snapshots completos innecesarios.
- No implementar eliminación automática de audit_logs en primera etapa.
```

Campos confirmados para la tabla:

```text
user_id
action
resource_type
resource_id
operation_result
reason
before_data
after_data
metadata
ip_address
user_agent
created_at
```


---

# Complemento v10 - Roadmap de desarrollo

El orden de implementacion objetivo queda definido en `13-development-roadmap.md`.

```text
Phase 0  - Technical foundation
Phase 1  - Auth, Users, Roles, Permissions, Catalogs base
Phase 2  - Products, Customers, Suppliers
Phase 3  - Inventory base
Phase 4  - Cash base
Phase 5  - Sales base
Phase 6  - Layaways
Phase 7  - Purchases
Phase 8  - Operational exception flows
Phase 9  - Reports
Phase 10 - Stabilization, implementation checklist, AI documentation
```

Reglas de alineacion para desarrollo:

```text
- No implementar ventas completas antes de caja base.
- No implementar compras antes de productos, proveedores e inventario base.
- Purchases no debe crear productos ni variantes en el MVP.
- Accounting / Contabilidad no forma parte del MVP; queda para etapa futura.
- Los documentos AI se generan al final de la documentacion principal.
```


---

## v11 - MVP Scope alignment

`14-mvp-scope.md` defines what is included in the first operational version and what must remain future scope.

Implementation rules:

- Do not implement modules or workflows outside MVP unless explicitly re-scoped.
- Treat real modules and workflows separately. Workflows such as sale voids, sale returns, cash closing, damaged goods, loaned goods, purchase receiving and supplier returns belong inside their related modules.
- Keep Sales and Cash as separate modules. Sales records the commercial operation; Cash records and controls money movements and closing.
- Cash is part of the MVP. Accounting is not part of the MVP.
- Purchases must not create products or variants in the MVP. It must reference existing Products/Variants.
- Audit Log is limited to sensitive Sales and Inventory actions and has no UI in the MVP.
- Technical logs must be emitted by the backend through stdout/stderr and be visible with Docker logs / Docker Compose logs. Do not implement a logs UI, monitoring dashboard, alerting or centralized observability in the MVP.
- Advanced analytics, e-commerce, native mobile app, external integrations, advanced multi-store workflows and advanced inventory planning are future scope.

Required Docker log visibility for MVP:

```bash
docker compose logs api
docker compose logs -f api
```

---

## v12 - Implementation Checklist alignment

`15-implementation-checklist.md` must be used as the practical verification guide before considering any feature, workflow or MVP phase complete.

Implementation rules:

- Use the checklist after each development phase and before accepting generated code.
- Verify technical foundation before implementing functional modules.
- Verify Security/Auth/RBAC before exposing protected routes or sensitive actions.
- Verify each real MVP module against its minimum operations and confirmed restrictions.
- Verify critical workflows end-to-end, not only CRUD screens.
- Verify backend validations even when frontend validations exist.
- Verify API responses follow `status_code`, `code`, `message`, `details` and `warnings` when applicable.
- Verify frontend routes follow `09-frontend-routes.md`, including `/login`, `/dashboard`, `/admin`, `/forbidden`, `/session-expired`, `/not-found` and fallback `*`.
- Verify audit log remains limited to Sales and Inventory in the MVP and has no UI.
- Verify technical logs remain stdout/stderr-based and visible through Docker logs in the MVP.
- Do not mark MVP complete if Accounting, BI, external integrations, audit UI, log UI, monitoring dashboards or product creation from Purchases were implemented without explicit scope change.

Checklist gate before accepting code:

```text
1. Does the implementation respect MVP scope?
2. Does it respect the roadmap order and module boundaries?
3. Are backend validations and permissions enforced?
4. Are critical workflows transactional?
5. Do API errors and warnings follow the confirmed contract?
6. Are frontend routes, guards and forms aligned?
7. Are audit/logging decisions respected?
8. Are out-of-scope features avoided?
```

---

## v13 - AI-assisted development alignment

The derived AI documentation files must be used as guardrails before asking an AI to generate code:

```text
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```

Implementation tasks should follow this order:

1. Read `AI_CONTEXT.md` for project-wide context.
2. Read `AI_DEVELOPMENT_GUIDE.md` for mandatory rules.
3. Use a focused prompt from `AI_TASK_PROMPTS.md`.
4. Verify implementation against `15-implementation-checklist.md`.
5. Check module-specific rules in source documents before coding.

AI-generated code must not:

- add Accounting to the MVP;
- turn workflows into modules;
- merge Sales and Cash;
- create products from Purchases;
- add Audit Log UI;
- add Technical Logs UI;
- add external integrations as mandatory MVP behavior;
- change API error format;
- skip backend permission checks;
- skip backend validations;
- skip transactions in critical workflows.

If a requested implementation requires changing confirmed documentation, the AI/developer must stop and identify affected documents before coding.

---

## v14 - Template base validation (resolved)

Before starting the confirmed MVP modules, the disposable example code was used to validate that the shared technical base works end-to-end: the layering pattern, the module-boundary enforcement (`16-enforcement.md`), the API envelope contract, and the async database session model all needed to work correctly before being relied upon by real modules.

The following gaps were found against confirmed documentation and fixed at the shared-base level (`core/`, `shared/`, `main.py`), then verified through the disposable example code:

| Gap found | Fix applied |
|---|---|
| No endpoint returned the `{status_code, message, data}` success envelope required by `08-api-contracts.md` §2 | Added a shared response helper (`SuccessResponse[T]`, `success()`) |
| Errors used the framework's native error shape instead of `{status_code, code, message, details}` | Replaced native HTTP exceptions with a custom `AppError`; added global exception handlers for `AppError`, request validation errors (→ `validation.invalid_input`) and unhandled exceptions (→ `system.internal_error` with `trace_id`) |
| The shared pagination helper used `items/total/limit/offset` instead of the documented `items/total/page/page_size` | Corrected field names to match `08-api-contracts.md` §2.3, and wired pagination into the example list endpoints |
| The backend used synchronous SQLAlchemy (`Session`, `create_engine`) instead of the `AsyncSession` required throughout `04-architecture.md` and `07-modules.md` (including the multi-module transaction rule) | Migrated the database engine/session setup to `create_async_engine` / `AsyncSession`; the DB connection string stays driver-less so Alembic keeps using sync psycopg2 unchanged |
| `08-api-contracts.md` §4 requires "Listar" to return `items/total/page/page_size`, and "Desactivar (DELETE)" to be a logical delete, not a physical row removal | Added pagination query params to list endpoints; added a logical `is_active` flag so `DELETE` deactivates instead of removing rows |

Verified end-to-end against a real PostgreSQL instance: full CRUD, pagination envelope, `404`/`400`/`422` error shapes, logical delete, and `import-linter` contracts all pass.

This validation is complete. The disposable example code that was used to verify it is removed before implementing the first confirmed MVP module — only the corrected shared base and the enforcement setup carry forward.
