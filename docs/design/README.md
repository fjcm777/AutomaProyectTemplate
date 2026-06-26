# Documentación de Diseño del Sistema

> Proyecto: **Sistema de Gestión Modular — Calzado Norita**  
> Stack base: **FastAPI + React + TypeScript + PostgreSQL + Docker**  
> Estado: Diseño funcional y técnico en evolución

---

## Objetivo

Esta carpeta contiene la documentación base para diseñar, implementar y mantener el sistema de gestión modular de la tienda.

El sistema está orientado a una tienda de calzado y artículos complementarios. El negocio maneja:

- Venta en efectivo.
- Venta por transferencia bancaria.
- Venta con tarjeta.
- Venta a crédito.
- Venta por sistema de apartado.
- Gestión de inventario por producto, variante, talla, color y bodega.
- Clientes, proveedores, compras, pagos, reportes y futura contabilidad.

No se manejan cotizaciones en la primera versión.

---

## Documentos

| Documento | Propósito |
|-----------|-----------|
| [`01-architecture.md`](./01-architecture.md) | Arquitectura general del sistema, stack, módulos y convenciones |
| [`02-use-cases.md`](./02-use-cases.md) | Casos de uso por módulo y actor |
| [`03-database.md`](./03-database.md) | Modelo de datos, ERD, SQL sugerido y decisiones de diseño |
| [`04-auth-rbac.md`](./04-auth-rbac.md) | Autenticación, autorización, roles y permisos |
| [`05-modules.md`](./05-modules.md) | Estructura recomendada de módulos backend/frontend |

---

## Módulos funcionales

| Módulo | Descripción |
|--------|-------------|
| `auth` | Autenticación JWT, usuarios, roles, permisos y auditoría |
| `inventory` | Productos, categorías, variantes, tallas, colores, bodegas, stock, reservas y movimientos |
| `sales` | Venta en efectivo, crédito, tarjeta, transferencia, sistema de apartado, facturación, pagos y notas de crédito |
| `customers` | Clientes, crédito, estado de cuenta y abonos |
| `suppliers` | Proveedores, órdenes de compra, recepción de mercancía, devoluciones y pagos |
| `reports` | Reportes operativos, financieros, inventario, auditoría y dashboard |
| `accounting` | Plan de cuentas, reglas contables, asientos y reportes financieros. Módulo propuesto para fase futura |

---

## Infraestructura interna

Además de los módulos funcionales, el sistema contempla piezas internas que no son visibles para usuarios finales:

| Componente | Descripción |
|------------|-------------|
| `shared/events` | Registro y procesamiento interno de eventos de dominio para desacoplar módulos |
| `shared/audit` | Soporte para auditoría de acciones sensibles |
| `shared/notifications` | Notificaciones internas, por ejemplo alertas de apartados vencidos |

Los eventos de integración no deben tratarse como módulo funcional. Su propósito es permitir que ventas, inventario, clientes, proveedores, reportes y contabilidad futura se comuniquen sin acoplarse directamente.

---

## Estado del diseño

| Área | Estado |
|------|--------|
| Arquitectura modular | Definida |
| Casos de uso principales | Definidos |
| Sistema de apartado | Definido a nivel funcional y modelo de datos |
| Base de datos inicial | Definida |
| Auth/RBAC | Definido |
| Contabilidad | Documentada como módulo futuro |
| Eventos internos | Recomendados como infraestructura interna |
| Wireframes/mockups | Pendiente |
| Implementación | Pendiente / en progreso |

---

## Reglas importantes del diseño

1. El sistema usa un **monolito modular** con organización por dominio.
2. Cada módulo debe mantener separación clara por capas.
3. Las ventas por apartado reservan inventario, no lo descuentan definitivamente hasta completar el proceso definido.
4. La modalidad de venta no debe confundirse con el método de pago.
5. Las facturas, pagos, devoluciones, apartados y movimientos de stock deben anularse o revertirse; no eliminarse físicamente.
6. Los eventos internos deben usarse para preparar integraciones futuras, especialmente contabilidad.
7. La contabilidad puede implementarse después, siempre que desde ahora se documenten los eventos necesarios.


---

## Observaciones incorporadas al diseño

| Observación | Estado |
|-------------|--------|
| Devoluciones sobre ventas deben afectar inventario y contabilidad | Aplicable |
| Seller debe consultar productos disponibles | Aplicable |
| Conciliación bancaria | Aplicable como **(Segunda etapa)** |
| CU-601 debe nombrarse “Gestionar catálogo de cuentas contables” | Aplicable |
| Proceso de cierre contable | Aplicable como **(Segunda etapa)** |

Los procesos marcados como **(Segunda etapa)** forman parte del diseño general, pero no son obligatorios para el MVP.


---

## Arqueo de caja

Se incorpora el proceso de arqueo de caja dentro de ventas. El sistema debe soportar cortes de caja antes del final del día calendario usando `business_date`.

| Concepto | Descripción |
|----------|-------------|
| `created_at` | Fecha y hora real del registro |
| `business_date` | Fecha operativa usada para ventas, caja, reportes y cortes |

El arqueo pertenece a primera etapa como control operativo. Los asientos por sobrantes/faltantes pueden quedar para segunda etapa.


---

## Ajustes pendientes integrados: mercadería prestada, dañada y retorno a proveedor

Se incorporan tres procesos adicionales:

| Proceso | Módulo principal | Descripción |
|---|---|---|
| Mercadería prestada | Inventario | Producto entregado temporalmente a una persona de confianza; puede regresar o convertirse en venta |
| Registrar mercadería dañada | Inventario | Producto no disponible para venta por daño, defecto o deterioro |
| Retorno a proveedor | Proveedores | Mercadería devuelta al proveedor con posible crédito, reemplazo o reembolso |
