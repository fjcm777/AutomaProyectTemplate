# 03 - Use Cases

## Convención

Cada caso de uso debe documentarse con:

- Código.
- Actor.
- Objetivo.
- Precondiciones.
- Flujo resumido.
- Reglas.
- Permisos.
- Datos afectados.
- Eventos.
- Etapa.

## CU-000 Autenticación y seguridad

### CU-001 Iniciar sesión

Actor: usuario del sistema.  
Permiso: ninguno.  
Regla: el login se realiza únicamente con `username` y contraseña.

### CU-002 Consultar usuario actual

Actor: usuario autenticado.  
Regla: devuelve usuario, roles y permisos.

### CU-003 Cerrar sesión

Actor: usuario autenticado.  
Regla: el frontend elimina el token de `sessionStorage`.

## CU-100 Productos e inventario

### CU-101 Crear producto

Permiso: `products.create`.

Reglas:

- Producto tiene código personalizado único.
- Puede tener imagen principal.
- Puede tener variantes por talla y color.
- No registra inventario por sí mismo.

### CU-102 Crear variante

Permiso: `products.update`.

Reglas:

- Variante pertenece a producto.
- Combinación producto/talla/color no debe duplicarse.
- Puede tener `sale_price_override`.

### CU-103 Consultar disponibilidad

Permiso: `inventory.view`.

Regla: disponibilidad se consulta desde inventario, no desde productos.

### CU-104 Ajustar inventario

Permiso: `inventory.adjust`.

Regla: todo ajuste genera movimiento de inventario y requiere motivo.

### CU-105 Marcar mercadería dañada

Permiso: `inventory.mark_damaged`.

Regla: deja de estar disponible, pero no se da de baja automáticamente.

### CU-106 Dar de baja inventario

Permiso: `inventory.writeoff`.

Regla: requiere permiso especial y auditoría.

### CU-107 Registrar mercadería prestada

Permiso: `inventory.loan`.

Regla: no es venta y deja de estar disponible.

## CU-200 Ventas, crédito, apartados y devoluciones

### CU-201 Crear venta de contado

Permiso: `sales.create`.

Reglas:

- Descuenta inventario.
- Registra pago.
- Registra caja si método afecta efectivo.
- Copia impuesto aplicado desde `settings`.

### CU-202 Crear venta a crédito

Permiso: `sales.credit_create`.

Regla: puede quedar saldo pendiente.

### CU-203 Registrar abono a crédito

Permiso: `sales.credit_payment`.

### CU-204 Anular venta

Permiso: `sales.void`.

Reglas:

- Solo mismo `business_date`.
- Requiere motivo.
- Revierte inventario, pagos y caja.
- No genera saldo a favor.

### CU-205 Registrar devolución sobre venta

Permiso: `sales.return`.

Reglas:

- Devuelve dinero en el momento.
- No genera saldo a favor.
- Método de devolución puede ser distinto al original.

### CU-206 Crear apartado

Permiso: `layaways.create`.

Regla: reserva inventario.

### CU-207 Completar apartado

Permiso: `layaways.payment`.

Regla: genera venta en `sales`.

## CU-300 Caja

### CU-301 Abrir caja

Permiso: `cash.open`.

### CU-302 Cerrar caja

Permiso: `cash.close`.

Regla: calcula esperado, contado y diferencia.

### CU-303 Movimiento manual de caja

Permiso: `cash.manual_movement`.

## CU-400 Compras y proveedores

### CU-401 Crear proveedor

Permiso: `suppliers.create`.

### CU-402 Crear compra

Permiso: `purchases.create`.

### CU-403 Recibir compra

Permiso: `purchases.create`.

Regla: genera entrada de inventario.

### CU-404 Registrar retorno a proveedor

Permiso: `supplier_returns.create`.

Regla: puede quedar pendiente.

### CU-405 Resolver retorno a proveedor

Permiso: `supplier_returns.resolve`.

Regla: puede generar crédito, reembolso, reemplazo o sin compensación.

## CU-500 Reportes

Reportes MVP:

- Ventas por `business_date`.
- Inventario disponible.
- Stock bajo.
- Créditos pendientes.
- Apartados activos o vencidos.
- Caja.
- Compras.
- Retornos a proveedor pendientes.

## CU-600 Contabilidad futura

La contabilidad completa queda fuera del MVP, pero el sistema guardará trazabilidad suficiente.

## CU-700 Configuración, auditoría y jobs

Incluye:

- `settings`.
- `exchange_rates`.
- Auditoría selectiva.
- Eventos internos.
- Jobs de limpieza y detección.
