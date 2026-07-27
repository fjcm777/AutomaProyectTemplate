# 13 - Development Roadmap

**Project:** Automata / Calzado Norita  
**Document status:** CONFIRMED  
**Scope:** Development order, dependencies and phase completion criteria  
**Related documents:** `01-business-rules.md`, `04-architecture.md`, `07-modules.md`, `10-validation-rules.md`, `11-error-handling.md`, `12-audit-log.md`

---

## 1. Purpose

This document defines the recommended implementation order for Automata / Calzado Norita.

The roadmap is not organized by screens or documents. It is organized by incremental development phases, respecting functional and technical dependencies between modules.

The goal is to avoid building advanced workflows before the base modules they require exist.

```text
The roadmap must guide development by phases.
Each phase must define its objective, included modules, dependencies, expected deliverables and minimum completion criteria.
```

---

## 2. Roadmap principles

| Principle | Rule |
|---|---|
| Incremental delivery | Build the system in usable phases, not as one large implementation. |
| Dependency first | A module must not be built before the modules it depends on. |
| Backend consistency | Business rules, validation, errors, transactions and audit must be implemented consistently. |
| Operational MVP | The MVP focuses on retail operations, not full accounting. |
| Future-ready | The system must keep enough traceability for future accounting and advanced reporting. |
| Documentation alignment | Each phase must respect the confirmed documentation and decision log. |

---

## 3. Confirmed complete roadmap

| Phase | Name | Main focus |
|---:|---|---|
| 0 | Technical foundation | Backend, DB, Docker, migrations, error handling and validation base |
| 1 | Security and base catalogs | Auth, users, roles, permissions and catalogs |
| 2 | Commercial master data | Products, customers and suppliers |
| 3 | Inventory base | Initial stock, stock records, movements and adjustments |
| 4 | Cash base | Cash sessions, business date and cash movements |
| 5 | Sales base | Sales creation, payments, receipt and base inventory/cash effects |
| 6 | Layaways | Product reservation, initial payment, partial payments and completion |
| 7 | Purchases | Supplier purchases, receiving, historical cost and supplier payments |
| 8 | Operational exception flows | Supplier returns, damaged goods, loaned goods, sale returns and sale voids |
| 9 | Reports | Operational reports by sales, inventory, cash, layaways, purchases, customers and suppliers |
| 10 | Stabilization and AI documentation | Final alignment, tests, checklist and derived AI documents |

---

## 4. Phase 0 - Technical foundation

### Objective

Establish the minimum technical foundation before implementing functional modules.

### Included scope

| Area | Required foundation |
|---|---|
| Backend base | FastAPI running with modular structure |
| Database | PostgreSQL 16 configured |
| Migrations | Alembic async configured and working |
| ORM | SQLAlchemy 2.x async configured |
| Docker | Docker Compose for `api` and `db` |
| Configuration | Environment variables and settings base |
| Health check | `/health` or equivalent endpoint |
| API structure | `/api` prefix and module-oriented organization |
| Error handling | Standard error format from `08-api-contracts.md` and `11-error-handling.md` |
| Validation base | Validation pattern aligned with `10-validation-rules.md` |
| Technical logging | Basic internal logging; final physical log storage remains pending |
| Seeds | Base seed structure through Alembic migrations |
| Code alignment | Folder and service conventions aligned with `CODE_ALIGNMENT.md` |

### Dependencies

None.

### Expected deliverables

```text
Running backend, working database, migrations, health check, base configuration,
standard error handling, validation base and modular structure.
```

### Minimum completion criteria

```text
- API starts correctly in Docker.
- PostgreSQL is available with persistent volume.
- Alembic can create and run migrations.
- SQLAlchemy async is configured.
- Health check responds correctly.
- Modular base structure is defined.
- Standard error format is implemented.
- Configuration through environment variables works.
- Base seeds can be executed through migrations.
```

---

## 5. Phase 1 - Security and base catalogs

### Objective

Implement the minimum security and catalog foundation required by all operational modules.

### Included modules

```text
auth
users
roles
permissions
admin/catalogs base
admin/settings base where needed
```

### Included capabilities

| Capability | Description |
|---|---|
| Login | Username/password authentication. Email is optional/contact, not login credential in MVP. |
| Users | Create, edit, activate/deactivate and assign roles. |
| Roles | Create and manage roles. |
| Permissions | Permission records and role assignment. |
| Route/action protection | Backend validates permissions even if frontend hides UI. |
| Base catalogs | Product categories, brands, sizes, colors, payment methods and inventory movement types. |
| Seeds | Roles, permissions, statuses, base catalogs and initial settings. |

### Dependencies

Phase 0.

### Expected deliverables

```text
Authenticated backend, users, roles, permissions and base catalogs ready for products,
inventory, cash and sales.
```

### Minimum completion criteria

```text
- Login works using username and password.
- Protected endpoints validate authenticated user.
- Permission checks are enforced in backend.
- Base roles and permissions are seeded.
- Base catalogs exist and prevent normalized duplicates.
- Payment methods needed by sales/cash exist.
- Inventory movement types needed by inventory exist.
```

---

## 6. Phase 2 - Commercial master data

### Objective

Implement the commercial records needed before inventory, sales, layaways and purchases.

### Included modules

```text
products
customers
suppliers
```

### Included capabilities

| Module | Capabilities |
|---|---|
| Products | Product catalog, variants, product code, category, brand, gender, size, color, sale price and image metadata. |
| Customers | Customer profile, phone, address, foot size, optional email/identification/photo and active status. |
| Suppliers | Supplier profile, phone, optional email/address/contact/notes and active status. |

### Dependencies

Phase 1.

### Expected deliverables

```text
Products, variants, customers and suppliers can be created and maintained before
operational inventory, sales and purchases are implemented.
```

### Minimum completion criteria

```text
- Products can be created with required commercial data.
- Product code is unique.
- Variants can be represented with size/color and valid catalogs.
- Customers can be created with required fields.
- Suppliers can be created with required fields.
- Inactive customers/suppliers/products cannot be used in new operations.
```

---

## 7. Phase 3 - Inventory base

### Objective

Create the base inventory model before sales and operational stock-consuming workflows.

### Included modules

```text
inventory
inventory stock
inventory movements
inventory adjustments base
```

### Included capabilities

| Capability | Description |
|---|---|
| Stock records | Track stock by product/variant/location when applicable. |
| Available quantity | Prevent negative stock and calculate availability according to confirmed DB design. |
| Inventory movements | Register entries, exits and adjustments with traceability. |
| Initial stock | Allow initial inventory setup. |
| Adjustments base | Allow controlled corrections with reason and permissions when applicable. |

### Dependencies

Phase 2.

### Expected deliverables

```text
Inventory can represent stock and movements for existing products and variants.
```

### Minimum completion criteria

```text
- Stock can be created for existing product variants.
- Movements are traceable and linked to source when applicable.
- Adjustments cannot leave stock negative.
- Quantity validations are implemented in backend.
- Inventory base is ready for cash/sales dependency chain.
```

---

## 8. Phase 4 - Cash base

### Objective

Implement operational cash before full sales.

Cash is part of the MVP. It is not the same as Accounting.

```text
Cash / Caja is an operational module.
Accounting / Contabilidad remains outside the MVP and belongs to a future stage.
```

### Included modules

```text
cash
cash sessions
cash movements
business date
```

### Included capabilities

| Capability | Description |
|---|---|
| Open cash | Start a cash session with opening amount and business date. |
| Current cash | Query current open session. |
| Cash movements | Register manual inflows/outflows with reason. |
| Close cash | Count cash, calculate differences and close session. |
| Business date | Assign operations to the correct operational day. |

### Dependencies

Phase 1 and Phase 3.

### Expected deliverables

```text
Cash base is available before sales, so sales can validate open cash,
register payments and associate operations with the correct business date.
```

### Minimum completion criteria

```text
- A cash session can be opened.
- Only one incompatible open cash session is allowed according to business rules.
- Cash movements can be registered with reason when required.
- Cash can be closed with counted amount and difference handling.
- Closed cash does not accept new movements.
```

---

## 9. Phase 5 - Sales base

### Objective

Implement the base sales workflow after products, customers, inventory and cash exist.

### Included modules

```text
sales
sale items
sale payments
receipt base
inventory effect
cash effect
```

### Included capabilities

| Capability | Description |
|---|---|
| Create sale | Register a sale with customer when required, items and payment. |
| Confirm sale | Validate stock, prices, open cash and payment. |
| Inventory effect | Decrease stock atomically. |
| Cash effect | Register sale payment as cash movement when applicable. |
| Receipt | Provide receipt data/printable representation. |
| Mixed payments | Support mixed payments according to confirmed payment rules. |
| Cash overpayment | Cash may exceed total to calculate change; card/transfer cannot exceed total. |

### Dependencies

Phase 4.

### Expected deliverables

```text
The store can register basic sales with inventory and cash effects.
```

### Minimum completion criteria

```text
- Sale creation validates products, quantities, prices and payment method.
- Sale confirmation is atomic across Sales + Inventory + Cash.
- Insufficient stock blocks the sale.
- Open cash is required when applicable.
- Receipt data is available after confirmation.
- Audit log records sensitive sales/inventory events according to `12-audit-log.md` scope.
```

---

## 10. Phase 6 - Layaways

### Objective

Implement layaways after sales because layaways depend on customers, products, inventory reservation, cash payments and sale completion.

### Included modules

```text
layaways
layaway items
layaway payments
inventory reservation
completion as sale
cancellation
```

### Included capabilities

| Capability | Description |
|---|---|
| Create layaway | Reserve one or more products for a customer. |
| Initial payment | Register required initial payment. |
| Partial payments | Register payments against pending balance. |
| Due date | Control maximum layaway term. |
| Completion | Complete layaway and generate/associate sale. |
| Cancellation | Release reserved inventory and generate customer balance when applicable. |
| Expired payment | Expired layaway may receive payment with warning if not final/cancelled. |

### Dependencies

Phase 5.

### Expected deliverables

```text
The store can reserve products for customers, receive partial payments and complete or cancel layaways.
```

### Minimum completion criteria

```text
- Layaway validates active customer and available inventory.
- Initial payment rule is enforced.
- Partial payments cannot exceed pending balance.
- Reserved stock cannot be sold as available.
- Completion and cancellation are transactional.
```

---

## 11. Phase 7 - Purchases

### Objective

Implement supplier purchases, receiving, historical cost and supplier payments after products, suppliers, inventory, cash and validation rules exist.

### Included modules

```text
purchases
purchase items
purchase receiving
historical cost
supplier payments
```

### Confirmed product rule

```text
Purchases does not create products or variants in the MVP.
Every purchase must reference products and variants that already exist in the Products catalog.
```

If a product or variant does not exist during a purchase:

```text
The user must create the product and variant in Products first, then register or complete the purchase.
```

### Included capabilities

| Capability | Description |
|---|---|
| Create purchase | Register supplier purchase using existing products/variants. |
| Receive purchase | Increase inventory and register historical cost. |
| Cancel purchase | Cancel only when allowed by purchase state and before receiving inventory. |
| Supplier payment | Register payments against pending purchase balance. |
| Supplier document | Store provider document/reference when available. |

### Dependencies

Phase 6.

### Expected deliverables

```text
The store can register purchases from suppliers and receive products into inventory with historical cost.
```

### Minimum completion criteria

```text
- Purchase requires active supplier.
- Purchase requires at least one existing product variant.
- Unit cost must be greater than zero.
- Received quantity cannot exceed pending quantity.
- Receiving a purchase updates inventory and historical cost atomically.
- Received purchases cannot be cancelled directly.
- Supplier payments cannot exceed pending balance.
```

---

## 12. Phase 8 - Operational exception flows

### Objective

Implement exception flows after base operations are stable.

These flows are operational, not accounting. They are part of the business operation but can be developed after the base workflows.

### Included flows

| Flow | Related modules | Description |
|---|---|---|
| Supplier Returns | Suppliers, Inventory, Purchases | Return products to supplier and resolve compensation. |
| Damaged Goods | Inventory | Register damaged products and write-off when applicable. |
| Loaned Goods | Inventory, Sales | Register loaned products, returns and conversion to sale. |
| Sale Returns | Sales, Inventory, Cash | Register customer returns and restore inventory/cash effect. |
| Sale Voids | Sales, Inventory, Cash | Void same-day cashier errors according to business rules. |

### Dependencies

Phase 7.

### Expected deliverables

```text
The system can handle operational exceptions without treating them as accounting features.
```

### Minimum completion criteria

```text
- Sale void validates same business date, state, permission and reason.
- Sale return validates returned items, quantities, refund and reason.
- Damaged goods writes off available stock with reason.
- Loaned goods tracks responsible person, return and conversion to sale.
- Supplier returns can be sent and resolved with resolution type.
- Critical exception flows are atomic and audited where applicable.
```

---

## 13. Phase 9 - Reports

### Objective

Implement operational reports after enough operational data exists.

### Included reports

```text
sales reports
inventory reports
layaway reports
cash reports
purchase reports
customer reports
supplier reports
exports where allowed
USD reports using official exchange rate
```

### Dependencies

Phase 8.

### Expected deliverables

```text
The system can provide operational visibility for sales, inventory, cash, layaways, purchases, customers and suppliers.
```

### Minimum completion criteria

```text
- Reports validate filters and date ranges.
- Reports block ranges that exceed configurable limits.
- USD reports require official exchange rate configuration.
- Reports are read-only and do not modify operational data.
- Products reports are covered through sales and inventory reports; no independent products report route is required.
```

---

## 14. Phase 10 - Stabilization, checklist and AI documentation

### Objective

Finalize alignment before moving into broader development automation or future phases.

### Included work

```text
validation review
error handling review
functional testing
API contract alignment
implementation checklist
README and decision log alignment
AI_CONTEXT.md
AI_DEVELOPMENT_GUIDE.md
AI_TASK_PROMPTS.md
```

### Dependencies

Phase 9.

### Expected deliverables

```text
Stable MVP documentation and implementation checklist ready for development assisted by humans or AI.
```

### Minimum completion criteria

```text
- Documentation is aligned across all main documents.
- Implementation checklist is ready.
- Known future features are separated from MVP scope.
- Derived AI documents are generated after main documentation is complete.
- No pending contradiction exists between roadmap, MVP scope and module documents.
```

---

## 15. Accounting / Contabilidad decision

Accounting is not part of the MVP.

```text
The Accounting module remains a future/post-MVP stage.
```

The MVP must still preserve enough operational traceability for future accounting integration.

| Operational area | Future accounting relevance |
|---|---|
| Sales | Revenue, payment, returns and void references |
| Cash | Cash movements, business date, closure and differences |
| Purchases | Supplier cost, documents, payments and balances |
| Inventory | Stock movement and historical cost references |
| Supplier Returns | Supplier credits, reimbursements or replacements |
| Customer Balance | Customer credit usage/refund traceability |

Rule:

```text
The MVP must not implement full accounting, chart of accounts, double-entry journal entries,
accounting periods or bank reconciliation.

It must prepare operational data and integration points so Accounting can be added later
without redesigning the base modules.
```

---

## 16. Development dependency summary

```text
Technical foundation
  -> Security and catalogs
    -> Products / Customers / Suppliers
      -> Inventory base
        -> Cash base
          -> Sales base
            -> Layaways
              -> Purchases
                -> Operational exception flows
                  -> Reports
                    -> Stabilization / checklist / AI documentation
```

Key dependency rules:

```text
- Sales must not be implemented before products, customers, inventory and cash base.
- Cash base must exist before complete sales.
- Layaways must be implemented after sales.
- Purchases must be implemented after products, suppliers and inventory base.
- Purchases must use products and variants already created in Products.
- Operational exception flows must be implemented after base operations are stable.
- Reports must be implemented after operational data exists.
- Accounting remains future/post-MVP.
```

---

## 17. Documents affected by this roadmap

| Document | Impact |
|---|---|
| `04-architecture.md` | Must keep Accounting outside MVP and clarify roadmap dependency order. |
| `07-modules.md` | Must clarify Purchases uses existing products/variants and does not create products in MVP. |
| `10-validation-rules.md` | Must validate existing products/variants in Purchases. |
| `CODE_ALIGNMENT.md` | Must reference the roadmap order for implementation. |
| `README.md` | Must include this document in the reading order and mark next pending document. |
| `DECISION_LOG.md` | Must record confirmed roadmap decisions. |
