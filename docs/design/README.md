# Automata / Calzado Norita - Indice de documentacion

**Version:** documentación final completa v14  
**Fecha:** 2026-07-29  
**Estado:** documentación principal y documentos derivados de IA completados  
**Siguiente documento pendiente:** ninguno; corresponde revisión final y uso para implementación

---

## 1. Proposito

Esta documentacion define el diseno funcional y tecnico de **Automata** para **Calzado Norita**.

Debe servir como mapa para desarrollo humano y desarrollo asistido con IA.

| Audiencia | Uso principal |
|---|---|
| Responsable funcional | Validar reglas del negocio |
| Backend | Implementar modulos, servicios, DB y API |
| Frontend | Implementar rutas, pantallas, permisos y consumo de API |
| IA de desarrollo asistido | Generar codigo respetando reglas y decisiones confirmadas |
| QA / pruebas | Derivar escenarios funcionales y casos criticos |

---

## 2. Orden de lectura recomendado

```text
00 -> contexto del negocio
01 -> reglas de negocio
02 -> flujos de proceso
03 -> casos de uso
04 -> arquitectura
05 -> base de datos
06 -> autenticacion y permisos
07 -> modulos backend
08 -> contratos API
09 -> rutas frontend
10 -> reglas de validación
11 -> manejo de errores
12 -> auditoría funcional
13 -> roadmap de desarrollo
14 -> alcance MVP
15 -> checklist de implementacion
```

Antes de implementar una funcionalidad, revisar:

1. `01-business-rules.md`
2. `02-process-flows.md`
3. `03-use-cases.md`
4. `05-database.md`
5. `07-modules.md`
6. `08-api-contracts.md`
7. `09-frontend-routes.md`
8. `10-validation-rules.md`
9. `11-error-handling.md`
10. `12-audit-log.md`
11. `13-development-roadmap.md`
12. `14-mvp-scope.md`
13. `15-implementation-checklist.md`
14. `CODE_ALIGNMENT.md`

---

## 3. Indice de documentos

| Orden | Documento | Proposito | Uso recomendado |
|---:|---|---|---|
| 00 | [`00-business-context.md`](00-business-context.md) | Contexto, alcance, actores, stack y principios. | Entender el objetivo general. |
| 01 | [`01-business-rules.md`](01-business-rules.md) | Reglas obligatorias del negocio. | Antes de implementar logica. |
| 02 | [`02-process-flows.md`](02-process-flows.md) | Flujos paso a paso. | Disenar servicios y pantallas. |
| 03 | [`03-use-cases.md`](03-use-cases.md) | Casos de uso por modulo/actor/permiso. | Planificar endpoints y pruebas. |
| 04 | [`04-architecture.md`](04-architecture.md) | Arquitectura, capas, transacciones y estructura. | Organizar codigo. |
| 05 | [`05-database.md`](05-database.md) | Diccionario tecnico de datos. | Crear modelos/migraciones. |
| 06 | [`06-auth-rbac.md`](06-auth-rbac.md) | Auth, roles, permisos y seguridad. | Proteger acciones y rutas. |
| 07 | [`07-modules.md`](07-modules.md) | Responsabilidades por modulo. | Ubicar logica y dependencias. |
| 08 | [`08-api-contracts.md`](08-api-contracts.md) | Endpoints, respuestas, errores y acciones criticas. | Implementar API y cliente frontend. |
| 09 | [`09-frontend-routes.md`](09-frontend-routes.md) | Rutas navegables del frontend, layouts, guards, permisos sugeridos y navegación. | Implementar router, pantallas, guards y menú. |
| 10 | [`10-validation-rules.md`](10-validation-rules.md) | Reglas de validación frontend/backend, severidad documental, mensajes y alineación con errores API. | Implementar validaciones, QA y manejo de errores. |
| 11 | [`11-error-handling.md`](11-error-handling.md) | Manejo de errores técnicos, negocio, permisos, transacciones, warnings, trace_id y comportamiento por ambiente. | Implementar respuestas seguras, excepciones estándar y diagnóstico. |
| 12 | [`12-audit-log.md`](12-audit-log.md) | Auditoría funcional persistente para acciones sensibles de ventas e inventario. | Implementar trazabilidad funcional en backend y base de datos. |
| 13 | [`13-development-roadmap.md`](13-development-roadmap.md) | Fases incrementales de desarrollo, dependencias, criterios de finalización y alcance post-MVP. | Planificar implementación y evitar desarrollar módulos fuera de orden. |
| 14 | [`14-mvp-scope.md`](14-mvp-scope.md) | Alcance del MVP, módulos incluidos, workflows incluidos, exclusiones, restricciones y criterios de finalización. | Evitar scope creep y orientar desarrollo asistido por IA. |
| 15 | [`15-implementation-checklist.md`](15-implementation-checklist.md) | Checklist práctico para implementar, revisar y validar el MVP. | Guiar desarrollo, QA y desarrollo asistido por IA. |
| CA | [`CODE_ALIGNMENT.md`](CODE_ALIGNMENT.md) | Codigo actual vs diseno objetivo. | Evitar confundir template con sistema final. |
| DL | [`DECISION_LOG.md`](DECISION_LOG.md) | Registro de decisiones confirmadas. | Revisar historial de decisiones. |

---

## 4. Diagramas

| Diagrama | Archivo | Uso |
|---|---|---|
| Casos de uso | [`automata-use-cases.drawio`](automata-use-cases.drawio) | Actores y operaciones principales |
| Arquitectura | [`automata-architecture.drawio`](automata-architecture.drawio) | Frontend, backend, DB, modulos y jobs |
| Base de datos | [`automata-database-er.drawio`](automata-database-er.drawio) | Entidades y relaciones principales |
| Modulos | [`automata-modules.drawio`](automata-modules.drawio) | Responsabilidades y comunicacion |
| API | [`automata-api-contracts.drawio`](automata-api-contracts.drawio) | Contratos y acciones criticas |

---

## 5. Decisiones confirmadas clave

| Area | Decision | Estado |
|---|---|---|
| Arquitectura | Monolito modular | `CONFIRMED` |
| Transferencias internas bodega/exhibicion | Fuera del MVP inicial | `CONFIRMED` |
| Disponibilidad | `quantity_available` sera columna generada por PostgreSQL | `CONFIRMED` |
| Saldo a favor | Se consume FIFO | `CONFIRMED` |
| Trazabilidad saldo | Se agrega `customer_credit_applications` | `CONFIRMED` |
| Uso saldo | Puede usarse en ventas y apartados | `CONFIRMED` |
| Pagos mixtos | Permitidos en ventas y apartados | `CONFIRMED` |
| Anulacion con saldo usado | Restaura saldo a favor | `CONFIRMED` |
| Reembolso de saldo | Permitido con permiso especial, motivo, caja/auditoria | `CONFIRMED` |
| Estados finales | No se reabren; se corrige con procesos compensatorios | `CONFIRMED` |
| Retorno proveedor | Solo `created` puede cancelarse | `CONFIRMED` |
| Compra recibida | No puede cancelarse directamente | `CONFIRMED` |
| Reportes ventas | Incluyen utilidad estimada simple | `CONFIRMED` |
| Frontend routes | `09-frontend-routes.md` define diseño objetivo de rutas navegables | `CONFIRMED` |
| Rutas de prueba frontend | `test` y `tictactoe` no forman parte del diseño final | `CONFIRMED` |
| Validaciones | Backend es fuente definitiva; frontend valida para UX | `CONFIRMED` |
| Errores API | Usar `status_code`, `code`, `message`, `details`; validaciones múltiples en `details.errors` | `CONFIRMED` |
| Warnings API | Advertencias no bloqueantes en respuestas exitosas con `warnings` | `CONFIRMED` |
| Atomicidad | Operaciones críticas multi-módulo deben ser transaccionales | `CONFIRMED` |
| Error interno | Usar `system.internal_error` para errores inesperados | `CONFIRMED` |
| Fallo transaccional | Usar `business.transaction_failed` con `trace_id` | `CONFIRMED` |
| Logs técnicos | Registrar errores relevantes internamente; almacenamiento físico definitivo pendiente | `CONFIRMED` |
| Audit log | Persistente en DB, separado de logs técnicos, sin interfaz ni eliminación automática en primera etapa | `CONFIRMED` |
| Alcance auditoría | Primera etapa limitada a Sales e Inventory | `CONFIRMED` |
| Roadmap | Fases incrementales: foundation, seguridad/catálogos, entidades, inventario, caja, ventas, apartados, compras, excepciones, reportes y estabilización | `CONFIRMED` |
| Contabilidad | Fuera del MVP; queda para etapa futura con puntos de integración preparados | `CONFIRMED` |
| Purchases | No crea productos/variantes en MVP; usa catálogo Products existente | `CONFIRMED` |
| Implementation checklist | Checklist práctico por áreas/fases para validar implementación del MVP | `CONFIRMED` |

---

## 6. Matriz rapida de implementacion

| Caso de uso | Modulo | Endpoint | Permiso | Tablas principales | Eventos |
|---|---|---|---|---|---|
| Crear venta | sales | `POST /api/v1/sales` | `sales.create` | sales, sale_items, sale_payments, inventory_stock, inventory_movements, cash_movements | `sale.created` |
| Venta con saldo a favor | sales/customers | `POST /api/v1/sales` | `sales.create` | sales, sale_payments, customer_credit_applications, customer_balance_movements | `sale.created`, `customer_credit.used` |
| Anular venta | sales | `POST /api/v1/sales/{id}/void` | `sales.void` | sales, inventory_movements, cash_movements, customer_credit_applications, audit_logs | `sale.voided` |
| Devolucion venta | sales | `POST /api/v1/sales/{id}/return` | `sales.return` | sale_returns, sale_return_items, inventory_movements, cash_movements, audit_logs | `sale.returned` |
| Crear apartado | layaways | `POST /api/v1/layaways` | `layaways.create` | layaways, layaway_items, layaway_payments, inventory_movements | `layaway.created` |
| Completar apartado | layaways/sales | `POST /api/v1/layaways/{id}/complete` | `layaways.payment` | layaways, sales, sale_items, inventory_movements | `layaway.completed`, `sale.created` |
| Reembolsar saldo cliente | customers/cash | `POST /api/v1/customers/{id}/credit-refund` | `customers.balance_refund` | customer_balance_movements, customer_credit_applications, cash_movements | `customer_credit.refunded` |
| Crear prestamo | inventory | `POST /api/v1/inventory/loans` | `inventory.loan` | inventory_loans, inventory_stock, inventory_movements, audit_logs | `inventory.loaned` |
| Retornar prestamo | inventory | `POST /api/v1/inventory/loans/{id}/return` | `inventory.return_loan` | inventory_loans, inventory_stock, inventory_movements, audit_logs | `inventory.loan_returned` |
| Recibir compra | purchases/inventory | `POST /api/v1/purchases/{id}/receive` | `purchases.create` | purchases, purchase_items, inventory_stock, inventory_movements | `purchase.received` |
| Resolver retorno proveedor | suppliers/inventory | `POST /api/v1/suppliers/returns/{id}/resolve` | `supplier_returns.resolve` | supplier_returns, supplier_credits, inventory_movements | `supplier_return.resolved` |

---

## 7. Estado final

La documentación principal y los documentos derivados de IA están completos.

Documentos principales completados:

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
```

Documentos derivados para desarrollo asistido por IA completados:

```text
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```

Siguiente paso recomendado: usar `AI_CONTEXT.md`, `AI_DEVELOPMENT_GUIDE.md`, `AI_TASK_PROMPTS.md` y `15-implementation-checklist.md` para iniciar tareas de implementación controladas contra la documentación fuente.


## v11 - MVP Scope summary

`14-mvp-scope.md` confirms the first operational scope of Automata / Calzado Norita.

Key confirmations:

- MVP Scope is separate from the roadmap.
- Included modules and included workflows are documented separately.
- Sales and Cash are separate but integrated modules.
- Cash is operational and included in the MVP.
- Accounting remains future/post-MVP.
- Purchases does not create products or variants in MVP.
- Audit Log is included only for Sales and Inventory, without UI.
- Technical logs are emitted through backend stdout/stderr and visible with Docker logs.
- Advanced observability, integrations, BI, e-commerce, mobile app and advanced multi-store functionality remain future scope.

---

## v12 - Implementation Checklist summary

`15-implementation-checklist.md` converts the confirmed documentation into a practical verification guide for implementation, QA and AI-assisted development.

Key confirmations:

- Checklist is organized by areas/fases, not only by modules.
- Technical foundation must be stable before functional modules.
- Security/Auth/RBAC checklist validates username login, active users, roles, permissions and backend permission checks.
- Module checklist covers all real MVP modules and confirmed restrictions.
- Workflow checklist covers critical end-to-end flows and transactional requirements.
- Validation/API/Frontend checklist reinforces contracts from documents 08, 09 and 10.
- Audit/Logs/MVP completion checklist confirms audit scope, technical logs, MVP exclusions and final acceptance criteria.

Current pending derived AI documents:

```text
None. AI documentation package completed in v13.
```

---

## v13 - AI Documentation summary

This iteration adds the derived AI documentation package:

```text
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```

Key purpose:

- `AI_CONTEXT.md` gives a compact but complete project context for AI-assisted development.
- `AI_DEVELOPMENT_GUIDE.md` defines how an AI/developer must work without violating confirmed decisions.
- `AI_TASK_PROMPTS.md` provides reusable prompts for implementation, review, testing and documentation alignment.

Important constraints reinforced:

- Accounting remains outside the MVP.
- Cash is operational and included in the MVP.
- Sales and Cash remain separate but integrated modules.
- Products is the master catalog.
- Purchases does not create products or variants in the MVP.
- Audit Log is limited initially to Sales and Inventory and has no UI.
- Technical logs use backend stdout/stderr and are visible through Docker logs.
- API errors use `status_code`, `code`, `message`, `details`.
- Validation, API, frontend, audit/log and MVP checklist rules must guide AI-assisted development.

Current next step:

```text
Use the final complete ZIP as the documentation baseline for implementation.
```

---

## v14 - Final complete package summary

This final package consolidates the base documentation and all incremental updates through v13.

Included scope:

- Main documentation from `00` through `15`.
- Derived AI documentation package.
- Updated README, CODE_ALIGNMENT and DECISION_LOG.

This ZIP should be treated as the current complete documentation baseline for Automata / Calzado Norita.


---

## v15 Consistency Corrections

This package includes a consistency correction pass focused on preventing AI-assisted implementation from following obsolete or contradictory instructions.

Corrected areas:

- `03-use-cases.md` aligned with confirmed MVP scope, purchase states, configurable layaway terms, customer balance/override rules, and no internal transfers in MVP.
- `08-api-contracts.md` corrected customer balance movement enum example from invalid `credit_adjustment` to valid `adjustment_in`.
- `06-auth-rbac.md` added `suppliers.credits.apply` for applying supplier credits.
- `09-frontend-routes.md` updated AI documentation status.
- `CODE_ALIGNMENT.md` removed obsolete open question about categories.
- `AI_DEVELOPMENT_GUIDE.md` updated document precedence to avoid reintroducing obsolete use cases.
