# 03 - Use Cases

Proyecto: **Automata**  
Negocio: **Calzado Norita**  
Fecha de actualizacion: 2026-06-28

## 1. Objetivo

Este documento define casos de uso principales para el MVP de Automata. Los casos de uso se organizan por bloques funcionales y sirven como base para API, frontend, pruebas y desarrollo asistido por IA.

## 2. Convenciones

Formato recomendado:

- Codigo.
- Nombre.
- Actor principal.
- Objetivo.
- Precondiciones.
- Flujo resumido.
- Reglas principales.
- Permisos sugeridos.
- Datos afectados.
- Eventos/auditoria.
- Etapa.

## 3. CU-000 - Autenticacion y seguridad

### CU-001 - Iniciar sesion

Actor: usuario del sistema.  
Objetivo: obtener acceso al sistema mediante credenciales validas.  
Precondiciones: usuario activo existente.  
Flujo resumido:
1. Usuario ingresa credenciales.
2. Backend valida usuario y contrasena.
3. Sistema genera token JWT.
4. Frontend guarda sesion segun estrategia definida.

Permisos: no aplica.  
Datos afectados: sesion/token.  
Eventos/auditoria: opcional para intentos fallidos repetidos.  
Etapa: MVP.

### CU-002 - Consultar usuario autenticado

Actor: usuario autenticado.  
Objetivo: obtener datos propios, roles y permisos.  
Precondiciones: token valido.  
Permisos: usuario autenticado.  
Etapa: MVP.

### CU-003 - Administrar roles y permisos

Actor: administrador.  
Objetivo: crear/modificar roles y asignar permisos.  
Reglas:
- Los permisos viven en DB.
- El backend valida permisos reales.
- El frontend solo oculta o muestra opciones.

Permisos sugeridos: `users.manage_roles`, `users.manage_permissions`.  
Auditoria: si.  
Etapa: MVP.

## 4. CU-100 - Productos e inventario

### CU-101 - Crear producto

Actor: administrador, gerente o usuario autorizado.  
Objetivo: registrar un producto base en catalogo.  
Reglas:
- Codigo personalizado alfanumerico.
- Marca desde MVP.
- Imagen principal como archivo, no binario en DB.
- Backend valida imagen y genera nombre seguro.

Permiso: `products.create`.  
Datos afectados: `products`, variantes.  
Evento: `product.created`.  
Etapa: MVP.

### CU-102 - Editar producto

Actor: usuario autorizado.  
Objetivo: modificar informacion del producto.  
Reglas:
- No romper historial de ventas.
- Productos con historial no se borran fisicamente.
- Imagen reemplazada debe validarse.

Permiso: `products.update`.  
Etapa: MVP.

### CU-103 - Desactivar producto

Actor: usuario autorizado.  
Objetivo: impedir nuevas ventas sin eliminar historial.  
Permiso: `products.deactivate`.  
Auditoria: si.  
Etapa: MVP.

### CU-104 - Consultar disponibilidad

Actor: vendedor, gerente, bodega.  
Objetivo: conocer stock disponible por categoria, segmento, talla, color, marca y bodega.  
Regla: disponibilidad resta apartados, prestados, danados y retornos a proveedor.  
Permiso: `inventory.view` o `products.view`.  
Etapa: MVP.

### CU-105 - Registrar entrada de inventario

Actor: bodega, compras.  
Objetivo: aumentar stock por compra, ajuste o recepcion.  
Reglas: debe generar movimiento y guardar costo si viene de compra.  
Permiso: `inventory.receive`.  
Auditoria: si.  
Etapa: MVP.

### CU-106 - Ajustar inventario

Actor: usuario autorizado.  
Objetivo: corregir existencias.  
Reglas: requiere motivo, permiso especial y auditoria.  
Permiso: `inventory.adjust`.  
Etapa: MVP.

### CU-107 - Registrar mercaderia danada

Actor: bodega o gerente.  
Objetivo: mover producto a estado no vendible.  
Permiso: `inventory.mark_damaged`.  
Auditoria: si.  
Etapa: MVP.

### CU-108 - Registrar mercaderia prestada

Actor: gerente o usuario autorizado.  
Objetivo: entregar producto sin registrar venta inmediata.  
Reglas: deja de estar disponible y puede convertirse en venta sin descontar inventario dos veces.  
Permiso: `inventory.loan`.  
Auditoria: si.  
Etapa: MVP.

## 5. CU-200 - Ventas, credito, apartados y devoluciones

### CU-201 - Crear venta de contado

Actor: vendedor/cajero.  
Objetivo: registrar venta pagada en el momento.  
Reglas: validar disponibilidad, registrar pago, descontar inventario y ejecutar en transaccion.  
Permiso: `sales.create`.  
Datos afectados: ventas, pagos, inventario, caja.  
Evento: `sale.created`.  
Etapa: MVP.

### CU-202 - Crear venta a credito

Actor: vendedor/cajero autorizado.  
Objetivo: registrar venta con saldo pendiente.  
Reglas: requiere cliente formal; deuda pendiente requiere permiso especial.  
Permiso: `sales.create`.  
Evento: `sale.credit_created`.  
Etapa: MVP.

### CU-203 - Registrar abono a credito

Actor: cajero.  
Objetivo: reducir saldo pendiente de cliente.  
Permiso: `sales.credit_payment`.  
Evento: `customer_payment.received`.  
Etapa: MVP.

### CU-204 - Anular venta

Actor: gerente o usuario autorizado.  
Objetivo: revertir venta por error operativo.  
Reglas: solo mismo `business_date`, requiere motivo, revierte inventario/pago/caja y no genera saldo a favor.  
Permiso: `sales.void`.  
Auditoria: si.  
Evento: `sale.voided`.  
Etapa: MVP.

### CU-205 - Registrar devolucion sobre venta

Actor: usuario autorizado.  
Objetivo: devolver producto vendido y dinero al cliente.  
Reglas:
- Devuelve dinero en el momento.
- No genera saldo a favor.
- Metodo de devolucion puede ser diferente al pago original.
- Debe relacionarse con venta original.
- Debe ejecutarse en transaccion.

Permiso: `sales.return`.  
Auditoria: si.  
Evento: `sale.returned`.  
Etapa: MVP.

### CU-206 - Crear apartado

Actor: vendedor/cajero.  
Objetivo: reservar producto con abono inicial.  
Reglas: reservar inventario, validar pago minimo configurable y fecha de vencimiento.  
Permiso: `layaways.create`.  
Evento: `layaway.created`.  
Etapa: MVP.

### CU-207 - Registrar pago de apartado

Actor: cajero.  
Objetivo: abonar a apartado activo.  
Permiso: `layaways.payment`.  
Evento: `layaway.payment_received`.  
Etapa: MVP.

### CU-208 - Cambiar producto apartado

Actor: usuario autorizado.  
Objetivo: reemplazar producto apartado por otro.  
Reglas: cancelar reserva actual, liberar inventario, generar saldo a favor, crear nuevo apartado y aplicar saldo.  
Permiso: `layaways.change_product`.  
Auditoria: si.  
Etapa: MVP.

### CU-209 - Cancelar apartado

Actor: usuario autorizado.  
Objetivo: cerrar apartado sin completar venta.  
Reglas: liberar inventario y generar saldo a favor si se conserva abono.  
Permiso: `layaways.cancel`.  
Auditoria: si.  
Etapa: MVP.

### CU-210 - Extender plazo de apartado

Actor: usuario autorizado.  
Objetivo: ampliar vencimiento del apartado.  
Permiso: `layaways.extend`.  
Auditoria: si.  
Etapa: MVP.

## 6. CU-300 - Caja

### CU-301 - Abrir caja

Actor: cajero/gerente.  
Objetivo: iniciar operaciones de caja para un `business_date`.  
Permiso: `cash.open`.  
Auditoria: si.  
Etapa: MVP.

### CU-302 - Registrar movimiento manual de caja

Actor: usuario autorizado.  
Objetivo: registrar entrada/salida no asociada a venta directa.  
Regla: requiere motivo.  
Permiso: `cash.manual_movement`.  
Auditoria: si.  
Etapa: MVP.

### CU-303 - Realizar arqueo y cerrar caja

Actor: cajero/gerente.  
Objetivo: cerrar caja del dia operativo.  
Permiso: `cash.close`.  
Auditoria: si.  
Evento: `cash.closed`.  
Etapa: MVP.

## 7. CU-400 - Compras, proveedores y procesos especiales

### CU-401 - Crear proveedor

Actor: usuario autorizado.  
Objetivo: registrar proveedor.  
Permiso: `suppliers.create`.  
Etapa: MVP.

### CU-402 - Registrar compra

Actor: compras/bodega.  
Objetivo: registrar recepcion de mercaderia.  
Reglas: actualiza inventario, guarda costo historico y puede ser contado o credito.  
Permiso: `purchases.create`.  
Evento: `purchase.created`.  
Etapa: MVP.

### CU-403 - Registrar pago a proveedor

Actor: usuario autorizado.  
Objetivo: abonar cuenta por pagar.  
Permiso: `purchases.pay_supplier`.  
Auditoria: si.  
Etapa: MVP.

### CU-404 - Registrar retorno a proveedor

Actor: usuario autorizado.  
Objetivo: devolver mercaderia al proveedor.  
Reglas: puede generar credito, reembolso, reemplazo o sin compensacion.  
Permiso: `suppliers.return_goods`.  
Auditoria: si.  
Evento: `supplier.return_created`.  
Etapa: MVP.

### CU-405 - Aplicar credito de proveedor

Actor: usuario autorizado.  
Objetivo: usar credito disponible.  
Regla: puede aplicarse parcialmente.  
Permiso: `suppliers.apply_credit`.  
Auditoria: si.  
Etapa: MVP.

## 8. CU-500 - Reportes

- CU-501 Reporte de disponibilidad. Permiso: `reports.inventory.view`.
- CU-502 Productos mas vendidos. Permiso: `reports.sales.view`.
- CU-503 Reporte de ventas. Permiso: `reports.sales.view`.
- CU-504 Creditos pendientes. Permiso: `reports.accounts_receivable.view`.
- CU-505 Reporte de caja. Permiso: `reports.cash.view`.

## 9. CU-600 - Contabilidad futura

### CU-601 - Generar asiento contable

Actor: contador.  
Objetivo: crear asiento contable desde eventos de negocio.  
Estado: futuro.  
Regla: el MVP debe guardar datos necesarios para esta etapa.

## 10. CU-700 - Configuracion, auditoria y jobs

### CU-701 - Configurar parametros base

Actor: administrador.  
Objetivo: modificar valores como moneda, plazo de apartado, pago minimo, retencion de logs/eventos.  
Permiso: `settings.update`.  
Auditoria: si para cambios sensibles.

### CU-702 - Ejecutar job de limpieza

Actor: sistema.  
Objetivo: limpiar registros antiguos de `audit_logs` y `business_events`.  
Regla: debe respetar politica de retencion.

### CU-703 - Ejecutar backup

Actor: administrador o sistema.  
Objetivo: respaldar PostgreSQL y uploads.  
Regla: debe existir backup antes de actualizaciones importantes.
