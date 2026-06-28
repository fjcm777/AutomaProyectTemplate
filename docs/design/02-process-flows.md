# 02 - Process Flows

Proyecto: **Automata**  
Negocio: **Calzado Norita**  
Fecha de actualizacion: 2026-06-28

## 1. Objetivo

Este documento describe los flujos principales de negocio para Automata. Los flujos sirven como base para casos de uso, diseno de API, validaciones, pruebas y desarrollo.

## 2. Venta de contado

1. Usuario inicia nueva venta.
2. Sistema valida caja abierta y `business_date`.
3. Usuario selecciona cliente, si aplica.
4. Usuario agrega productos/variantes y cantidades.
5. Sistema valida disponibilidad.
6. Sistema calcula total.
7. Usuario registra metodo de pago.
8. Backend crea venta, detalle, pago, movimiento de caja e inventario en una transaccion.
9. Sistema emite evento `sale.created`.
10. Sistema registra auditoria si aplica.
11. Sistema muestra comprobante o resumen.

Reglas:
- No vender si no hay inventario disponible.
- No crear venta si no hay caja requerida abierta.
- Si falla inventario, pago o caja, se revierte toda la operacion.

## 3. Venta a credito

1. Usuario inicia venta a credito.
2. Sistema valida cliente.
3. Sistema valida si el cliente tiene deuda pendiente.
4. Si tiene deuda pendiente, requiere permiso/autorizacion especial.
5. Usuario agrega productos.
6. Sistema valida disponibilidad.
7. Usuario registra abono inicial opcional.
8. Sistema crea venta, saldo pendiente, pago inicial si existe, movimiento de inventario y caja en transaccion.
9. Sistema emite evento `sale.credit_created`.

## 4. Abono a credito de cliente

1. Usuario busca cliente o venta a credito.
2. Sistema muestra saldo pendiente.
3. Usuario registra monto y metodo de pago.
4. Sistema valida caja si el metodo afecta caja.
5. Sistema registra abono, actualiza saldo y movimiento de caja.
6. Si el saldo llega a cero, marca credito como pagado/cerrado.
7. Sistema emite evento `customer_payment.received`.

## 5. Creacion de apartado

1. Usuario selecciona cliente.
2. Usuario agrega productos/variantes.
3. Sistema valida disponibilidad.
4. Usuario registra abono inicial.
5. Sistema valida minimo requerido.
6. Sistema reserva inventario.
7. Sistema crea apartado, pago, movimiento de caja y reserva en transaccion.
8. Sistema emite evento `layaway.created`.

## 6. Pago de apartado

1. Usuario busca apartado activo.
2. Sistema muestra saldo pendiente.
3. Usuario registra abono.
4. Sistema registra pago y movimiento de caja.
5. Si el apartado queda completamente pagado, se marca como completado.
6. Sistema emite evento `layaway.payment_received` o `layaway.completed`.

## 7. Cambio de producto en apartado

1. Usuario solicita cambio de producto.
2. Sistema valida permiso si aplica.
3. Sistema cancela la reserva actual.
4. Sistema libera inventario anterior.
5. Sistema conserva el efectivo abonado como saldo a favor del cliente.
6. Usuario crea nuevo apartado.
7. Sistema aplica saldo a favor al nuevo apartado.
8. Sistema registra auditoria y eventos.

Regla: no se cambia directamente el producto del apartado original.

## 8. Cancelacion o vencimiento de apartado

1. Sistema o usuario identifica apartado vencido/cancelado.
2. Usuario define resolucion segun reglas del negocio.
3. Sistema libera inventario.
4. Si se conserva abono, genera saldo a favor.
5. Sistema registra auditoria y evento.
6. Apartado queda cerrado/resuelto.

## 9. Uso de saldo a favor

1. Usuario selecciona cliente.
2. Sistema muestra saldo a favor disponible.
3. Usuario inicia venta o apartado.
4. Sistema permite aplicar saldo.
5. Sistema registra aplicacion del saldo y actualiza saldo disponible.
6. Sistema mantiene trazabilidad del origen y uso del saldo.

## 10. Devolucion sobre venta

1. Usuario busca venta original.
2. Sistema valida que la venta sea valida para devolucion.
3. Usuario selecciona productos a devolver.
4. Usuario registra motivo.
5. Usuario selecciona metodo de devolucion.
6. Sistema devuelve dinero en el momento.
7. Sistema ajusta inventario si el producto vuelve a estar disponible.
8. Sistema registra devolucion, movimiento de caja/banco si aplica, inventario, auditoria y evento en transaccion.

Reglas:
- No genera saldo a favor del cliente.
- El metodo de devolucion puede ser distinto al metodo de pago original.
- El metodo usado debe quedar registrado.
- Debe relacionarse con la venta original.

## 11. Anulacion de venta

1. Usuario busca venta.
2. Sistema valida mismo `business_date`.
3. Sistema valida permiso `sales.void`.
4. Usuario registra motivo.
5. Sistema revierte venta, pagos, inventario y caja en transaccion.
6. Sistema registra auditoria y evento `sale.voided`.

## 12. Apertura, arqueo y cierre de caja

### Apertura

1. Usuario abre caja.
2. Sistema registra monto inicial y `business_date`.
3. Caja queda disponible para operaciones.

### Arqueo

1. Usuario revisa movimientos y efectivo esperado.
2. Usuario registra conteo real.
3. Sistema calcula diferencia.
4. Si hay diferencia, requiere motivo.

### Cierre

1. Usuario solicita cierre.
2. Sistema valida movimientos.
3. Sistema registra cierre, diferencia y auditoria.
4. Caja queda cerrada para ese `business_date`.

## 13. Venta posterior al cierre

1. Usuario intenta registrar venta despues de cerrar caja.
2. Sistema detecta que caja del `business_date` actual esta cerrada.
3. Sistema solicita confirmacion para abrir o usar caja del siguiente `business_date`.
4. Si usuario confirma, la operacion se registra en el siguiente `business_date`.
5. Si usuario cancela, no se registra venta.

## 14. Mercaderia prestada

1. Usuario selecciona producto/variante.
2. Sistema valida disponibilidad.
3. Usuario registra persona responsable o cliente.
4. Sistema registra salida como mercaderia prestada.
5. Inventario deja de estar disponible.
6. Sistema registra auditoria y evento.

## 15. Devolucion de mercaderia prestada

1. Usuario busca prestamo.
2. Usuario registra devolucion.
3. Sistema devuelve inventario a disponible, salvo que este danado.
4. Sistema cierra prestamo y registra evento.

## 16. Conversion de mercaderia prestada en venta

1. Usuario busca prestamo.
2. Usuario elige convertir a venta de contado o credito.
3. Sistema crea venta relacionada.
4. No descuenta inventario dos veces.
5. Sistema registra pago o saldo.
6. Sistema cierra prestamo.
7. Sistema registra auditoria y evento.

## 17. Mercaderia danada y baja

1. Usuario registra producto/variante danada.
2. Sistema mueve cantidad a estado o bodega no vendible.
3. Sistema descuenta disponibilidad.
4. Sistema registra motivo, auditoria y evento.
5. Para baja definitiva, se valida permiso especial y se registra motivo.

## 18. Retorno a proveedor

1. Usuario selecciona proveedor.
2. Usuario selecciona productos a retornar.
3. Sistema separa inventario para retorno.
4. Usuario registra motivo y compensacion esperada.
5. Sistema registra salida de inventario y retorno.
6. Si genera credito, crea credito de proveedor.
7. Si hay reemplazo inmediato, registra entrada de reemplazo.
8. Sistema emite evento y auditoria.

## 19. Compra y recepcion de mercaderia

1. Usuario selecciona proveedor.
2. Usuario registra documento de proveedor, si existe.
3. Usuario agrega productos, cantidades y costos.
4. Sistema registra compra.
5. Sistema actualiza inventario.
6. Si la compra es de contado, registra pago.
7. Si es a credito, registra cuenta por pagar.
8. Sistema guarda costo historico.
9. Sistema emite evento `purchase.created`.

## 20. Limpieza, backups y jobs

- Los jobs podran limpiar `audit_logs` y `business_events` segun politica de retencion.
- Los backups deben incluir PostgreSQL y carpeta uploads.
- Antes de actualizar el sistema debe existir backup reciente.
