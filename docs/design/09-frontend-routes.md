# 09 - Frontend Routes

**Proyecto:** Automata / Calzado Norita  
**Documento:** `09-frontend-routes.md`  
**Estado:** confirmado para diseño objetivo del frontend  
**Base documental:** `automata-docs-recovered-full-v5.zip`  
**Alcance:** rutas navegables del frontend  

---

## 1. Propósito

Este documento define la estructura oficial de rutas del frontend para **Automata / Calzado Norita**.

Su objetivo es servir como guía para implementar la navegación de la aplicación React, organizar las pantallas por módulo, aplicar protección de rutas y mantener consistencia entre frontend, permisos, casos de uso y contratos API.

Este documento responde principalmente a la pregunta:

```text
¿Qué pantallas navegables existen en el sistema y bajo qué URL se acceden?
```

No define endpoints backend. Los endpoints, métodos HTTP, payloads y respuestas pertenecen a `08-api-contracts.md`.

---

## 2. Alcance del documento

`09-frontend-routes.md` documenta únicamente **rutas navegables del frontend**.

Incluye:

- rutas públicas;
- rutas protegidas;
- rutas administrativas;
- rutas operativas por módulo;
- rutas de error y fallback;
- layout esperado por grupo de rutas;
- nivel de acceso por ruta;
- permiso sugerido por ruta;
- menú principal y breadcrumbs de referencia.

No incluye como contenido principal:

- endpoints backend;
- métodos HTTP;
- payloads completos;
- implementación visual detallada de componentes;
- diseño final de UI;
- lógica interna de botones, modales o menús.

Las acciones internas pueden mencionarse solo cuando ayuden a explicar por qué una operación requiere una ruta propia.

---

## 3. Base documental obligatoria

Las rutas de este documento deben estar alineadas con:

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
CODE_ALIGNMENT.md
DECISION_LOG.md
```

El código actual es una base técnica desechable (ver `CODE_ALIGNMENT.md` y `DECISION_LOG.md`) y no limita el diseño funcional final.

---

## 4. Principios generales

### 4.1. Frontend routes vs API routes

Las rutas frontend representan pantallas navegables.

Los endpoints backend representan recursos, acciones y contratos API.

Ejemplo:

| Necesidad | Frontend route | API contract relacionado |
|---|---|---|
| Ver detalle de producto | `/products/:id` | `GET /api/v1/products/{id}` |
| Crear venta | `/sales/create` | `POST /api/v1/sales` |
| Anular venta | `/sales/:id/void` | `POST /api/v1/sales/{id}/void` |
| Registrar devolución | `/sales/:id/return` | `POST /api/v1/sales/{id}/return` |

La relación debe ser clara, pero las rutas frontend no tienen que ser idénticas a los endpoints backend.

### 4.2. Diseño objetivo

Este documento define el **diseño objetivo del frontend**.

El código actual puede tener rutas temporales, de prueba o de aprendizaje. Dichas rutas no deben documentarse como parte del sistema final si no corresponden al alcance funcional confirmado.

### 4.3. Convención de rutas CRUD

Para módulos de mantenimiento simples o de complejidad baja/media se usará el patrón:

```text
/<module>
/<module>/create
/<module>/:id
/<module>/:id/edit
```

Ejemplo:

```text
/products
/products/create
/products/:id
/products/:id/edit
```

### 4.4. Convención para creación

La convención oficial para pantallas de creación será:

```text
/<module>/create
```

No se usará `/<module>/new` como ruta oficial final.

Si el template actual contiene rutas como `/products/new`, estas deben considerarse temporales y deben evolucionar a `/products/create`.

### 4.5. Convención para edición

La convención oficial para pantallas de edición será:

```text
/<module>/:id/edit
```

### 4.6. Acciones internas vs rutas propias

Una operación tendrá ruta frontend propia cuando represente un flujo operativo significativo o cumpla uno o más de estos criterios:

- requiere formulario extenso;
- requiere validaciones importantes;
- requiere permisos específicos;
- genera auditoría visible;
- tiene impacto financiero;
- afecta inventario;
- requiere impresión o comprobante;
- puede necesitar abrirse directamente por URL;
- tiene varios pasos;
- debe ser claramente trazable para usuarios y QA.

Las acciones simples podrán ejecutarse dentro de la vista existente mediante botones, menús, modales o formularios embebidos.

Ejemplos de rutas propias:

```text
/sales/:id/void
/sales/:id/return
/layaways/:id/payment
/layaways/:id/complete
/layaways/:id/cancel
/cash/open
/cash/close
/purchases/:id/receive
/purchases/:id/cancel
/purchases/:id/payment
```

Ejemplos de acciones internas:

```text
activar/desactivar un catálogo simple
editar un color o talla desde una tabla
confirmar una acción menor con modal corto
actualizar un dato secundario dentro de una pantalla existente
```

---

## 5. Layouts y guards

El frontend usará React Router con rutas anidadas.

La estructura objetivo será:

```text
Public routes
└── GuestOnly
    └── PublicLayout
        └── /login

Protected routes
└── RequireAuth
    └── AppLayout
        ├── /dashboard
        ├── /products
        ├── /inventory
        ├── /sales
        ├── /layaways
        ├── /cash
        ├── /customers
        ├── /suppliers
        ├── /purchases
        ├── /reports
        └── /admin
```

### 5.1. PublicLayout

`PublicLayout` se usará para pantallas públicas sin menú principal.

Ruta inicial:

```text
/login
```

### 5.2. AppLayout

`AppLayout` se usará para todas las rutas internas del ERP.

Debe contener, conceptualmente:

- sidebar o navegación principal;
- header superior;
- área de contenido principal;
- breadcrumbs cuando aplique;
- controles de sesión.

El `App` actual del template, que ya contiene una estructura con `Outlet`, puede evolucionar a `AppLayout`.

### 5.3. RequireAuth

`RequireAuth` protege las rutas internas.

Si el usuario no tiene sesión activa, debe redirigirse a `/login`.

### 5.4. GuestOnly

`GuestOnly` protege rutas públicas que no deben verse cuando el usuario ya tiene sesión.

Si un usuario autenticado entra a `/login`, debe redirigirse a `/dashboard`.

---

## 6. Reglas de redirección inicial

| Route | Comportamiento |
|---|---|
| `/` | Redirige a `/dashboard` si hay sesión activa. Si no hay sesión, redirige a `/login`. |
| `/login` | Muestra login solo a usuarios no autenticados. |
| `/dashboard` | Ruta protegida. Requiere sesión activa. |

---

## 7. Niveles de acceso

Cada ruta puede tener uno de estos niveles:

| Access level | Significado |
|---|---|
| `Public` | Accesible sin sesión. |
| `Protected` | Requiere sesión activa. |
| `Admin` | Requiere sesión y permisos administrativos o específicos. |
| `Conditional` | Redirección o comportamiento condicionado por sesión. |
| `Fallback` | Ruta técnica para errores o rutas no encontradas. |

Este documento incluye un `Permission key` sugerido por ruta. La definición completa de roles, permisos y reglas de autorización sigue perteneciendo a `06-auth-rbac.md`.

Si existe conflicto entre este documento y `06-auth-rbac.md`, `06-auth-rbac.md` será la fuente principal para RBAC.

---

## 8. Rutas públicas

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/login` | `LoginPage` | `Public` | `N/A` | Única ruta pública funcional inicial. |

Reglas:

- No habrá registro público de usuarios.
- Los usuarios serán creados desde administración.
- Recuperación de contraseña puede agregarse en una fase posterior si se decide.

---

## 9. Dashboard

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/dashboard` | `DashboardPage` | `Protected` | `dashboard.view` | Pantalla principal luego del login. |

Feature frontend:

```text
features/dashboard
```

El dashboard podrá consumir datos de ventas, inventario, caja y apartados, pero se mantiene como feature propia porque representa una experiencia consolidada de inicio.

---

## 10. Products

Feature frontend:

```text
features/products
```

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/products` | `ProductsPage` | `Protected` | `products.view` | Lista de productos. |
| `/products/create` | `ProductCreatePage` | `Protected` | `products.create` | Crear producto. |
| `/products/:id` | `ProductDetailPage` | `Protected` | `products.view` | Detalle del producto. |
| `/products/:id/edit` | `ProductEditPage` | `Protected` | `products.update` | Editar producto. |

Las variantes de producto, como talla, color, SKU, código de barras o atributos comerciales, se administrarán inicialmente dentro del detalle del producto mediante secciones, pestañas, tablas internas, modales o componentes embebidos.

No se documentan como rutas iniciales:

```text
/products/:id/variants
/products/:id/variants/create
/products/:id/variants/:variantId/edit
```

Estas rutas pueden agregarse en una fase futura si el manejo de variantes requiere flujo dedicado.

---

## 11. Customers

Feature frontend:

```text
features/customers
```

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/customers` | `CustomersPage` | `Protected` | `customers.view` | Lista de clientes. |
| `/customers/create` | `CustomerCreatePage` | `Protected` | `customers.create` | Crear cliente. |
| `/customers/:id` | `CustomerDetailPage` | `Protected` | `customers.view` | Detalle del cliente. |
| `/customers/:id/edit` | `CustomerEditPage` | `Protected` | `customers.update` | Editar cliente. |

Historial de ventas, apartados, pagos, saldos, notas u otra información relacionada se mostrará inicialmente como secciones internas dentro del detalle del cliente.

No se documentan como rutas iniciales:

```text
/customers/:id/sales
/customers/:id/layaways
/customers/:id/payments
```

---

## 12. Suppliers

Feature frontend:

```text
features/suppliers
```

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/suppliers` | `SuppliersPage` | `Protected` | `suppliers.view` | Lista de proveedores. |
| `/suppliers/create` | `SupplierCreatePage` | `Protected` | `suppliers.create` | Crear proveedor. |
| `/suppliers/:id` | `SupplierDetailPage` | `Protected` | `suppliers.view` | Detalle del proveedor. |
| `/suppliers/:id/edit` | `SupplierEditPage` | `Protected` | `suppliers.update` | Editar proveedor. |

Compras, productos relacionados, pagos o notas se mostrarán inicialmente como secciones internas dentro del detalle del proveedor.

---

## 13. Supplier Returns

Supplier returns se documenta como flujo propio bajo `/suppliers/returns`.

No se modela como `/purchases/:id/return` porque la documentación base lo trata como proceso de negocio propio relacionado con proveedores.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/suppliers/returns` | `SupplierReturnsPage` | `Protected` | `supplier_returns.view` | Lista de retornos a proveedor. |
| `/suppliers/returns/create` | `SupplierReturnCreatePage` | `Protected` | `supplier_returns.create` | Crear retorno a proveedor. |
| `/suppliers/returns/:id` | `SupplierReturnDetailPage` | `Protected` | `supplier_returns.view` | Detalle del retorno. |
| `/suppliers/returns/:id/send` | `SupplierReturnSendPage` | `Protected` | `supplier_returns.create` | Marcar/enviar retorno según flujo definido. |
| `/suppliers/returns/:id/resolve` | `SupplierReturnResolvePage` | `Protected` | `supplier_returns.resolve` | Resolver retorno y registrar crédito/cierre. |

---

## 14. Inventory

Feature frontend:

```text
features/inventory
```

### 14.1. Rutas base

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/inventory` | `InventoryPage` | `Protected` | `inventory.view` | Resumen general de inventario. |
| `/inventory/stock` | `InventoryStockPage` | `Protected` | `inventory.view` | Consulta de existencias. |
| `/inventory/movements` | `InventoryMovementsPage` | `Protected` | `inventory.view` | Historial de movimientos. |
| `/inventory/movements/create` | `InventoryMovementCreatePage` | `Protected` | `inventory.adjust` | Registrar movimiento manual. |
| `/inventory/adjustments` | `InventoryAdjustmentsPage` | `Protected` | `inventory.view` | Lista de ajustes. |
| `/inventory/adjustments/create` | `InventoryAdjustmentCreatePage` | `Protected` | `inventory.adjust` | Crear ajuste de inventario. |

### 14.2. Inventory Damaged

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/inventory/damaged` | `InventoryDamagedPage` | `Protected` | `inventory.mark_damaged` | Lista de mercadería dañada. |
| `/inventory/damaged/create` | `InventoryDamagedCreatePage` | `Protected` | `inventory.mark_damaged` | Registrar mercadería dañada. |
| `/inventory/damaged/:id` | `InventoryDamagedDetailPage` | `Protected` | `inventory.mark_damaged` | Detalle del registro de daño. |
| `/inventory/damaged/:id/write-off` | `InventoryDamagedWriteOffPage` | `Protected` | `inventory.writeoff` | Baja definitiva de mercadería dañada. |

Inventory damaged tiene rutas propias porque representa un flujo operativo sensible, afecta inventario disponible, puede requerir permisos específicos y debe mantener trazabilidad.

### 14.3. Inventory Loaned

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/inventory/loaned` | `InventoryLoanedPage` | `Protected` | `inventory.loan` | Lista de mercadería prestada. |
| `/inventory/loaned/create` | `InventoryLoanCreatePage` | `Protected` | `inventory.loan` | Registrar préstamo. |
| `/inventory/loaned/:id` | `InventoryLoanDetailPage` | `Protected` | `inventory.loan` | Detalle del préstamo. |
| `/inventory/loaned/:id/return` | `InventoryLoanReturnPage` | `Protected` | `inventory.return_loan` | Registrar devolución de préstamo. |
| `/inventory/loaned/:id/convert-to-sale` | `InventoryLoanConvertToSalePage` | `Protected` | `sales.create` | Convertir préstamo en venta. |

Inventory loaned tiene rutas propias porque afecta disponibilidad de inventario, requiere trazabilidad y puede terminar como devolución o conversión a venta.

### 14.4. Rutas futuras / no-MVP

Las transferencias internas bodega/exhibición quedan fuera del MVP inicial.

Se documentan como rutas futuras:

| Route | Page futura | Estado | Notas |
|---|---|---|---|
| `/inventory/transfers` | `InventoryTransfersPage` | `Future / non-MVP` | Historial de traslados internos. |
| `/inventory/transfers/create` | `InventoryTransferCreatePage` | `Future / non-MVP` | Crear traslado interno. |

---

## 15. Sales

Feature frontend:

```text
features/sales
```

Sales no se trata como CRUD simple. Incluye creación de venta, comprobante, anulación y devolución sobre venta.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/sales` | `SalesPage` | `Protected` | `sales.view` | Lista / historial de ventas. |
| `/sales/create` | `SaleCreatePage` | `Protected` | `sales.create` | Registrar nueva venta. |
| `/sales/:id` | `SaleDetailPage` | `Protected` | `sales.view` | Detalle de venta. |
| `/sales/:id/receipt` | `SaleReceiptPage` | `Protected` | `sales.view` | Comprobante / recibo. |
| `/sales/:id/void` | `SaleVoidPage` | `Protected` | `sales.void` | Anular venta. |
| `/sales/:id/return` | `SaleReturnPage` | `Protected` | `sales.return` | Registrar devolución sobre venta. |

Las rutas `/sales/:id/void` y `/sales/:id/return` son rutas propias porque estas operaciones impactan inventario, caja, auditoría, reportes y trazabilidad financiera futura.

---

## 16. Layaways

Feature frontend:

```text
features/layaways
```

Layaways no se trata como CRUD simple. Incluye creación, pagos parciales, completar y cancelar apartado.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/layaways` | `LayawaysPage` | `Protected` | `layaways.view` | Lista / historial de apartados. |
| `/layaways/create` | `LayawayCreatePage` | `Protected` | `layaways.create` | Crear apartado. |
| `/layaways/:id` | `LayawayDetailPage` | `Protected` | `layaways.view` | Detalle del apartado. |
| `/layaways/:id/payment` | `LayawayPaymentPage` | `Protected` | `layaways.payment` | Registrar pago parcial. |
| `/layaways/:id/complete` | `LayawayCompletePage` | `Protected` | `layaways.payment` | Completar apartado y generar venta si aplica. |
| `/layaways/:id/cancel` | `LayawayCancelPage` | `Protected` | `layaways.cancel` | Cancelar apartado. |

Se usa `/payment` en singular para representar el flujo de registrar un pago. El historial de pagos se muestra dentro de `/layaways/:id`.

---

## 17. Cash

Feature frontend:

```text
features/cash
```

Cash es un módulo operativo sensible. Incluye apertura, caja actual, movimientos manuales, cierre/arqueo e historial de sesiones.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/cash` | `CashPage` | `Protected` | `cash.view` | Resumen del módulo de caja. |
| `/cash/open` | `CashOpenPage` | `Protected` | `cash.open` | Apertura de caja. |
| `/cash/current` | `CashCurrentPage` | `Protected` | `cash.view` | Caja actual abierta. |
| `/cash/movements` | `CashMovementsPage` | `Protected` | `cash.view` | Historial de movimientos manuales. |
| `/cash/movements/create` | `CashMovementCreatePage` | `Protected` | `cash.manual_movement` | Registrar movimiento manual. |
| `/cash/close` | `CashClosePage` | `Protected` | `cash.close` | Cierre / arqueo de caja. |
| `/cash/sessions` | `CashSessionsPage` | `Protected` | `cash.view` | Historial de sesiones de caja. |
| `/cash/sessions/:id` | `CashSessionDetailPage` | `Protected` | `cash.view` | Detalle de sesión de caja. |

Cash tiene rutas propias para operaciones sensibles por su impacto en dinero físico, `business_date`, auditoría, reportes y trazabilidad financiera futura.

---

## 18. Purchases

Feature frontend:

```text
features/purchases
```

Purchases incluye creación de compra, recepción, cancelación de compra no recibida y pago a proveedor.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/purchases` | `PurchasesPage` | `Protected` | `purchases.view` | Lista / historial de compras. |
| `/purchases/create` | `PurchaseCreatePage` | `Protected` | `purchases.create` | Registrar nueva compra. |
| `/purchases/:id` | `PurchaseDetailPage` | `Protected` | `purchases.view` | Detalle de compra. |
| `/purchases/:id/receive` | `PurchaseReceivePage` | `Protected` | `purchases.create` | Recibir compra. |
| `/purchases/:id/cancel` | `PurchaseCancelPage` | `Protected` | `purchases.cancel` | Cancelar compra no recibida. |
| `/purchases/:id/payment` | `PurchasePaymentPage` | `Protected` | `purchases.pay` | Registrar pago a proveedor. |

Se usa `/payment` en singular para representar el flujo de registrar un pago. El historial de pagos se muestra dentro de `/purchases/:id`.

No se usará:

```text
/purchases/:id/return
```

El retorno a proveedor vive bajo `/suppliers/returns`.

---

## 19. Reports

Feature frontend:

```text
features/reports
```

Reports se organizará por área operativa.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/reports` | `ReportsPage` | `Protected` | `reports.sales.view` | Índice general de reportes. |
| `/reports/sales` | `SalesReportsPage` | `Protected` | `reports.sales.view` | Ventas, anulaciones, devoluciones, productos más vendidos y utilidad estimada si aplica permiso. |
| `/reports/inventory` | `InventoryReportsPage` | `Protected` | `reports.inventory.view` | Stock, disponibilidad, movimientos y mercancía especial. |
| `/reports/layaways` | `LayawayReportsPage` | `Protected` | `layaways.view` | Apartados, pagos, vencimientos y cancelaciones. |
| `/reports/cash` | `CashReportsPage` | `Protected` | `reports.cash.view` | Caja, arqueos, cierres, diferencias y movimientos. |
| `/reports/purchases` | `PurchaseReportsPage` | `Protected` | `reports.purchases.view` | Compras, recepción y retornos a proveedor. |
| `/reports/customers` | `CustomerReportsPage` | `Protected` | `reports.customers.view` | Clientes, historial, crédito y saldos. |
| `/reports/suppliers` | `SupplierReportsPage` | `Protected` | `reports.purchases.view` | Proveedores, compras y créditos/retornos. |

No se agrega `/reports/products` como ruta independiente. Los reportes de productos se cubren dentro de:

```text
/reports/sales
/reports/inventory
```

Ejemplos:

| Reporte | Ruta |
|---|---|
| Productos más vendidos | `/reports/sales` |
| Disponibilidad por categoría | `/reports/inventory` |
| Stock bajo | `/reports/inventory` |
| Movimientos por producto | `/reports/inventory` |

---

## 20. Admin

Las rutas administrativas se agrupan bajo:

```text
/admin
```

Estas rutas están reservadas para administración del sistema, seguridad, usuarios, roles, permisos, catálogos maestros y configuración sensible.

---

## 21. Admin - Users, Roles and Permissions

Feature frontend sugerida:

```text
features/admin
```

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/admin/users` | `UsersPage` | `Admin` | `users.view` | Lista de usuarios. |
| `/admin/users/create` | `UserCreatePage` | `Admin` | `users.create` | Crear usuario. |
| `/admin/users/:id` | `UserDetailPage` | `Admin` | `users.view` | Detalle de usuario. |
| `/admin/users/:id/edit` | `UserEditPage` | `Admin` | `users.update` | Editar usuario. |
| `/admin/roles` | `RolesPage` | `Admin` | `roles.view` | Lista de roles. |
| `/admin/roles/create` | `RoleCreatePage` | `Admin` | `roles.create` | Crear rol. |
| `/admin/roles/:id` | `RoleDetailPage` | `Admin` | `roles.view` | Detalle de rol. |
| `/admin/roles/:id/edit` | `RoleEditPage` | `Admin` | `roles.update` | Editar rol y asignar permisos. |
| `/admin/permissions` | `PermissionsPage` | `Admin` | `roles.assign_permissions` | Consulta de permisos disponibles. |

`/admin/permissions` será una vista de consulta. La asignación de permisos se realizará desde `/admin/roles/:id/edit`.

Los permisos son capacidades del sistema y no registros de creación libre para usuarios comunes.

---

## 22. Admin - Catalogs

Los catálogos maestros se organizan bajo:

```text
/admin/catalogs
```

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/admin/catalogs` | `CatalogsPage` | `Admin` | `settings.view` | Índice de catálogos. |
| `/admin/catalogs/product-categories` | `ProductCategoriesCatalogPage` | `Admin` | `settings.view` | Categorías de producto. |
| `/admin/catalogs/brands` | `BrandsCatalogPage` | `Admin` | `settings.view` | Marcas. |
| `/admin/catalogs/sizes` | `SizesCatalogPage` | `Admin` | `settings.view` | Tallas. |
| `/admin/catalogs/colors` | `ColorsCatalogPage` | `Admin` | `settings.view` | Colores. |
| `/admin/catalogs/payment-methods` | `PaymentMethodsCatalogPage` | `Admin` | `settings.view` | Métodos de pago. |
| `/admin/catalogs/inventory-movement-types` | `InventoryMovementTypesCatalogPage` | `Admin` | `settings.view` | Tipos de movimiento de inventario. |

Regla mixta:

- Catálogos simples podrán gestionarse desde una sola pantalla.
- Catálogos complejos podrán usar CRUD completo cuando requieran detalle, auditoría, permisos específicos o formularios extensos.

Ejemplo de CRUD completo para un catálogo complejo:

```text
/admin/catalogs/product-categories
/admin/catalogs/product-categories/create
/admin/catalogs/product-categories/:id
/admin/catalogs/product-categories/:id/edit
```

---

## 23. Admin - Settings

Settings tendrá subrutas por categoría bajo `/admin/settings`.

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/admin/settings` | `SettingsPage` | `Admin` | `settings.view` | Índice general de configuración. |
| `/admin/settings/business` | `BusinessSettingsPage` | `Admin` | `settings.view` | Datos generales del negocio. |
| `/admin/settings/sales` | `SalesSettingsPage` | `Admin` | `settings.view` | Parámetros relacionados con ventas. |
| `/admin/settings/layaways` | `LayawaySettingsPage` | `Admin` | `settings.view` | Porcentaje inicial, plazo máximo y reglas de apartado. |
| `/admin/settings/cash` | `CashSettingsPage` | `Admin` | `settings.view` | Parámetros de caja, arqueo y cierre. |
| `/admin/settings/reports` | `ReportSettingsPage` | `Admin` | `settings.view` | Tipo de cambio oficial y opciones de reportes. |
| `/admin/settings/security` | `SecuritySettingsPage` | `Admin` | `settings.view` | Parámetros de sesión, seguridad o acceso. |

Para editar configuraciones se requiere `settings.update`.

El tipo de cambio oficial para reportes en USD se maneja en:

```text
/admin/settings/reports
```

---

## 24. Error routes and fallback

| Route | Page | Access level | Permission key | Notas |
|---|---|---|---|---|
| `/not-found` | `NotFoundPage` | `Fallback` | `N/A` | Página 404. |
| `/forbidden` | `ForbiddenPage` | `Fallback` | `N/A` | Acceso denegado. |
| `/session-expired` | `SessionExpiredPage` | `Fallback` | `N/A` | Sesión expirada. |
| `*` | `FallbackRoute` | `Fallback` | `N/A` | Redirige a `/not-found`. |

Comportamiento esperado:

| Caso | Resultado |
|---|---|
| Usuario entra a ruta inexistente | Redirige a `/not-found`. |
| Usuario autenticado sin permiso | Redirige o muestra `/forbidden`. |
| Token expirado | Redirige a `/session-expired` o a `/login` con mensaje. |
| Error inesperado en una vista | Mostrar `ErrorBoundary` o pantalla de error controlada. |

---

## 25. Main navigation

El menú principal base será:

```text
Dashboard
Products
Inventory
Sales
Layaways
Cash
Customers
Suppliers
Purchases
Reports
Admin
```

### 25.1. Agrupación sugerida

| Grupo | Rutas principales |
|---|---|
| Inicio | `/dashboard` |
| Operación comercial | `/sales`, `/layaways`, `/cash` |
| Catálogo operativo | `/products`, `/customers`, `/suppliers` |
| Inventario | `/inventory`, `/inventory/stock`, `/inventory/movements`, `/inventory/damaged`, `/inventory/loaned` |
| Compras y proveedores | `/purchases`, `/suppliers/returns` |
| Reportes | `/reports` |
| Administración | `/admin/users`, `/admin/roles`, `/admin/catalogs`, `/admin/settings` |

---

## 26. Breadcrumbs de referencia

| Route | Breadcrumb |
|---|---|
| `/dashboard` | `Dashboard` |
| `/products` | `Products` |
| `/products/create` | `Products / Create` |
| `/products/:id` | `Products / Detail` |
| `/products/:id/edit` | `Products / Detail / Edit` |
| `/inventory/damaged/:id/write-off` | `Inventory / Damaged / Detail / Write-off` |
| `/inventory/loaned/:id/return` | `Inventory / Loaned / Detail / Return` |
| `/sales/:id/return` | `Sales / Detail / Return` |
| `/sales/:id/void` | `Sales / Detail / Void` |
| `/layaways/:id/payment` | `Layaways / Detail / Payment` |
| `/cash/close` | `Cash / Close` |
| `/purchases/:id/payment` | `Purchases / Detail / Payment` |
| `/suppliers/returns/:id/resolve` | `Suppliers / Returns / Detail / Resolve` |
| `/admin/catalogs/colors` | `Admin / Catalogs / Colors` |
| `/admin/settings/reports` | `Admin / Settings / Reports` |

Esta sección no reemplaza un documento futuro de UI/components, pero sirve como guía para implementar navegación consistente.

---

## 27. Relación con estructura frontend

La estructura objetivo mantiene el patrón modular por feature.

Estructura sugerida:

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
    api/
    components/
    contexts/
    types/
```

### 27.1. Auth feature

El módulo frontend de autenticación será:

```text
features/auth
```

La ruta visible sigue siendo:

```text
/login
```

### 27.2. Dashboard feature

El dashboard será feature propia:

```text
features/dashboard
```

Aunque consuma datos de ventas, inventario, caja o apartados, representa una experiencia de usuario independiente.

---

## 28. Rutas futuras / no-MVP

| Route | Estado | Motivo |
|---|---|---|
| `/inventory/transfers` | Future / non-MVP | Transferencias internas bodega/exhibición quedan fuera del MVP inicial. |
| `/inventory/transfers/create` | Future / non-MVP | Crear traslado interno no pertenece al MVP inicial. |

---

## 29. Reglas finales confirmadas

| Código | Decisión |
|---|---|
| 09-01 | `/` redirige a `/dashboard`. |
| 09-02 | `/dashboard` es ruta protegida. |
| 09-03 | `/login` es la única ruta pública funcional inicial. |
| 09-04 | Usuario autenticado en `/login` redirige a `/dashboard`. |
| 09-05 | Crear usa `/<module>/create`. |
| 09-06 | Editar usa `/<module>/:id/edit`. |
| 09-07 | El documento solo define rutas navegables del frontend. |
| 09-08 | React Router usará rutas anidadas con `PublicLayout`, `AppLayout`, `RequireAuth` y `GuestOnly`. |
| 09-09 | Auth se documenta como `features/auth`. |
| 09-10 | Dashboard se documenta como `features/dashboard`. |
| 09-11 | Admin vive bajo `/admin`. |
| 09-12 | Catálogos viven bajo `/admin/catalogs`. |
| 09-13 | Catálogos usan regla mixta: pantalla simple o CRUD completo según complejidad. |
| 09-14 | Inventory tiene subrutas operativas. |
| 09-15 | Products usa CRUD principal y variantes internas. |
| 09-16 | Customers usa CRUD principal e historial interno. |
| 09-17 | Suppliers usa CRUD principal e historial interno. |
| 09-18 | Sales incluye `receipt`, `void` y `return`. |
| 09-19 | Layaways incluye `payment`, `complete` y `cancel`. |
| 09-20 | Cash incluye `open`, `current`, `movements`, `close` y `sessions`. |
| 09-21 | Purchases incluye `receive`; supplier return vive aparte. |
| 09-22 | Inventory incluye damaged y loaned; transfers queda futuro/no-MVP. |
| 09-23 | Reports se organiza por área operativa. |
| 09-24 | Admin security incluye users, roles y permissions como consulta. |
| 09-25 | Settings usa subrutas por categoría. |
| 09-26 | Error routes incluyen `/not-found`, `/forbidden`, `/session-expired` y `*`. |
| 09-27 | Operaciones críticas pueden tener rutas propias; acciones simples pueden ser internas. |
| 09-28 | El documento incluye main navigation y breadcrumbs de referencia. |
| 09-29 | Cada ruta incluye access level y permission key sugerido. |
| 09-30 | `/inventory/transfers` queda como ruta futura/no-MVP. |
| 09-31 | Supplier returns vive bajo `/suppliers/returns`, no bajo purchases. |
| 09-32 | Inventory loaned usa rutas propias completas. |
| 09-33 | Inventory damaged usa rutas propias completas. |
| 09-34 | Purchases incluye `cancel` y `payment`. |

---

## 30. Pendientes para documentos posteriores

Este documento no cubre en detalle:

- componentes visuales;
- diseño UI final;
- formularios y validaciones campo por campo;
- estado global frontend;
- estrategia de cache;
- testing de rutas;
- documentación AI (`AI_CONTEXT.md`, `AI_DEVELOPMENT_GUIDE.md`, `AI_TASK_PROMPTS.md`).

Los documentos AI ya existen en el paquete final y deben usarse como guías derivadas para desarrollo asistido por IA.
