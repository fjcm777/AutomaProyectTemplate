# 03 — Casos de Uso

> **Contexto del negocio:** Tienda de calzado y artículos complementarios (bolsos, accesorios, etc.).
> Se manejan ventas en efectivo, ventas por transferencia bancaria, ventas con tarjeta, ventas a crédito y ventas por sistema de apartado. **No se manejan cotizaciones**.

---

## Nota de alineación v15

Este documento fue alineado con las decisiones confirmadas en documentos posteriores.

Cuando exista conflicto entre un caso de uso antiguo y documentos más recientes, prevalecen:

1. `DECISION_LOG.md`
2. `14-mvp-scope.md`
3. `13-development-roadmap.md`
4. `15-implementation-checklist.md`
5. `10-validation-rules.md`
6. `08-api-contracts.md`
7. `07-modules.md`
8. `05-database.md`

`03-use-cases.md` describe casos funcionales, pero no debe usarse para reintroducir funcionalidades excluidas del MVP, estados no confirmados, campos inexistentes o flujos revertidos por decisiones posteriores.

---

## Actores del Sistema

| Actor | Descripción |
|-------|-------------|
| **Admin** | Acceso total al sistema |
| **Manager** | Supervisión, reportes y administración de clientes, sin gestión de usuarios |
| **Seller** | Crea facturas, aplica descuentos, cobra, gestiona clientes, crea apartados, consulta disponibilidad de productos y ve reportes de ventas |
| **Cashier** | Registra pagos de facturas, abonos de clientes y pagos de apartados. No crea facturas ni edita clientes |
| **Warehouse** | Gestión completa de inventario |
| **Purchasing** | Gestión de proveedores y órdenes de compra |
| **Accountant** | Gestión contable, catálogo de cuentas, asientos, cierres y reportes financieros |
| **System** | Acciones automáticas del sistema |

---

## AUTH — Autenticación y Usuarios

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-001 | Admin | Crear, editar y desactivar usuarios |
| CU-002 | Admin | Asignar roles y permisos por módulo |
| CU-003 | Usuario | Iniciar y cerrar sesión (JWT) |
| CU-004 | Usuario | Cambiar contraseña |
| CU-005 | Admin | Ver log de actividad del sistema |
| CU-006 | Admin | Gestionar permisos y asignaciones |
| CU-007 | Admin | Revocar tokens activos para forzar cierre de sesión |

---

## INVENTORY — Inventario

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-101 | Warehouse / Admin | Crear, editar y desactivar productos |
| CU-102 | Warehouse / Admin | Gestionar categorías |
| CU-103 | Warehouse / Admin | Gestionar variantes de producto |
| CU-103a | Warehouse / Admin | Gestionar catálogos de tallas y colores |
| CU-104 | Warehouse | Registrar entrada de mercancía desde orden de compra |
| CU-105 | Warehouse | Registrar ajuste de inventario |
| CU-106 | Warehouse | Registrar traslado interno entre ubicaciones **(Future / no MVP)** |
| CU-107 | Warehouse / Admin / Manager | Ver stock actual por producto, variante y bodega |
| CU-108 | Admin | Configurar stock mínimo y alertas |
| CU-109 | System | Descontar stock automáticamente al facturar |
| CU-110 | Admin / Warehouse / Manager | Ver kardex completo |
| CU-111 | Warehouse / Admin | Registrar devolución de venta con movimiento de inventario |
| CU-112 | Warehouse / Admin | Registrar corrección controlada de recepción según proceso definido, sin revertir directamente compras recibidas |
| CU-113 | System | Reservar stock al crear apartado |
| CU-114 | System | Liberar stock reservado por apartado vencido o cancelado según política |
| CU-115 | Seller / Warehouse / Admin / Manager | Consultar productos disponibles por nombre, código, talla, color y bodega |

### Reglas de inventario relacionadas

| Área | Regla |
|------|-------|
| Disponibilidad para venta | El stock disponible debe considerar el stock físico menos el stock reservado por apartados activos |
| Consulta de disponibilidad | El vendedor debe poder confirmar existencia de productos por variante, talla, color y bodega |
| Devoluciones de venta | Si el producto devuelto está en condiciones de reventa, debe reingresar al inventario; si está defectuoso, debe registrarse sin disponibilidad para venta |
| Reservas por apartado | La venta por apartado reserva inventario, no lo descuenta definitivamente hasta completar el flujo definido |

### Alineación MVP de inventario

- Las transferencias internas entre bodegas/ubicaciones quedan como **future scope** y no deben implementarse en el MVP.
- El MVP puede preparar el modelo para ubicación o bodega lógica, pero no debe desarrollar flujos avanzados de transferencias internas.
- Una compra recibida no debe revertirse directamente. Las correcciones deben manejarse mediante procesos controlados de ajuste, retorno o corrección según las reglas confirmadas.

---

## SALES — Ventas y Facturación

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-201 | Seller | Crear factura de venta directa |
| CU-202 | Seller | Agregar productos por código, nombre o variante |
| CU-203 | Seller | Aplicar descuentos por línea o total |
| CU-204 | Seller | Seleccionar modalidad de venta: efectivo, transferencia, tarjeta, crédito o apartado |
| CU-205 | Seller / Cashier | Registrar pago de factura |
| CU-205a | Seller / Cashier | Registrar abonos parciales o anular pagos |
| CU-205b | Seller / Cashier | Crear venta por sistema de apartado con pago inicial mínimo |
| CU-205c | Seller / Cashier | Registrar pagos parciales de apartado durante el plazo permitido |
| CU-205d | System | Alertar apartados vencidos cuando el cliente no complete el pago dentro del plazo máximo configurable |
| CU-205e | Seller / Cashier | Cerrar apartado pagado y generar factura o documento final según proceso definido |
| CU-206 | Seller | Generar nota de crédito / devolución |
| CU-206a | Seller / Admin / System | Registrar devolución de venta con movimiento de inventario y trazabilidad operativa |
| CU-207 | Seller / Admin | Anular factura con motivo |
| CU-207a | Seller / Admin | Gestionar estados de factura |
| CU-208 | Admin | Configurar impuestos y series de factura |
| CU-209 | System | Descontar inventario al emitir factura |
| CU-210 | System | Generar PDF de factura |
| CU-211 | Cashier / Admin | Abrir caja del día operativo |
| CU-212 | Cashier / Admin | Registrar movimientos manuales de caja |
| CU-213 | Cashier / Manager / Admin | Consultar resumen esperado de caja |
| CU-214 | Cashier / Manager / Admin | Realizar arqueo de caja |
| CU-215 | Cashier / Manager / Admin | Registrar diferencia de caja: sobrante o faltante |
| CU-216 | Cashier / Manager / Admin | Cerrar caja |
| CU-217 | System | Asignar ventas posteriores al siguiente día operativo después del cierre de caja |
| CU-218 | Admin / Manager | Reabrir caja con permiso especial |

### Modalidades de venta

| Modalidad | Descripción |
|-----------|-------------|
| **Venta en efectivo** | Venta pagada al momento. Incluye efectivo físico, transferencia bancaria y tarjeta |
| **Venta a crédito** | Venta entregada al cliente con saldo pendiente, sujeta a validación de deuda/saldo y permisos de override cuando aplique |
| **Venta por apartado** | El cliente selecciona productos, paga un porcentaje inicial y cancela el saldo por partes dentro del plazo máximo configurable |

### Reglas de apartado

| Regla | Descripción |
|-------|-------------|
| Porcentaje inicial | Debe ser configurable por el negocio |
| Plazo máximo | Configurable mediante settings de apartados, por ejemplo `layaways.default_term_days` |
| Pagos parciales | Se permiten múltiples abonos |
| Inventario | Se reserva mientras el apartado esté activo |
| Vencimiento | Si no se completa el pago dentro del plazo configurado, se genera alerta |
| Liberación | La liberación de inventario por vencimiento debe ser configurable |
| Cierre | Al completar el pago, el apartado se convierte en venta cerrada/factura según el flujo definido |


### Reglas de caja y arqueo

| Regla | Descripción |
|-------|-------------|
| Apertura de caja | Toda operación de cobro debe asociarse a una caja abierta o sesión de caja válida |
| Fecha operativa | El sistema debe manejar `business_date` para separar la fecha real de la fecha operativa |
| Arqueo antes de fin de día | Si la caja se cierra antes del final del día calendario, las ventas posteriores deben registrarse con el siguiente `business_date` |
| Efectivo esperado | Se calcula con apertura de caja + pagos en efectivo + entradas manuales - salidas manuales - reembolsos en efectivo |
| Diferencia de caja | El sistema debe registrar sobrante o faltante cuando el efectivo contado no coincida con el esperado |
| Métodos de pago | El arqueo debe resumir efectivo, transferencia y tarjeta, aunque la diferencia física aplica principalmente al efectivo |
| Reapertura | Reabrir caja debe requerir permiso especial y quedar auditado |
| Contabilidad | Sobrantes y faltantes pueden generar eventos contables en segunda etapa |

### Reglas de devoluciones sobre ventas

| Regla | Descripción |
|-------|-------------|
| Movimiento de inventario | Toda devolución debe generar movimiento de inventario si el producto regresa físicamente |
| Integración contable futura | La devolución debe conservar trazabilidad suficiente para una futura integración contable, sin generar contabilidad formal en el MVP |
| Devolución operativa | La devolución debe registrar el resultado operativo definido: reintegro de inventario y devolución de efectivo cuando aplique |
| Producto defectuoso | Si el producto no está disponible para reventa, debe registrarse sin incrementar stock disponible |
| Auditoría | Toda devolución debe registrar usuario, fecha, motivo y documento relacionado |

---

## CUSTOMERS — Clientes y Crédito

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-301 | Admin / Manager / Seller | Crear y editar cliente |
| CU-302 | Admin / Manager | Consultar y revisar saldo/deuda del cliente |
| CU-303 | Admin / Manager | Autorizar operación con cliente que tiene deuda mediante permiso de override cuando aplique |
| CU-304 | Seller / Cashier | Registrar abono a cuenta del cliente |
| CU-305 | Seller / Cashier / Manager / Accountant | Ver estado de cuenta del cliente |
| CU-306 | Admin / Manager | Ver clientes con saldo vencido |
| CU-307 | System | Bloquear venta con deuda/saldo pendiente cuando no exista permiso de override aplicable |
| CU-307a | System | Bloquear operación y notificar al vendedor cuando el cliente no cumpla reglas de deuda/saldo configuradas |
| CU-308 | Admin | Generar estado de cuenta para cliente |
| CU-309 | Seller / Manager | Ver apartados activos, pagados y vencidos del cliente |

### Reglas de clientes y crédito alineadas al MVP

| Regla | Descripción |
|---|---|
| Sin `credit_limit` en MVP | El esquema confirmado no define un campo `credit_limit` para clientes. |
| Control de deuda/saldo | Las operaciones deben validar saldo/deuda del cliente según reglas confirmadas. |
| Override autorizado | Si una operación requiere excepción, debe usarse un permiso de override, por ejemplo `sales.credit_override`, no un flujo formal de aprobación de límite de crédito. |
| Saldo del cliente | El saldo no se modifica directamente; debe cambiar mediante movimientos trazables. |

---

## SUPPLIERS — Proveedores

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-401 | Admin / Purchasing | Crear y editar proveedor |
| CU-402 | Purchasing | Crear orden de compra |
| CU-402a | Purchasing / Admin | Revisar compra en borrador antes de recibir o cancelar, sin flujo formal de aprobación/rechazo en MVP |
| CU-403 | Warehouse | Recibir mercancía contra orden de compra |
| CU-404 | Admin | Registrar factura de proveedor |
| CU-405 | Admin | Registrar pago a proveedor |
| CU-406 | Admin / Manager / Accountant | Ver cuentas por pagar |
| CU-407 | Admin / Manager / Purchasing | Ver historial de compras por proveedor |

### Reglas de compras alineadas al MVP

| Regla | Descripción |
|---|---|
| Estados de compra | El flujo confirmado para compras es `draft -> received` o `draft -> cancelled`. |
| Compra recibida | Una compra `received` es final y no debe cancelarse ni revertirse directamente. |
| Sin aprobación/rechazo formal | El MVP no incluye un flujo formal de confirmar/rechazar orden de compra. |
| Productos existentes | Purchases no crea productos ni variantes; toda compra referencia productos existentes en Products. |

---

## REPORTS — Reportes

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-501 | Admin / Manager / Seller | Reporte de ventas por período, vendedor o producto |
| CU-502 | Admin / Manager / Warehouse | Reporte de inventario |
| CU-503 | Admin / Manager / Accountant | Reporte de cuentas por cobrar |
| CU-504 | Admin / Manager / Accountant | Reporte de cuentas por pagar |
| CU-505 | Admin / Warehouse | Reporte de productos bajo stock |
| CU-506 | Admin / Warehouse | Reporte de movimientos de inventario |
| CU-507 | Admin / Manager | Dashboard general con KPIs |
| CU-507a | Admin / Manager / Seller | Reporte de apartados activos, pagados y vencidos |
| CU-508 | Admin | Reporte de actividad de usuarios |
| CU-509 | Admin | Reporte de permisos y roles asignados |

---

## ACCOUNTING — Contabilidad

> Los casos de uso marcados como **(Segunda etapa)** forman parte del diseño general, pero no son obligatorios para el MVP.

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-601 | Admin / Accountant | Gestionar catálogo de cuentas contables **(Segunda etapa)** |
| CU-602 | Admin / Accountant | Definir reglas contables para ventas, compras, pagos, notas de crédito, apartados, devoluciones y ajustes **(Segunda etapa)** |
| CU-603 | System / Accountant | Generar asientos de diario automáticos desde eventos del sistema **(Segunda etapa)** |
| CU-604 | Accountant | Crear asientos de diario manuales **(Segunda etapa)** |
| CU-605 | Accountant | Revisar, aprobar, anular o reversar asientos de diario **(Segunda etapa)** |
| CU-606 | Admin / Accountant / Manager | Consultar libro diario **(Segunda etapa)** |
| CU-607 | Admin / Accountant / Manager | Consultar libro mayor **(Segunda etapa)** |
| CU-608 | Admin / Accountant / Manager | Generar balance general **(Segunda etapa)** |
| CU-609 | Admin / Accountant / Manager | Generar estado de resultados **(Segunda etapa)** |
| CU-610 | Accountant | Conciliar pagos, cuentas por cobrar y cuentas por pagar **(Segunda etapa)** |
| CU-611 | Admin / Accountant | Configurar períodos fiscales **(Segunda etapa)** |
| CU-612 | Accountant | Ejecutar validaciones previas al cierre contable **(Segunda etapa)** |
| CU-613 | Accountant | Generar asientos de cierre del período **(Segunda etapa)** |
| CU-614 | Accountant | Cerrar período fiscal **(Segunda etapa)** |
| CU-615 | Accountant | Generar asiento de apertura del nuevo período **(Segunda etapa)** |
| CU-616 | Admin / Accountant | Reabrir período fiscal con permiso especial **(Segunda etapa)** |
| CU-617 | Accountant | Gestionar cuentas bancarias **(Segunda etapa)** |
| CU-618 | Accountant | Importar o registrar movimientos bancarios **(Segunda etapa)** |
| CU-619 | Accountant | Conciliar movimientos bancarios contra pagos del sistema **(Segunda etapa)** |

### Reglas de contabilidad

| Área | Regla |
|------|-------|
| Catálogo de cuentas | CU-601 administra el catálogo de cuentas contables usado por asientos, reglas y reportes |
| Reglas contables | CU-602 define cómo los eventos del sistema se convierten en débitos y créditos |
| Asientos de diario | Los asientos automáticos o manuales se registran en diario y luego alimentan libro mayor |
| Cierre contable | El cierre contable debe validar asientos, generar cierre, bloquear el período y crear apertura del nuevo período |
| Conciliación CxC/CxP | Revisa saldos de clientes y proveedores contra documentos y pagos registrados |
| Conciliación bancaria | Compara movimientos del sistema contra movimientos reales del banco |

---

## INTERNAL EVENTS — Eventos internos del sistema

> Esta sección no representa un módulo funcional visible al usuario. Es infraestructura interna para integrar módulos y preparar procesos futuros.

| Evento | Origen | Propósito |
|--------|--------|-----------|
| `caja_abierta` | Sales / Cash Register | Registrar apertura de caja |
| `arqueo_caja_realizado` | Sales / Cash Register | Registrar arqueo de caja |
| `caja_cerrada` | Sales / Cash Register | Registrar cierre de caja |
| `diferencia_caja_registrada` | Sales / Cash Register | Registrar sobrante o faltante de caja |
| `venta_asignada_siguiente_dia_operativo` | Sales / System | Registrar venta posterior al cierre con siguiente `business_date` |
| `factura_emitida` | Sales | Registrar emisión de factura |
| `apartado_creado` | Sales | Registrar creación de apartado y reserva de stock |
| `apartado_vencido` | Sales / System | Registrar vencimiento de apartado |
| `pago_cliente_recibido` | Sales / Customers | Registrar pago o abono recibido |
| `orden_compra_recibida` | Suppliers / Inventory | Registrar recepción de mercancía |
| `ajuste_inventario_registrado` | Inventory | Registrar ajuste manual de inventario |
| `devolucion_venta_registrada` | Sales / Inventory | Registrar devolución con efecto en inventario y contabilidad |
| `periodo_cerrado` | Accounting | Registrar cierre de período **(Segunda etapa)** |
| `asiento_cierre_generado` | Accounting | Registrar generación de asiento de cierre **(Segunda etapa)** |
| `asiento_apertura_generado` | Accounting | Registrar generación de asiento de apertura **(Segunda etapa)** |

---

## Resumen de alcance por etapa

| Área | Etapa |
|------|-------|
| Ventas directas, crédito y apartado | Primera etapa |
| Inventario, stock, reservas y kardex | Primera etapa |
| Clientes, proveedores, reportes básicos y RBAC | Primera etapa |
| Consulta de disponibilidad para vendedores | Primera etapa |
| Devoluciones con efecto en inventario | Primera etapa |
| Arqueo de caja operativo | Primera etapa |
| Catálogo de cuentas, reglas contables y asientos | Segunda etapa |
| Cierre contable formal | Segunda etapa |
| Conciliación bancaria | Segunda etapa |


---

## INVENTORY — Mercadería prestada y dañada

| Código | Actor | Caso de uso |
|---|---|---|
| CU-116 | Warehouse / Seller / Manager / Admin | Registrar mercadería prestada |
| CU-117 | Warehouse / Seller / Manager / Admin | Registrar devolución de mercadería prestada |
| CU-118 | Seller / Manager / Admin | Convertir mercadería prestada en venta |
| CU-119 | Warehouse / Seller / Manager / Admin | Consultar mercadería prestada o fuera de tienda |
| CU-120 | System | Alertar mercadería prestada vencida o no devuelta |
| CU-121 | Warehouse / Manager / Admin | Registrar mercadería dañada |
| CU-122 | Warehouse / Manager / Admin | Consultar mercadería dañada o no disponible para venta |
| CU-123 | Manager / Admin | Dar de baja mercadería dañada |
| CU-124 | Warehouse / Purchasing / Manager / Admin | Registrar salida de inventario por retorno a proveedor |

### Reglas de mercadería prestada

- No es una venta hasta que se confirme la compra.
- Debe registrarse la persona responsable con `reserved_for_name` y `reserved_for_type`.
- No debe aparecer como inventario disponible para venta.
- Debe generar movimiento `loan_out` al entregar y `loan_return` al devolver.
- Si se convierte en venta, la reserva queda `consumed` y se vincula a la factura.
- Si el préstamo ya generó salida física, la factura no debe descontar inventario nuevamente.

### Reglas de mercadería dañada

- No debe formar parte del stock disponible.
- Se recomienda usar una bodega lógica “Mercadería dañada / No vendible”.
- La baja definitiva requiere permiso de Manager o Admin.
- Debe quedar auditado motivo, usuario y fecha.

## SUPPLIERS — Retorno a proveedor

| Código | Actor | Caso de uso |
|---|---|---|
| CU-408 | Purchasing / Manager / Admin | Registrar retorno de mercancía a proveedor |
| CU-409 | Purchasing / Manager / Admin | Registrar crédito a favor por retorno a proveedor |
| CU-410 | Purchasing / Manager / Admin | Aplicar crédito de proveedor a compra futura |
| CU-411 | Purchasing / Manager / Admin / Accountant | Consultar créditos disponibles con proveedores |

### Reglas de retorno a proveedor

- Retorno a proveedor es independiente de devolución sobre venta.
- Debe registrar salida de inventario con `inventory_movements.movement_type` = `supplier_return_reserved` / `supplier_return_out` (ver `inventory_movement_types` en `05-database.md`).
- El proveedor puede reconocer crédito, reemplazo o reembolso.
- Si reconoce crédito, se registra en `supplier_credits`.
- Si el crédito se usa parcialmente, se registra en `supplier_credit_applications`.

## Eventos internos adicionales

| Evento | Módulo | Propósito |
|---|---|---|
| `mercaderia_prestada_registrada` | Inventory | Registrar salida temporal de mercadería |
| `mercaderia_prestada_devuelta` | Inventory | Registrar retorno de mercadería prestada |
| `mercaderia_prestada_convertida_venta` | Inventory / Sales | Registrar conversión en venta |
| `mercaderia_prestada_vencida` | Inventory / System | Alertar mercadería prestada vencida |
| `mercaderia_danada_registrada` | Inventory | Registrar mercadería dañada |
| `mercaderia_danada_dada_baja` | Inventory | Registrar baja definitiva |
| `retorno_proveedor_creado` | Suppliers / Inventory | Registrar retorno a proveedor |
| `credito_proveedor_generado` | Suppliers | Registrar crédito a favor del proveedor para trazabilidad operativa |
| `credito_proveedor_aplicado` | Suppliers | Registrar aplicación operativa de crédito de proveedor |

---

## Casos de uso complementarios v4

| Código | Caso | Módulo | Permiso | Tablas principales | Evento |
|---|---|---|---|---|---|
| CU-209 | Crear préstamo de inventario | inventory | inventory.loan | inventory_loans, inventory_stock, inventory_movements | inventory.loaned |
| CU-210 | Retornar préstamo de inventario | inventory | inventory.return_loan | inventory_loans, inventory_stock, inventory_movements | inventory.loan_returned |
| CU-211 | Convertir préstamo en venta | inventory / sales | inventory.loan, sales.create | inventory_loans, sales, sale_items, sale_payments | inventory.loan_converted_to_sale |
| CU-506 | Completar apartado y generar venta | layaways / sales | layaways.payment | layaways, sales, sale_items, inventory_movements | layaway.completed, sale.created |
| CU-707 | Resolver retorno proveedor con reemplazo | suppliers / inventory | supplier_returns.resolve | supplier_returns, supplier_return_items, inventory_movements | supplier_return.resolved |

---

# Complemento v5 - Casos de uso ajustados

| Codigo | Caso de uso | Modulo | Permiso | Regla principal |
|---|---|---|---|---|
| CU-305 | Usar saldo a favor en venta | customers/sales | sales.create | FIFO + aplicaciones |
| CU-306 | Usar saldo a favor en apartado | customers/layaways | layaways.payment | FIFO + aplicaciones |
| CU-307 | Reembolsar saldo a favor | customers/cash | customers.balance_refund | Permiso, motivo, caja/auditoria |
| CU-406 | Anular venta con saldo usado | sales/customers | sales.void | Restaurar saldo usado |
| CU-708 | Cancelar retorno proveedor creado | suppliers | supplier_returns.resolve | Solo estado `created` |
| CU-709 | Resolver retorno sin compensacion | suppliers | supplier_returns.resolve | `compensation_type = none` |
| CU-710 | Corregir compra recibida | purchases/inventory | segun proceso | No cancelar directamente |
| CU-801 | Consultar utilidad estimada | reports | reports.sales.view | Utilidad operativa no contable |
