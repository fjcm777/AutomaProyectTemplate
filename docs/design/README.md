# Automata / Calzado Norita - Indice de documentacion

**Version:** documentacion recuperada, corregida y ajustada v5  
**Fecha:** 2026-07-05  
**Estado:** base documental valida hasta `09-frontend-routes.md`  
**Siguiente documento pendiente:** documentos AI en fase posterior (`AI_CONTEXT.md`, `AI_DEVELOPMENT_GUIDE.md`, `AI_TASK_PROMPTS.md`)

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
```

Antes de implementar una funcionalidad, revisar:

1. `01-business-rules.md`
2. `02-process-flows.md`
3. `03-use-cases.md`
4. `05-database.md`
5. `07-modules.md`
6. `08-api-contracts.md`
7. `09-frontend-routes.md`
8. `CODE_ALIGNMENT.md`

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

---

## 6. Matriz rapida de implementacion

| Caso de uso | Modulo | Endpoint | Permiso | Tablas principales | Eventos |
|---|---|---|---|---|---|
| Crear venta | sales | `POST /api/v1/sales` | `sales.create` | sales, sale_items, sale_payments, inventory_stock, inventory_movements, cash_movements | `sale.created` |
| Venta con saldo a favor | sales/customers | `POST /api/v1/sales` | `sales.create` | sales, sale_payments, customer_credit_applications, customer_balance_movements | `sale.created`, `customer_credit.used` |
| Anular venta | sales | `POST /api/v1/sales/<built-in function id>/void` | `sales.void` | sales, inventory_movements, cash_movements, customer_credit_applications | `sale.voided` |
| Devolucion venta | sales | `POST /api/v1/sales/<built-in function id>/return` | `sales.return` | sale_returns, sale_return_items, inventory_movements, cash_movements | `sale.returned` |
| Crear apartado | layaways | `POST /api/v1/layaways` | `layaways.create` | layaways, layaway_items, layaway_payments, inventory_movements | `layaway.created` |
| Completar apartado | layaways/sales | `POST /api/v1/layaways/<built-in function id>/complete` | `layaways.payment` | layaways, sales, sale_items, inventory_movements | `layaway.completed`, `sale.created` |
| Reembolsar saldo cliente | customers/cash | `POST /api/v1/customers/<built-in function id>/credit-refund` | `customers.balance_refund` | customer_balance_movements, customer_credit_applications, cash_movements | `customer_credit.refunded` |
| Crear prestamo | inventory | `POST /api/v1/inventory/loans` | `inventory.loan` | inventory_loans, inventory_stock, inventory_movements | `inventory.loaned` |
| Retornar prestamo | inventory | `POST /api/v1/inventory/loans/<built-in function id>/return` | `inventory.return_loan` | inventory_loans, inventory_stock, inventory_movements | `inventory.loan_returned` |
| Recibir compra | purchases/inventory | `POST /api/v1/purchases/<built-in function id>/receive` | `purchases.create` | purchases, purchase_items, inventory_stock, inventory_movements | `purchase.received` |
| Resolver retorno proveedor | suppliers/inventory | `POST /api/v1/suppliers/returns/<built-in function id>/resolve` | `supplier_returns.resolve` | supplier_returns, supplier_credits, inventory_movements | `supplier_return.resolved` |

---

## 7. Siguiente paso

Despues de aprobar `09-frontend-routes.md`, continuar con la fase posterior de documentos AI:

```text
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```
