# 14 - MVP Scope

## 1. Purpose

This document defines the confirmed scope of the first operational version of Automata / Calzado Norita.

The MVP scope is different from the development roadmap:

| Document | Main question |
|---|---|
| `13-development-roadmap.md` | In what order should the system be built? |
| `14-mvp-scope.md` | What is included in the first version and what is excluded? |

The purpose of this document is to prevent uncontrolled scope growth during development, especially when the system is implemented with AI-assisted development tools.

```text
The MVP must define what should be built now, what should not be built yet,
and what decisions must not be reinterpreted by developers or AI tools.
```

---

## 2. MVP objective

The MVP must allow the store to operate its core retail processes in a controlled way.

The first version must support:

- user access and permissions;
- base catalogs and settings;
- product and variant management;
- customer and supplier management;
- inventory control;
- cash operation;
- sales;
- layaways;
- purchases;
- supplier returns and operational exception flows;
- basic operational reports;
- limited functional audit log;
- structured API errors;
- basic technical logs;
- aligned documentation for future development.

General rule:

```text
The MVP must focus on the minimum operational system required to run the store:
products, inventory, sales, cash, customers, suppliers, layaways, purchases,
basic reports and minimum traceability.

The MVP must not implement advanced or future modules that could delay the first
usable operational version.
```

---

## 3. Included modules

This section lists real modules agreed in the documentation.

It must not mix modules with workflows. Operational flows such as sale voids, sale returns, cash closing, damaged goods, loaned goods, purchase receiving or supplier returns are documented in the next section as workflows inside their corresponding modules.

| Module | MVP scope |
|---|---|
| Auth / Users | Included |
| Roles / Permissions | Included |
| Admin / Catalogs | Included |
| Admin / Settings | Included |
| Products | Included |
| Customers | Included |
| Suppliers | Included |
| Inventory | Included |
| Cash | Included |
| Sales | Included |
| Layaways | Included |
| Purchases | Included |
| Reports | Included with basic operational reports |
| Audit Log | Included with limited scope for Sales and Inventory |

Confirmed rule:

```text
Included modules must list only real agreed modules.
Included workflows must list functional processes inside those modules.
```

---

## 4. Included workflows

The MVP must include the operational workflows required to sell, control stock, manage cash, handle layaways, register purchases and keep minimum traceability.

| Module | Included workflows |
|---|---|
| Auth / Users | Login, user management, activate/deactivate users |
| Roles / Permissions | Role management and permission assignment |
| Admin / Catalogs | Categories, brands, sizes, colors, payment methods and base catalogs |
| Admin / Settings | Basic business, sales, layaway, cash, report and security settings |
| Products | Create, edit, view and deactivate products and variants |
| Customers | Create, edit, view and deactivate customers |
| Suppliers | Create, edit, view and deactivate suppliers |
| Inventory | Stock, movements, adjustments, damaged goods and loaned goods |
| Cash | Cash opening, manual movements, cash closing and differences |
| Sales | Create sale, confirm sale, void sale, register return and issue receipt |
| Layaways | Create layaway, register payment, complete layaway and cancel layaway |
| Purchases | Create purchase, receive purchase, cancel purchase and register supplier payment |
| Reports | Basic sales, inventory, layaway, cash, purchase, customer and supplier reports |
| Audit Log | Internal audit registration for sensitive Sales and Inventory actions |

Specific workflows included in the MVP:

- Sale Voids / Anulación de venta;
- Sale Returns / Devolución de venta;
- Cash Opening / Apertura de caja;
- Cash Closing / Cierre de caja;
- Cash Difference / Diferencia de caja;
- Inventory Adjustments / Ajustes de inventario;
- Damaged Goods / Productos dañados;
- Loaned Goods / Productos prestados;
- Layaway Payments / Pagos de apartado;
- Layaway Cancellation / Cancelación de apartado;
- Purchase Receiving / Recepción de compra;
- Supplier Returns / Retornos a proveedor.

Confirmed rule:

```text
The MVP must include the operational workflows needed for the store to sell,
control inventory, manage cash, register layaways, process purchases, handle
voids/returns and maintain minimum traceability.

These workflows must be documented inside their corresponding modules and must
not necessarily be treated as independent modules.
```

---

## 5. Module and workflow clarifications

### 5.1 Sales and Cash

Sales and Cash are separate modules, but they depend on each other operationally.

| Module | Responsibility |
|---|---|
| Sales | Commercial sale operation: products sold, customer, totals, status, voids, returns and receipt. |
| Cash | Money control: open cash session, payments, cash movements, closing and differences. |

Confirmed rule:

```text
Sales and Cash must remain separate modules.

Sales records the commercial sale operation.
Cash records and controls the monetary movements derived from sales, returns,
voids and manual cash operations.

Sales depends on an open cash session to confirm sales.
Cash depends on Sales to consolidate income and calculate closing amounts,
but cash closing belongs exclusively to the Cash module.
```

Cash is operational and included in the MVP. Cash is not Accounting.

### 5.2 Products and Purchases

Products is the master catalog.

Purchases records supplier purchases, receiving inventory, supplier payments and historical cost.

Confirmed rule:

```text
Purchases does not create products or variants in the MVP.

Before registering or completing a purchase, the product and variant must already
exist in the Products master catalog.
```

If a product or variant does not exist during purchase registration, the user must create it first in Products and then continue the purchase process.

### 5.3 Audit Log and Technical Logs

Audit Log and technical logs are different concepts.

| Concept | Purpose | MVP location / visibility |
|---|---|---|
| Audit Log | Functional traceability of sensitive user actions | `audit_logs` table in PostgreSQL; technical/admin DB query only; no UI in MVP |
| Technical Logs | Diagnosis of errors, exceptions and backend failures | backend stdout/stderr; visible through Docker logs / Docker Compose logs |

---

## 6. Excluded / future scope

The following functionality is outside the MVP and must not be implemented during the first operational version unless explicitly re-scoped later.

| Area | Status | Reason |
|---|---|---|
| Accounting / Contabilidad | Future / second stage | Requires chart of accounts, journal entries, accounting periods and formal accounting logic |
| Advanced analytics | Future | Not required for first operation |
| Advanced multi-store operations | Future | System may be prepared for future multi-store use, but complex multi-branch workflows are not MVP |
| External integrations | Future | Banking, electronic invoicing, WhatsApp automation and external APIs are not initial requirements |
| Audit Log UI | Outside MVP | Audit is stored in DB but has no user interface initially |
| Advanced reporting | Future | BI, advanced financial reports and accounting reports are outside MVP |
| E-commerce | Outside MVP | Online store, shopping cart and online payments are not included |
| Mobile app | Outside MVP | No native mobile app in the first version |
| Payroll / HR | Outside MVP | Payroll and HR are outside project scope |
| Advanced inventory planning | Future | Reorder point, forecasting and automatic suggested purchases are future improvements |
| Advanced logging/observability | Future | Centralized logs, monitoring dashboards, alerts, formal retention and external observability services are not MVP |

Confirmed rule:

```text
The MVP must not include advanced functionality, external integrations,
full accounting, advanced analytics, e-commerce, native mobile app,
complex multi-store operations, advanced monitoring or features that are not
indispensable to operate the store in the first version.
```

Important clarifications:

```text
Cash is included in the MVP because it is operational.
Accounting is not included in the MVP because it requires formal accounting logic.
Audit Log is included in the MVP only with limited scope and without UI.
Reports are included in the MVP only as basic operational reports.
Technical logs are included only as basic backend logs visible through Docker logs.
```

---

## 7. MVP constraints

| Area | MVP restriction |
|---|---|
| Architecture | Modular monolith, not microservices |
| Database | PostgreSQL 16 |
| Backend | FastAPI |
| Frontend | React + TypeScript |
| Accounting | Not included in MVP |
| Multi-store | Prepared for future, but advanced multi-store operation is outside MVP |
| Functional audit | Only Sales and Inventory, without UI |
| Reports | Basic operational reports, not advanced BI |
| Integrations | No mandatory external integrations |
| Images | Store path/URL, not binary data in database |
| Products | Products is the master catalog |
| Purchases | Purchases does not create products or variants |
| Cash | Operational cash included, but not formal accounting |
| Technical logs | Backend stdout/stderr, visible through Docker logs; no advanced monitoring |
| Security | Basic dynamic RBAC included |
| Seeds | Base data through Alembic migrations/seeds |
| Currency | Córdoba as main currency; USD only for reports with official exchange rate |

Confirmed rule:

```text
The MVP must keep a controlled operational scope.

It must avoid microservices, full accounting, external integrations,
advanced analytics, audit UI, complex financial reports, advanced log monitoring
and non-essential functionality for the first operational version.
```

---

## 8. Technical logs in MVP

Technical logs are included in the MVP with a basic operational scope.

The backend must emit logs through:

```text
stdout / stderr of the API container
```

They are visible through Docker / Docker Compose commands, for example:

```bash
docker logs <api_container_name>
docker compose logs api
docker compose logs -f api
```

Technical logs must include relevant internal information for support and diagnosis, such as:

- internal errors;
- unhandled exceptions;
- transaction failures;
- database connection failures;
- critical request failures;
- generated `trace_id` for critical/internal/transactional errors.

Technical logs must not include:

- passwords;
- JWT tokens;
- secret keys;
- sensitive personal data;
- unnecessary raw SQL details in production;
- stack traces visible to the end user.

Confirmed rule:

```text
In the MVP, backend technical logs are emitted through stdout/stderr and are visible
through Docker logs or Docker Compose logs.

There is no system UI for technical logs in the MVP.
There is no monitoring dashboard, centralized logging or advanced observability in the MVP.

Centralization, formal retention, alerts, monitoring and external log storage remain
future scope.
```

---

## 9. Acceptance criteria

The MVP is considered complete when it enables the main store processes to operate in a controlled way.

| Area | Completion criterion |
|---|---|
| Technical foundation | Backend, frontend and database run with Docker |
| Database | Alembic migrations are applied and base data is loaded |
| Auth / RBAC | Login, users, roles and basic permissions are operational |
| Catalogs | Base catalogs are configured |
| Products | Products and variants can be managed |
| Customers | Customers can be managed |
| Suppliers | Suppliers can be managed |
| Inventory | Stock, movements, adjustments, damaged goods and loaned goods work with validations |
| Cash | Cash can be opened, receive movements, close and calculate differences |
| Sales | Sales, voids, returns and receipts work |
| Layaways | Layaways, payments, completion and cancellation work |
| Purchases | Purchases, receiving, cancellation and supplier payments work |
| Supplier Returns | Supplier returns can be created, sent and resolved |
| Reports | Basic operational reports are available |
| Audit Log | Sensitive Sales and Inventory actions are registered internally |
| Error Handling | API errors follow the standard contract and use `trace_id` when applicable |
| Technical Logs | Backend emits stdout/stderr logs visible with Docker logs |
| Validation | Critical rules are validated in backend and frontend when applicable |
| Documentation | Main documentation is aligned |
| AI readiness | AI-derived documents are prepared after the main documentation is complete |

Confirmed rule:

```text
The MVP is complete when it allows operation of sales, inventory, cash,
layaways, purchases, customers, suppliers, basic reports and minimum traceability,
with authentication, permissions, validations, structured errors, basic technical logs
and aligned documentation.

Future functionality such as accounting, advanced BI, external integrations,
e-commerce, mobile app, advanced monitoring or audit log UI is not required
for MVP completion.
```

---

## 10. Related documents

| Document | Relationship |
|---|---|
| `04-architecture.md` | Technical architecture and MVP architectural constraints |
| `05-database.md` | Database structure supporting MVP modules |
| `07-modules.md` | Source of truth for real module responsibilities |
| `08-api-contracts.md` | API behavior required by MVP workflows |
| `09-frontend-routes.md` | Frontend route scope for MVP modules and workflows |
| `10-validation-rules.md` | Validation rules required for MVP operations |
| `11-error-handling.md` | Error handling, `trace_id` and technical logging behavior |
| `12-audit-log.md` | Functional audit log scope and persistence |
| `13-development-roadmap.md` | Development order for MVP and future scope |
| `15-implementation-checklist.md` | Checklist to validate implementation readiness and MVP completion |

---

## 11. Confirmed decisions summary

| Decision | Status |
|---|---|
| MVP scope is separate from roadmap | `CONFIRMED` |
| Included modules and included workflows must be separated | `CONFIRMED` |
| Real modules are taken from `07-modules.md` | `CONFIRMED` |
| Operational workflows are included inside their modules | `CONFIRMED` |
| Sales and Cash are separate but integrated modules | `CONFIRMED` |
| Cash is included in MVP and Accounting is future scope | `CONFIRMED` |
| Purchases does not create products or variants in MVP | `CONFIRMED` |
| Audit Log is limited to Sales and Inventory and has no UI in MVP | `CONFIRMED` |
| Technical logs use backend stdout/stderr and Docker logs in MVP | `CONFIRMED` |
| Advanced observability and log centralization are future scope | `CONFIRMED` |
| MVP completion criteria are operational, not future-feature complete | `CONFIRMED` |


---

## Complement v12 - Implementation checklist alignment

`15-implementation-checklist.md` validates this MVP scope during implementation.

The MVP should not be considered complete unless the checklist confirms:

- modules included in this document are implemented with their minimum operations;
- workflows included in this document are implemented end-to-end;
- excluded features were not implemented without explicit scope change;
- backend validations, RBAC, API contracts, frontend routes, audit scope and technical logs match the confirmed documentation;
- Accounting, Audit Log UI, Technical Logs UI, BI/advanced analytics, external integrations and product creation from Purchases remain outside the MVP.
