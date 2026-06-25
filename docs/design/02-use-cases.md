# 02 — Casos de Uso

> **Contexto del negocio:** Tienda de calzado y artículos complementarios (bolsos, accesorios, etc.).
> Se manejan ventas en efectivo, ventas por transferencia bancaria, ventas con tarjeta, ventas a crédito y ventas por sistema de apartado. **No se manejan cotizaciones**.

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
| CU-106 | Warehouse | Registrar traslado entre bodegas |
| CU-107 | Warehouse / Admin / Manager | Ver stock actual por producto, variante y bodega |
| CU-108 | Admin | Configurar stock mínimo y alertas |
| CU-109 | System | Descontar stock automáticamente al facturar |
| CU-110 | Admin / Warehouse / Manager | Ver kardex completo |
| CU-111 | Warehouse / Admin | Registrar devolución de venta con movimiento de inventario |
| CU-112 | Warehouse / Admin | Revertir entrada de mercancía o recepción errónea |
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
| CU-205d | System | Alertar apartados vencidos cuando el cliente no complete el pago en máximo 2 meses |
| CU-205e | Seller / Cashier | Cerrar apartado pagado y generar factura o documento final según proceso definido |
| CU-206 | Seller | Generar nota de crédito / devolución |
| CU-206a | Seller / Admin / System | Registrar devolución de venta con movimiento de inventario y evento contable |
| CU-207 | Seller / Admin | Anular factura con motivo |
| CU-207a | Seller / Admin | Gestionar estados de factura |
| CU-208 | Admin | Configurar impuestos y series de factura |
| CU-209 | System | Descontar inventario al emitir factura |
| CU-210 | System | Generar PDF de factura |

### Modalidades de venta

| Modalidad | Descripción |
|-----------|-------------|
| **Venta en efectivo** | Venta pagada al momento. Incluye efectivo físico, transferencia bancaria y tarjeta |
| **Venta a crédito** | Venta entregada al cliente con saldo pendiente, sujeta a límite de crédito |
| **Venta por apartado** | El cliente selecciona productos, paga un porcentaje inicial y cancela el saldo por partes en máximo 2 meses |

### Reglas de apartado

| Regla | Descripción |
|-------|-------------|
| Porcentaje inicial | Debe ser configurable por el negocio |
| Plazo máximo | 2 meses para completar el pago |
| Pagos parciales | Se permiten múltiples abonos |
| Inventario | Se reserva mientras el apartado esté activo |
| Vencimiento | Si no se completa el pago en 2 meses, se genera alerta |
| Liberación | La liberación de inventario por vencimiento debe ser configurable |
| Cierre | Al completar el pago, el apartado se convierte en venta cerrada/factura según el flujo definido |

### Reglas de devoluciones sobre ventas

| Regla | Descripción |
|-------|-------------|
| Movimiento de inventario | Toda devolución debe generar movimiento de inventario si el producto regresa físicamente |
| Evento contable | Toda devolución debe generar un evento interno para contabilidad |
| Nota de crédito | La devolución puede generar nota de crédito o reversa según política definida |
| Producto defectuoso | Si el producto no está disponible para reventa, debe registrarse sin incrementar stock disponible |
| Auditoría | Toda devolución debe registrar usuario, fecha, motivo y documento relacionado |

---

## CUSTOMERS — Clientes y Crédito

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-301 | Admin / Manager / Seller | Crear y editar cliente |
| CU-302 | Admin | Asignar límite de crédito |
| CU-303 | Admin | Aprobar o rechazar solicitud de crédito |
| CU-304 | Seller / Cashier | Registrar abono a cuenta del cliente |
| CU-305 | Seller / Cashier / Manager / Accountant | Ver estado de cuenta del cliente |
| CU-306 | Admin / Manager | Ver clientes con saldo vencido |
| CU-307 | System | Bloquear venta si cliente excede límite de crédito |
| CU-307a | System | Bloquear nuevas ventas y notificar al vendedor si supera límite de crédito |
| CU-308 | Admin | Generar estado de cuenta para cliente |
| CU-309 | Seller / Manager | Ver apartados activos, pagados y vencidos del cliente |

---

## SUPPLIERS — Proveedores

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-401 | Admin / Purchasing | Crear y editar proveedor |
| CU-402 | Purchasing | Crear orden de compra |
| CU-402a | Purchasing / Admin | Confirmar o rechazar orden de compra |
| CU-403 | Warehouse | Recibir mercancía contra orden de compra |
| CU-404 | Admin | Registrar factura de proveedor |
| CU-405 | Admin | Registrar pago a proveedor |
| CU-406 | Admin / Manager / Accountant | Ver cuentas por pagar |
| CU-407 | Admin / Manager / Purchasing | Ver historial de compras por proveedor |

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
| Catálogo de cuentas, reglas contables y asientos | Segunda etapa |
| Cierre contable formal | Segunda etapa |
| Conciliación bancaria | Segunda etapa |
