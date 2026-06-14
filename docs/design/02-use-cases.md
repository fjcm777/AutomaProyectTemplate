# 02 — Casos de Uso

> **Contexto del negocio:** Tienda de calzado y artículos complementarios (bolsos, accesorios, etc.).
> Venta directa al público — **no se manejan cotizaciones**.

## Actores del Sistema

| Actor | Descripción |
|-------|-------------|
| **Admin** | Acceso total al sistema |
| **Manager** | Supervisión, reportes y administración de clientes, sin gestión de usuarios |
| **Seller** | Ventas, cobro y consulta de clientes en punto de venta |
| **Cashier** | Cobro y registro de pagos |
| **Warehouse** | Gestión completa de inventario |
| **Purchasing** | Gestión de proveedores y órdenes de compra |
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

---

## INVENTORY — Inventario

> El inventario maneja calzado (con variantes de talla y color) y artículos complementarios.

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-101 | Warehouse / Admin | Crear, editar y desactivar productos |
| CU-102 | Warehouse / Admin | Gestionar categorías (calzado, bolsos, accesorios, etc.) |
| CU-103 | Warehouse / Admin | Gestionar variantes de producto (talla, color) |
| CU-104 | Warehouse | Registrar entrada de mercancía (desde orden de compra) |
| CU-105 | Warehouse | Registrar ajuste de inventario (+/-) |
| CU-106 | Warehouse | Registrar traslado entre bodegas |
| CU-107 | Warehouse | Ver stock actual por producto, variante y bodega |
| CU-108 | Admin | Configurar stock mínimo y alertas por producto |
| CU-109 | System | Descontar stock automáticamente al facturar |
| CU-110 | Admin | Ver kardex completo de movimientos por producto |

---

## SALES — Ventas y Facturación

> Venta directa en punto de venta. No se manejan cotizaciones.

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-201 | Seller | Crear factura de venta directa |
| CU-202 | Seller | Agregar productos por código, nombre o variante (talla/color) |
| CU-203 | Seller | Aplicar descuentos por línea o sobre el total |
| CU-204 | Seller | Seleccionar método de pago (contado / crédito / tarjeta / transferencia) |
| CU-205 | Seller / Cashier | Registrar pago de factura |
| CU-206 | Seller | Generar nota de crédito / devolución de producto |
| CU-207 | Seller / Admin | Anular factura (requiere motivo) |
| CU-208 | Admin | Configurar impuestos y series de factura |
| CU-209 | System | Descontar inventario automáticamente al emitir factura |
| CU-210 | System | Generar PDF de factura |

---

## CUSTOMERS — Clientes y Crédito

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-301 | Admin / Manager / Seller | Crear y editar cliente |
| CU-302 | Admin | Asignar límite de crédito |
| CU-303 | Admin | Aprobar o rechazar solicitud de crédito |
| CU-304 | Seller / Cashier | Registrar abono a cuenta del cliente |
| CU-305 | Seller | Ver estado de cuenta del cliente |
| CU-306 | Admin / Manager | Ver clientes con saldo vencido |
| CU-307 | System | Bloquear venta si cliente excede límite de crédito |
| CU-308 | Admin | Generar estado de cuenta para cliente |

---

## SUPPLIERS — Proveedores

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-401 | Admin / Purchasing | Crear y editar proveedor |
| CU-402 | Purchasing | Crear orden de compra |
| CU-403 | Warehouse | Recibir mercancía contra orden de compra |
| CU-404 | Admin | Registrar factura de proveedor |
| CU-405 | Admin | Registrar pago a proveedor |
| CU-406 | Admin / Manager | Ver cuentas por pagar |
| CU-407 | Admin / Manager | Ver historial de compras por proveedor |

---

## REPORTS — Reportes

| ID | Actor | Caso de Uso |
|----|-------|-------------|
| CU-501 | Admin / Manager | Reporte de ventas por período, vendedor o producto |
| CU-502 | Admin / Manager | Reporte de inventario (stock actual y valorizado) |
| CU-503 | Admin / Manager | Reporte de cuentas por cobrar (CxC) |
| CU-504 | Admin / Manager | Reporte de cuentas por pagar (CxP) |
| CU-505 | Admin / Warehouse | Reporte de productos bajo stock mínimo |
| CU-506 | Admin / Warehouse | Reporte de movimientos de inventario |
| CU-507 | Admin / Manager | Dashboard general con KPIs |
