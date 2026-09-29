# 15 - Implementation Checklist

**Proyecto:** Automata / Calzado Norita  
**Documento:** Implementation Checklist  
**Estado:** Confirmed  
**Relacionado con:** `04-architecture.md`, `05-database.md`, `06-auth-rbac.md`, `07-modules.md`, `08-api-contracts.md`, `09-frontend-routes.md`, `10-validation-rules.md`, `11-error-handling.md`, `12-audit-log.md`, `13-development-roadmap.md`, `14-mvp-scope.md`

---

## 1. Purpose

This document provides a practical checklist to guide implementation, review and validation of the MVP for Automata / Calzado Norita.

It converts the confirmed documentation into an actionable list for human developers and AI-assisted development.

The checklist must be used to verify that implementation respects:

- confirmed business rules;
- modular monolith architecture;
- MVP scope;
- development roadmap;
- validation rules;
- API contracts;
- frontend routes;
- audit/logging decisions;
- exclusions and future scope.

This document does not replace the source documents. When a detail is needed, the related document remains the source of truth.

---

## 2. General implementation rules

The implementation must follow these global rules.

| Check | Requirement |
|---|---|
| Modular monolith | Implement the system as a modular monolith, not microservices. |
| MVP discipline | Do not implement features outside `14-mvp-scope.md`. |
| Roadmap order | Respect the implementation order in `13-development-roadmap.md`. |
| Backend authority | Backend is the definitive authority for permissions, validations, state, money, inventory and audit. |
| Frontend UX | Frontend validates and hides actions for UX, but never replaces backend validation. |
| Transactions | Critical multi-module operations must be atomic/transactional. |
| Products catalog | Products is the master catalog for products and variants. |
| Purchases restriction | Purchases must not create products or variants in the MVP. |
| Sales/Cash separation | Sales and Cash are separate but integrated modules. |
| Accounting exclusion | Accounting is outside the MVP and must not be implemented now. |
| Audit scope | Audit Log is limited initially to sensitive Sales and Inventory actions. |
| Audit UI | No Audit Log UI in the MVP. |
| Technical logs | Backend logs go to stdout/stderr and are visible through Docker logs. |
| External integrations | No required external integrations in the MVP. |
| Images | Store image path/URL, not binary data in PostgreSQL. |
| Numeric values | Monetary values must use numeric/decimal types, not float. |

---

## 3. Technical foundation checklist

Before implementing functional modules, the technical foundation must be stable.

| Area | Verification |
|---|---|
| Project structure | Project structure follows the confirmed modular monolith approach. |
| Backend | FastAPI starts correctly. |
| Frontend | React + TypeScript starts correctly. |
| Database | PostgreSQL 16 is configured. |
| Docker | Docker Compose starts `api`, `frontend` and `db`. |
| Volumes | PostgreSQL uses a persistent development volume. |
| ORM | SQLAlchemy 2.x async is configured. |
| Migrations | Alembic async works correctly. |
| Seeds | Base data is loaded through Alembic migrations. |
| Environment | Environment variables are configured. |
| Health check | A functional health check endpoint exists. |
| API prefix | Endpoints are organized under `/api`. |
| Error format | Backend errors follow `status_code`, `code`, `message`, `details`. |
| Validation base | Validation follows `10-validation-rules.md`. |
| Technical logs | Backend emits logs through stdout/stderr visible with Docker logs. |
| Trace ID | Critical/internal/transactional errors use `trace_id`. |
| Images | Images store path/URL, not binary data in DB. |
| Numeric types | Monetary fields use numeric/decimal, not float. |
| Accounting | Accounting is not implemented in the MVP. |
| External integrations | No mandatory external integrations are implemented in the MVP. |
| Module enforcement | `import-linter` and its pre-commit hook are configured with the contracts from `16-enforcement.md` before the first business module is implemented. |

Minimum Docker log visibility expected for the MVP:

```bash
docker compose logs api
docker compose logs -f api
```

---

## 4. Security / Auth / RBAC checklist

| Area | Verification |
|---|---|
| Login | User can log in with `username` and `password`. |
| Email login | Email is not used as the main login credential. |
| Invalid credentials | Invalid credentials show: `Usuario o contraseña incorrectos.` |
| Inactive users | Inactive users cannot log in. |
| Password hashing | Passwords are stored with secure hashing, never plain text. |
| Token auth | Backend issues authentication token according to the API contract. |
| Protected routes | Internal frontend routes require authentication. |
| Public routes | `/login` is public. |
| Auth redirect | Authenticated users visiting `/login` are redirected to `/dashboard`. |
| Session expired | Expired sessions redirect or show `/session-expired`. |
| Users | Users can be created, edited, activated and deactivated. |
| Required user fields | `username`, `first_name`, `last_name` and at least one valid role are required. |
| Username uniqueness | `username` is unique. |
| Optional email | Email is optional and used as contact information only. |
| Roles | Roles can be created, edited and consulted. |
| Permissions | Permissions are assigned through roles. |
| Backend permission validation | Backend validates permissions for protected actions even if frontend hides them. |
| Route permission message | Use `No tiene acceso a esta sección.` for section access denial. |
| Action permission message | Use `No tiene permiso para realizar esta acción.` for action denial. |
| Admin routes | `/admin/*` routes are protected by permissions. |
| Sensitive actions | Sensitive actions require specific permissions. |
| RBAC seeds | Base roles and permissions are seeded through Alembic. |
| Audit scope | Audit Log initially applies only to Sales and Inventory when applicable. |
| Accounting permissions | Do not create MVP operational permissions for Accounting. |

---

## 5. Module implementation checklist

Each real MVP module must be implemented with its minimum operations, critical validations and confirmed restrictions.

### 5.1 Modules covered

| Module | MVP implementation expectation |
|---|---|
| Auth / Users | Login with username, user management and active/inactive users. |
| Roles / Permissions | Dynamic roles, role-based permissions and backend validation. |
| Admin / Catalogs | Base catalogs manageable and protected against normalized duplicates. |
| Admin / Settings | Basic business, sales, layaway, cash, report and security settings. |
| Products | Product and variant master catalog. |
| Customers | Customer management with required fields and controlled balance. |
| Suppliers | Supplier management with active/inactive status and history protection. |
| Inventory | Stock, movements, adjustments, damaged goods and loaned goods. |
| Cash | Opening, manual movements, closing, differences and business date. |
| Sales | Create, confirm, void, return and receipt. |
| Layaways | Create, pay, complete and cancel. |
| Purchases | Create, receive, cancel and register supplier payment. |
| Reports | Basic operational reports by area. |
| Audit Log | Persistent functional audit limited initially to Sales and Inventory. |

### 5.2 Products

| Check |
|---|
| Allows product creation. |
| Allows product editing. |
| Allows product consultation. |
| Allows product deactivation. |
| Allows variant management. |
| Validates unique product code. |
| Validates category, brand, gender, size and color when applicable. |
| Validates sale price. |
| Does not store image binary in DB. |
| Handles sale price below cost only with authorization. |

### 5.3 Customers

| Check |
|---|
| Allows customer creation, editing, consultation and deactivation. |
| Validates required fields: first name, last name, phone, address and foot size. |
| Validates optional email only when provided. |
| Does not allow direct editing of customer balance. |
| Allows only active customers in new operations. |
| Soft-delete fields are system-managed, not manually edited. |

### 5.4 Suppliers

| Check |
|---|
| Allows supplier creation, editing, consultation and deactivation. |
| Validates required supplier name and phone. |
| Validates optional email only when provided. |
| Prevents physical deletion when supplier has history. |
| Allows only active suppliers in new purchases and supplier returns. |

### 5.5 Inventory

| Check |
|---|
| Controls available stock. |
| Controls reserved stock. |
| Registers inventory movements. |
| Allows manual adjustments with reason. |
| Controls damaged goods. |
| Controls loaned goods. |
| Prevents negative inventory. |
| Validates stock in critical operations. |
| Registers initial functional audit when applicable. |

### 5.6 Cash

| Check |
|---|
| Allows cash opening. |
| Prevents more than one open cash session when applicable. |
| Registers manual cash movements. |
| Receives movements generated by sales, returns and voids. |
| Allows cash closing. |
| Calculates expected amount. |
| Calculates cash difference. |
| Requires reason when there is a cash difference. |
| Prevents operations in closed cash sessions. |

### 5.7 Sales

| Check |
|---|
| Allows sale creation. |
| Validates open cash session. |
| Validates active products. |
| Validates available stock. |
| Registers payment. |
| Decreases inventory. |
| Generates cash movement. |
| Allows sale void. |
| Allows sale return. |
| Generates receipt. |
| Executes critical operations transactionally. |

### 5.8 Layaways

| Check |
|---|
| Allows layaway creation. |
| Validates customer. |
| Reserves inventory. |
| Registers initial payment. |
| Controls pending balance. |
| Controls due date. |
| Allows partial payments. |
| Allows layaway completion. |
| Allows layaway cancellation. |
| Generates customer credit when applicable. |

### 5.9 Purchases

| Check |
|---|
| Allows purchase creation. |
| Requires valid supplier. |
| Allows only existing products and variants. |
| Does not create products from purchase flow. |
| Validates unit cost greater than zero. |
| Allows purchase receiving. |
| Increases inventory on receiving. |
| Registers historical cost. |
| Allows cancellation of non-received purchase. |
| Allows supplier payment registration. |

### 5.10 Reports

| Check |
|---|
| Includes basic sales reports. |
| Includes basic inventory reports. |
| Includes basic cash reports. |
| Includes basic layaway reports. |
| Includes basic purchase reports. |
| Includes basic customer reports. |
| Includes basic supplier reports. |
| Validates date ranges. |
| Blocks excessively large ranges based on configuration. |
| Supports USD reports using official exchange rate. |
| Does not implement BI or advanced analytics in the MVP. |

### 5.11 Audit Log

| Check |
|---|
| Stores functional audit in persistent table. |
| Applies initially only to Sales and Inventory. |
| Registers `success`, `failed` and `blocked` when applicable. |
| Stores summarized `before_data` and `after_data`. |
| Uses `reason` for sensitive/corrective actions. |
| Has no user interface in the MVP. |
| Has no automatic deletion in the MVP. |

---

## 6. Critical workflow checklist

Critical workflows must be implemented end-to-end, including validation, permissions, state changes, inventory/cash impact, audit when applicable, structured errors and transactions.

| Workflow | Verification |
|---|---|
| Sale confirmation | Validates open cash, active products, available stock and valid payment; decreases inventory and generates cash movement. |
| Sale void | Allows void only for valid sales, within allowed business date, with reason, permission, inventory reversal, cash impact and audit. |
| Sale return | Returns valid products, controls returned quantities, reintegrates inventory, registers cash refund and audit. |
| Cash opening | Opens cash with valid initial amount and authorized user. |
| Cash movement | Registers manual income/expense with amount, type, reason and open cash. |
| Cash closing | Calculates expected amount, validates counted amount, registers difference and requires reason when difference exists. |
| Layaway creation | Validates customer, products, stock, initial payment, reservation and due date. |
| Layaway payment | Registers partial payments with open cash, valid payment method and pending balance control. |
| Layaway completion | Validates zero pending balance, reserved products and generates/relates sale. |
| Layaway cancellation | Releases reserved inventory and registers customer credit when applicable. |
| Purchase receiving | Receives existing products, validates quantities, increases inventory and registers historical cost. |
| Supplier return | Validates supplier, products, available quantities, inventory output and resolution. |
| Damaged goods | Registers write-off with reason, valid quantity and inventory output. |
| Loaned goods | Registers loan, responsible person, quantity, return or conversion to sale. |
| Inventory adjustment | Allows adjustment with reason, valid quantity, permission and no negative inventory. |
| Audit log event | Registers functional audit when workflow belongs to Sales or Inventory and applies to the confirmed scope. |

### 6.1 Transactional workflows

| Workflow | Must be transactional |
|---|---:|
| Confirm sale | Yes |
| Void sale | Yes |
| Register sale return | Yes |
| Create layaway | Yes |
| Register layaway payment | Yes |
| Complete layaway | Yes |
| Cancel layaway | Yes |
| Receive purchase | Yes |
| Supplier return | Yes |
| Damaged goods write-off | Yes |
| Convert loaned goods to sale | Yes |
| Close cash | Yes |

If any part of a transactional workflow fails, the full operation must be rolled back.

---

## 7. Validation checklist

| Area | Verification |
|---|---|
| Frontend validation | Frontend validates required fields, formats and simple rules for UX. |
| Backend validation | Backend always validates critical rules, even if frontend validates first. |
| Severity | Rules are documented as `blocking`, `warning` or `informational`. |
| Required fields | Required fields are validated in frontend and backend. |
| Money | Amounts are valid, positive when applicable and have correct precision. |
| Quantity | Quantities are greater than zero and do not exceed available stock. |
| Dates | Dates are valid, ranges are correct and business date is respected. |
| Status transitions | Only valid status transitions are allowed. |
| Permissions | Backend validates permissions before protected actions. |
| Cross-module rules | Critical multi-module operations are atomic. |
| Error messages | User-visible messages are in Spanish, clear and actionable. |

---

## 8. API checklist

| Area | Verification |
|---|---|
| API prefix | Endpoints use `/api`. |
| Response format | Responses follow the defined contract. |
| Error format | Errors use `status_code`, `code`, `message`, `details`. |
| HTTP status | HTTP status matches body `status_code`. |
| Validation errors | Multiple validations use `details.errors`. |
| Warnings | Non-blocking warnings use `warnings` in successful responses. |
| Error codes | Functional codes use domain prefixes such as `validation.*`, `auth.*`, `business.*`. |
| Internal errors | Unexpected errors use `system.internal_error`. |
| Transaction failures | Transaction failures use `business.transaction_failed`. |
| Trace ID | Critical/transactional/internal errors include `trace_id`. |
| Sensitive details | Production does not expose SQL, stack traces, tokens or sensitive data. |
| Development detail | Development may expose controlled technical detail for debugging. |

---

## 9. Frontend checklist

| Area | Verification |
|---|---|
| Router | React Router v6 is configured. |
| Layouts | `PublicLayout` is used for `/login`; `AppLayout` is used for internal routes. |
| Auth guard | `RequireAuth` protects internal routes. |
| Root redirect | `/` redirects to `/dashboard` or `/login` based on authentication. |
| Login route | `/login` is public. |
| Dashboard | `/dashboard` is protected. |
| Admin prefix | Admin routes live under `/admin`. |
| CRUD routes | Create uses `/create`; edit uses `/:id/edit`. |
| Actions | Complex actions use dedicated routes when confirmed. |
| Simple actions | Simple actions use buttons, modals or internal forms. |
| Forbidden | `/forbidden` exists. |
| Session expired | `/session-expired` exists. |
| Not found | `/not-found` and fallback `*` exist. |
| API client | Frontend consumes API through shared client. |
| Form errors | Forms display field-level errors from `details.errors` when available. |
| Warnings | Frontend can display `warnings` without treating them as blocking errors. |
| RBAC UI | Frontend may hide forbidden actions, but backend remains definitive. |

---

## 10. Audit / Logs checklist

### 10.1 Audit Log

| Area | Verification |
|---|---|
| Audit persistence | `audit_logs` exists as a persistent PostgreSQL table. |
| Audit scope | Audit Log initially applies only to Sales and Inventory. |
| No Audit UI | No user interface exists for Audit Log in the MVP. |
| No auto-delete | No automatic deletion of Audit Log exists in the MVP. |
| Operation result | `operation_result` uses `success`, `failed`, `blocked`. |
| Reason | `reason` represents the functional reason for the action. |
| Required reason | `reason` is required for sensitive/corrective actions. |
| Before / after data | `before_data` and `after_data` store summarized relevant data. |
| Metadata | `metadata` stores additional context. |
| Sales audit | Sensitive Sales actions register audit when applicable. |
| Inventory audit | Sensitive Inventory actions register audit when applicable. |
| Technical logs separation | Audit Log is not mixed with technical logs. |

### 10.2 Technical Logs

| Area | Verification |
|---|---|
| Backend logs | Backend emits technical logs through stdout/stderr. |
| Docker visibility | Logs are visible through `docker logs` or `docker compose logs api`. |
| No log UI | No technical log UI exists in the system. |
| No monitoring platform | No advanced monitoring platform is implemented in the MVP. |
| Trace ID | Critical/transactional errors register `trace_id`. |
| Sensitive data | Logs do not register passwords, tokens or sensitive data. |
| Production safety | Production does not expose stack traces to users. |
| Future scope | Centralization, alerts, retention and dashboards are future scope. |

---

## 11. MVP completion checklist

The MVP must not be considered complete until these checks are satisfied.

| Area | Verification |
|---|---|
| Roadmap alignment | Implementation respects `13-development-roadmap.md`. |
| MVP scope alignment | Implementation respects `14-mvp-scope.md`. |
| Modules complete | Real MVP modules have minimum functional operations. |
| Workflows complete | Critical workflows are implemented end-to-end. |
| Validation complete | Critical rules are validated in backend. |
| API contract complete | API contracts and structured errors are respected. |
| Frontend routes complete | Main frontend routes are implemented and protected. |
| RBAC complete | Backend permissions are active for protected actions. |
| Transactions complete | Critical multi-module operations are atomic. |
| Reports basic complete | Basic operational reports are available. |
| Accounting excluded | Accounting was not implemented in the MVP. |
| Audit UI excluded | Audit Log UI was not implemented in the MVP. |
| External integrations excluded | Mandatory external integrations were not implemented. |
| Documentation aligned | Documentation was updated after relevant changes. |
| AI docs pending | AI documents are prepared after closing main documentation. |

The MVP is complete only when it can operate sales, inventory, cash, layaways, purchases, customers, suppliers, basic reports and minimum traceability with authentication, permissions, validations, structured errors, basic technical logs and aligned documentation.

---

## 12. Do-not-implement checklist for MVP

Do not implement the following as part of the MVP unless scope is explicitly changed later.

| Item | Status |
|---|---|
| Accounting module | Future stage |
| Chart of accounts | Future stage |
| Journal entries | Future stage |
| Bank reconciliation | Future stage |
| Advanced analytics / BI | Future stage |
| E-commerce | Outside MVP |
| Native mobile app | Outside MVP |
| External integrations | Future stage |
| Audit Log UI | Outside MVP |
| Technical logs UI | Outside MVP |
| Monitoring dashboard | Future stage |
| Automatic alerts | Future stage |
| Centralized observability | Future stage |
| Advanced multi-store operations | Future stage |
| Product/variant creation from Purchases | Not allowed in MVP |
| Microservices | Not allowed in MVP |

---

## 13. Related documents

| Document | Use |
|---|---|
| `04-architecture.md` | Architecture, transactions, modules and technical constraints. |
| `05-database.md` | Tables, columns, audit table and data model. |
| `06-auth-rbac.md` | Authentication, users, roles and permissions. |
| `07-modules.md` | Module responsibilities and boundaries. |
| `08-api-contracts.md` | API endpoints, response format and error contracts. |
| `09-frontend-routes.md` | Frontend routes, layouts and route protection. |
| `10-validation-rules.md` | Validation rules, messages and API alignment. |
| `11-error-handling.md` | Error handling, trace_id and technical logs. |
| `12-audit-log.md` | Functional audit log scope and structure. |
| `13-development-roadmap.md` | Implementation order and dependencies. |
| `14-mvp-scope.md` | MVP inclusion/exclusion and completion criteria. |

