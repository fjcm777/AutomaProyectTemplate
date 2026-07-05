# 02 — Flujos de Procesos

## 1. Propósito del documento

Este documento describe los flujos principales de operación del sistema **Automata**.

Mientras `01-business-rules.md` define las reglas que no deben romperse, este documento explica cómo ocurren los procesos paso a paso.

El objetivo es que una persona del negocio, un desarrollador o una herramienta de IA pueda entender cómo debe comportarse el sistema antes de generar código, pantallas, endpoints o tablas.

---

## 2. Convenciones usadas en este documento

Cada flujo puede incluir:

```text
Objetivo
Actor principal
Precondiciones
Flujo principal
Reglas importantes
Datos afectados
Eventos sugeridos
```

Los actores funcionales se escriben en español, pero los nombres técnicos sugeridos pueden mantenerse en inglés en código y base de datos.

Ejemplo:

```text
Vendedor (seller)
Cajero (cashier)
Encargado de bodega (warehouse)
Responsable de compras (purchasing)
```

---

## 3. Flujo: Venta de contado

### Objetivo

Registrar una venta pagada en el momento por efectivo, transferencia o tarjeta.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
Existe una caja abierta o el sistema puede solicitar apertura de caja.
Los productos tienen inventario disponible.
El usuario tiene permiso para registrar ventas.
```

### Flujo principal

```text
1. El usuario inicia una nueva venta.
2. Selecciona productos, tallas, colores y cantidades.
3. El sistema valida disponibilidad real.
4. El sistema calcula subtotal, descuento si aplica y total.
5. El usuario selecciona método de pago: efectivo, transferencia o tarjeta.
6. El cliente paga.
7. El sistema registra la venta.
8. El sistema registra el pago.
9. El sistema descuenta inventario.
10. El sistema asocia la venta a la caja y al business_date correspondiente.
11. El sistema genera comprobante o factura según configuración.
```

### Reglas importantes

```text
La venta confirmada descuenta inventario.
La venta debe guardar costo histórico del producto vendido.
La venta debe asociarse a business_date.
La facturación legal debe ser configurable.
```

### Datos afectados

```text
sales
sale_items
payments
stock_movements
cash_sessions
```

### Eventos sugeridos

```text
factura_emitida
pago_cliente_recibido
inventario_descontado
```

---

## 4. Flujo: Venta a crédito

### Objetivo

Registrar una venta donde el cliente recibe el producto y queda con saldo pendiente.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
El cliente existe o se registra durante el proceso.
El usuario tiene permiso para vender a crédito.
Los productos tienen inventario disponible.
```

### Flujo principal

```text
1. El usuario selecciona el cliente.
2. El sistema consulta si el cliente tiene deuda pendiente o vencida.
3. Si existe deuda pendiente, el sistema puede requerir permiso especial.
4. El usuario selecciona productos, tallas, colores y cantidades.
5. El sistema valida disponibilidad.
6. El sistema calcula total.
7. El usuario registra abono inicial si existe.
8. El sistema registra la venta a crédito.
9. El sistema descuenta inventario.
10. El sistema registra el abono inicial como pago, si aplica.
11. El sistema crea saldo por cobrar por el monto pendiente.
12. El sistema genera comprobante.
```

### Reglas importantes

```text
La venta a crédito puede tener abono inicial.
Si el cliente tiene deuda pendiente, puede requerirse permiso especial.
El saldo pendiente debe quedar asociado al cliente.
El producto se descuenta del inventario al confirmar la venta.
```

### Datos afectados

```text
sales
sale_items
payments
customer_accounts
stock_movements
cash_sessions
```

### Eventos sugeridos

```text
factura_emitida
venta_credito_creada
pago_cliente_recibido
cuenta_por_cobrar_generada
```

---

## 5. Flujo: Registro de abono a crédito

### Objetivo

Registrar un pago parcial o total de una deuda de cliente.

### Actor principal

```text
Cajero
```

### Precondiciones

```text
El cliente tiene saldo pendiente.
El usuario tiene permiso para registrar pagos.
Existe caja abierta o se solicita apertura si aplica.
```

### Flujo principal

```text
1. El usuario busca al cliente.
2. El sistema muestra deudas activas.
3. El usuario selecciona la deuda o venta a pagar.
4. El usuario ingresa monto del abono.
5. El usuario selecciona método de pago.
6. El sistema registra el pago.
7. El sistema reduce el saldo pendiente.
8. Si el saldo llega a cero, el sistema marca la deuda como pagada.
9. El sistema asocia el pago a caja y business_date.
```

### Reglas importantes

```text
No se debe permitir aplicar abonos mayores al saldo sin registrar saldo a favor.
Todo abono debe tener método de pago.
Todo abono debe dejar trazabilidad para contabilidad futura.
```

### Datos afectados

```text
payments
customer_accounts
cash_sessions
```

### Eventos sugeridos

```text
pago_cliente_recibido
deuda_cliente_actualizada
```

---

## 6. Flujo: Creación de apartado

### Objetivo

Reservar productos para un cliente mediante un pago inicial.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
El cliente existe o se registra durante el proceso.
El producto tiene disponibilidad.
El usuario tiene permiso para crear apartados.
```

### Flujo principal

```text
1. El usuario selecciona o registra al cliente.
2. Selecciona productos, tallas, colores y cantidades.
3. El sistema valida disponibilidad real.
4. El sistema calcula total del apartado.
5. El sistema solicita pago inicial.
6. El pago inicial mínimo se valida según configuración.
7. El usuario registra fecha límite o usa plazo por defecto.
8. El sistema registra el apartado.
9. El sistema reserva inventario.
10. El sistema registra el pago inicial.
11. El sistema asocia el pago a caja y business_date.
```

### Reglas importantes

```text
El pago inicial mínimo debe ser configurable.
El plazo máximo del apartado debe ser configurable.
La reserva de inventario inicia al confirmar el apartado.
La mercadería apartada no está disponible para venta.
```

### Datos afectados

```text
layaways
layaway_items
payments
stock_reservations
cash_sessions
```

### Eventos sugeridos

```text
apartado_creado
pago_cliente_recibido
inventario_reservado
```

---

## 7. Flujo: Pago de apartado

### Objetivo

Registrar abonos posteriores a un apartado activo.

### Actor principal

```text
Cajero
```

### Precondiciones

```text
El apartado está activo.
El apartado tiene saldo pendiente.
El usuario tiene permiso para registrar pagos.
```

### Flujo principal

```text
1. El usuario busca el apartado por cliente, código o estado.
2. El sistema muestra saldo pendiente y fecha límite.
3. El usuario ingresa monto del abono.
4. El usuario selecciona método de pago.
5. El sistema registra el pago.
6. El sistema reduce el saldo pendiente.
7. Si el apartado queda totalmente pagado, el sistema lo marca como completado.
8. El sistema genera venta o documento final según configuración.
9. El sistema mantiene trazabilidad entre apartado, pagos y venta final.
```

### Reglas importantes

```text
Los pagos del apartado deben quedar asociados al cliente.
Si el apartado se completa, la reserva se consume.
El inventario no debe descontarse dos veces.
```

### Datos afectados

```text
layaways
payments
sales
stock_reservations
cash_sessions
```

### Eventos sugeridos

```text
pago_cliente_recibido
apartado_completado
factura_emitida
```

---

## 8. Flujo: Cambio de producto en apartado

### Objetivo

Manejar el caso donde un cliente desea cambiar el producto que tenía apartado.

### Decisión de negocio

Para simplificar el MVP, no se editarán directamente los productos del apartado original.

El cambio se maneja cancelando la reserva actual, conservando el efectivo como saldo a favor y creando un nuevo apartado.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
El apartado está activo.
El cliente desea cambiar producto, talla, color o cantidad.
El usuario tiene permiso para cancelar reserva y generar saldo a favor.
```

### Flujo principal

```text
1. El usuario abre el apartado original.
2. El usuario registra motivo del cambio.
3. El sistema cancela la reserva del apartado original.
4. El sistema libera el inventario reservado.
5. El sistema conserva el efectivo recibido.
6. El sistema registra el monto pagado como saldo a favor del cliente.
7. El usuario crea un nuevo apartado con el nuevo producto.
8. El sistema aplica el saldo a favor al nuevo apartado.
9. Si el nuevo apartado vale más, queda saldo pendiente.
10. Si el nuevo apartado vale menos, el saldo restante queda a favor del cliente o se devuelve según decisión del negocio.
11. Todo el proceso queda auditado.
```

### Reglas importantes

```text
No se debe perder trazabilidad del apartado original.
No se debe devolver dinero automáticamente.
El saldo a favor debe quedar asociado al cliente.
El inventario anterior debe liberarse antes de reservar el nuevo producto.
El nuevo apartado debe ser un registro independiente.
```

### Datos afectados

```text
layaways
layaway_items
stock_reservations
customer_credits
customer_credit_applications
payments
audit_logs
```

### Eventos sugeridos

```text
apartado_cancelado_por_cambio
saldo_cliente_generado
apartado_creado
saldo_cliente_aplicado
```

---

## 9. Flujo: Cancelación o vencimiento de apartado

### Objetivo

Resolver un apartado que venció o fue cancelado.

### Actor principal

```text
Vendedor / Cajero / Gerente
```

### Precondiciones

```text
El apartado está activo, vencido o pendiente de resolución.
El usuario tiene permiso para cancelar o resolver apartados.
```

### Flujo principal

```text
1. El sistema detecta o muestra apartados vencidos.
2. El usuario revisa el apartado.
3. El usuario elige resolución.
4. El sistema libera inventario reservado.
5. Si se devuelve dinero, registra devolución.
6. Si no se devuelve dinero, registra saldo a favor del cliente.
7. El sistema cambia estado del apartado.
8. El sistema guarda motivo y auditoría.
```

### Resoluciones permitidas

```text
Devolver abono al cliente.
Convertir abono en saldo a favor del cliente.
Extender plazo con permiso especial.
Cancelar apartado y liberar inventario.
```

### Datos afectados

```text
layaways
stock_reservations
customer_credits
payments
cash_sessions
audit_logs
```

### Eventos sugeridos

```text
apartado_vencido
apartado_cancelado
saldo_cliente_generado
inventario_liberado
```

---

## 10. Flujo: Uso de saldo a favor del cliente

### Objetivo

Permitir que un cliente use saldo disponible en ventas o apartados.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
El cliente tiene saldo a favor disponible.
El usuario tiene permiso para aplicar saldo.
```

### Flujo principal

```text
1. El usuario selecciona cliente.
2. El sistema muestra saldo a favor disponible.
3. El usuario crea una venta o apartado.
4. El usuario decide aplicar saldo a favor.
5. El sistema descuenta el saldo aplicado.
6. Si queda diferencia, el cliente paga o queda saldo pendiente según el proceso.
7. El sistema registra aplicación del saldo.
```

### Reglas importantes

```text
El saldo a favor no debe duplicarse.
Cada aplicación debe quedar trazada.
El saldo a favor puede aplicarse parcial o totalmente.
```

### Datos afectados

```text
customer_credits
customer_credit_applications
sales
layaways
payments
```

### Eventos sugeridos

```text
saldo_cliente_aplicado
```

---

## 11. Flujo: Arqueo y cierre de caja

### Objetivo

Comparar el efectivo esperado contra el efectivo contado y cerrar caja.

### Actor principal

```text
Cajero / Gerente
```

### Precondiciones

```text
Existe una sesión de caja abierta.
El usuario tiene permiso para realizar arqueo.
```

### Flujo principal

```text
1. El usuario abre pantalla de arqueo.
2. El sistema calcula montos esperados por método de pago.
3. El usuario ingresa efectivo contado.
4. El sistema calcula diferencia.
5. Si hay diferencia, el usuario registra motivo.
6. El sistema registra arqueo.
7. El usuario confirma cierre de caja.
8. El sistema cierra la sesión.
9. Las ventas posteriores deberán usar el siguiente business_date.
```

### Reglas importantes

```text
El cierre de caja puede ocurrir antes del final del día calendario.
El sistema debe diferenciar created_at de business_date.
Reabrir caja requiere permiso especial.
```

### Datos afectados

```text
cash_sessions
cash_counts
cash_movements
payments
audit_logs
```

### Eventos sugeridos

```text
arqueo_caja_realizado
caja_cerrada
diferencia_caja_registrada
```

---

## 12. Flujo: Venta posterior al cierre de caja

### Objetivo

Permitir ventas después del cierre de caja sin mezclarlas con el día operativo cerrado.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
La caja anterior está cerrada.
El usuario intenta registrar una nueva venta.
```

### Flujo principal

```text
1. El usuario intenta registrar una venta.
2. El sistema detecta que la caja del business_date anterior está cerrada.
3. El sistema muestra mensaje de confirmación.
4. El usuario confirma apertura de caja para el siguiente business_date.
5. El sistema crea o abre sesión de caja del siguiente día operativo.
6. El usuario registra la venta normalmente.
7. La venta queda asociada al nuevo business_date.
```

### Reglas importantes

```text
La apertura no debe ser silenciosa.
El usuario debe confirmar la apertura.
La venta no debe quedar asociada a una caja cerrada.
```

### Datos afectados

```text
cash_sessions
sales
payments
```

### Eventos sugeridos

```text
caja_abierta
venta_asignada_siguiente_dia_operativo
```

---

## 13. Flujo: Mercadería prestada

### Objetivo

Registrar la salida temporal de un producto entregado a una persona de confianza.

### Actor principal

```text
Vendedor / Encargado de bodega
```

### Precondiciones

```text
El producto tiene disponibilidad.
El usuario tiene permiso para registrar mercadería prestada.
```

### Flujo principal

```text
1. El usuario selecciona producto, talla, color y cantidad.
2. El sistema valida disponibilidad.
3. El usuario registra persona responsable.
4. Puede registrarse cliente existente o solo nombre/teléfono.
5. El usuario registra fecha esperada de devolución.
6. El sistema registra salida temporal.
7. El producto deja de estar disponible para venta.
```

### Reglas importantes

```text
La mercadería prestada no es venta.
Puede entregarse a una persona no registrada como cliente formal.
Debe tener responsable y fecha esperada de devolución.
```

### Datos afectados

```text
stock_reservations
stock_movements
```

### Eventos sugeridos

```text
mercaderia_prestada_registrada
```

---

## 14. Flujo: Devolución de mercadería prestada

### Objetivo

Registrar el retorno de mercadería prestada a la tienda.

### Actor principal

```text
Vendedor / Encargado de bodega
```

### Precondiciones

```text
Existe registro de mercadería prestada activa.
```

### Flujo principal

```text
1. El usuario busca registro de mercadería prestada.
2. El sistema muestra producto y responsable.
3. El usuario confirma devolución.
4. El usuario indica estado del producto.
5. Si está en buen estado, el sistema reincorpora inventario disponible.
6. Si está dañado, el sistema lo envía al flujo de mercadería dañada.
7. El sistema cierra el registro de préstamo.
```

### Reglas importantes

```text
La devolución debe indicar estado del producto.
La mercadería dañada no debe volver a inventario disponible.
```

### Datos afectados

```text
stock_reservations
stock_movements
warehouses
```

### Eventos sugeridos

```text
mercaderia_prestada_devuelta
mercaderia_danada_registrada
```

---

## 15. Flujo: Conversión de mercadería prestada en venta

### Objetivo

Convertir una mercadería prestada en una venta formal.

### Actor principal

```text
Vendedor / Cajero
```

### Precondiciones

```text
Existe mercadería prestada activa.
El responsable decide comprar el producto.
```

### Flujo principal

```text
1. El usuario abre el registro de mercadería prestada.
2. El sistema muestra producto y responsable.
3. El usuario confirma conversión en venta.
4. El sistema crea venta.
5. El sistema no descuenta inventario nuevamente.
6. El usuario registra pago de contado o venta a crédito.
7. El sistema marca el préstamo como consumido.
8. El sistema genera comprobante.
```

### Reglas importantes

```text
Puede convertirse en venta de contado o venta a crédito.
No debe descontar inventario dos veces.
Debe conservar relación entre préstamo y venta.
```

### Datos afectados

```text
stock_reservations
sales
sale_items
payments
customer_accounts
```

### Eventos sugeridos

```text
mercaderia_prestada_convertida_venta
factura_emitida
```

---

## 16. Flujo: Registro de mercadería dañada

### Objetivo

Marcar producto como dañado o no vendible.

### Actor principal

```text
Encargado de bodega
```

### Precondiciones

```text
El producto existe en inventario o viene de otro proceso.
El usuario tiene permiso para registrar mercadería dañada.
```

### Orígenes posibles

```text
Inventario normal
Devolución de cliente
Retorno de mercadería prestada
Compra recibida con defecto
```

### Flujo principal

```text
1. El usuario selecciona producto.
2. El usuario registra cantidad y motivo del daño.
3. El sistema mueve el producto a bodega no vendible.
4. El producto deja de aparecer como disponible para venta.
5. El sistema registra auditoría.
```

### Reglas importantes

```text
La mercadería dañada no puede venderse.
Debe conservarse motivo y origen del daño.
```

### Datos afectados

```text
stock_movements
warehouses
audit_logs
```

### Eventos sugeridos

```text
mercaderia_danada_registrada
```

---

## 17. Flujo: Baja de mercadería dañada

### Objetivo

Eliminar definitivamente del inventario controlado un producto dañado.

### Actor principal

```text
Gerente / Administrador / Encargado de bodega autorizado
```

### Precondiciones

```text
La mercadería está registrada como dañada.
El usuario tiene permiso especial.
```

### Flujo principal

```text
1. El usuario selecciona mercadería dañada.
2. El sistema solicita motivo de baja.
3. El usuario confirma baja.
4. El sistema registra salida definitiva.
5. El sistema guarda auditoría.
```

### Reglas importantes

```text
Dar de baja requiere permiso especial.
No debe realizarse sin motivo.
```

### Datos afectados

```text
stock_movements
audit_logs
```

### Eventos sugeridos

```text
mercaderia_danada_dada_baja
```

---

## 18. Flujo: Retorno a proveedor

### Objetivo

Registrar mercadería que la tienda devolverá al proveedor.

### Actor principal

```text
Responsable de compras / Encargado de bodega
```

### Precondiciones

```text
Existe proveedor.
Existe producto a retornar.
El usuario tiene permiso para registrar retorno.
```

### Flujo principal

```text
1. El usuario selecciona proveedor.
2. Selecciona productos, cantidades y motivo.
3. El sistema valida cantidades disponibles.
4. El sistema separa la mercadería del inventario disponible.
5. El sistema registra retorno en estado pendiente.
6. Cuando se entrega físicamente al proveedor, el sistema registra salida.
7. El retorno queda pendiente de compensación.
8. Luego se registra crédito, reembolso, reemplazo o sin compensación.
```

### Reglas importantes

```text
El retorno puede quedar pendiente antes de entregar físicamente.
El producto separado para retorno no está disponible para venta.
```

### Datos afectados

```text
purchase_returns
purchase_return_items
stock_movements
stock_reservations
```

### Eventos sugeridos

```text
retorno_proveedor_creado
retorno_proveedor_enviado
```

---

## 19. Flujo: Reemplazo inmediato por proveedor

### Objetivo

Registrar que el proveedor recibe mercadería retornada y entrega producto de reemplazo en el momento.

### Actor principal

```text
Responsable de compras / Encargado de bodega
```

### Precondiciones

```text
Existe retorno a proveedor.
El proveedor entrega mercadería de reemplazo.
```

### Flujo principal

```text
1. El usuario abre el retorno a proveedor.
2. Registra que la compensación será reemplazo.
3. El sistema confirma salida de la mercadería retornada.
4. El usuario registra producto recibido como reemplazo.
5. El producto recibido puede ser el mismo o uno diferente.
6. El sistema registra entrada de inventario.
7. El sistema guarda costo o valor reconocido.
8. El retorno queda cerrado como reemplazado.
```

### Reglas importantes

```text
Si hay reemplazo inmediato, no se crea crédito pendiente.
El producto recibido puede ser distinto, siempre que se registre la equivalencia o valor reconocido.
Si existe diferencia de valor, debe registrarse como saldo, crédito o ajuste.
```

### Datos afectados

```text
purchase_returns
purchase_return_items
stock_movements
inventory_receipts
```

### Eventos sugeridos

```text
retorno_proveedor_enviado
mercaderia_reemplazo_recibida
```

---

## 20. Flujo: Crédito a favor con proveedor

### Objetivo

Registrar un saldo a favor que el proveedor reconoce a la tienda.

### Actor principal

```text
Responsable de compras
```

### Precondiciones

```text
Existe retorno a proveedor aceptado.
El proveedor reconoce crédito a favor.
```

### Flujo principal

```text
1. El usuario abre el retorno a proveedor.
2. Registra monto reconocido por el proveedor.
3. El sistema crea crédito a favor.
4. El crédito queda disponible para compras futuras.
5. Cuando se use, el usuario aplica parte o todo el crédito.
6. El sistema reduce el saldo disponible del crédito.
```

### Reglas importantes

```text
El crédito puede aplicarse parcial o totalmente.
Debe conservar saldo inicial, aplicado y restante.
```

### Datos afectados

```text
supplier_credits
supplier_credit_applications
purchase_returns
```

### Eventos sugeridos

```text
credito_proveedor_generado
credito_proveedor_aplicado
```

---

## 21. Flujo: Compra o recepción de mercadería

### Objetivo

Registrar entrada de mercadería comprada a proveedor.

### Actor principal

```text
Responsable de compras / Encargado de bodega
```

### Precondiciones

```text
Existe proveedor o se registra durante el proceso.
El usuario tiene permiso para registrar compras o recepciones.
```

### Flujo principal

```text
1. El usuario selecciona proveedor.
2. Registra documento de proveedor si existe.
3. Registra productos, tallas, colores, cantidades y costos.
4. El sistema valida datos mínimos.
5. El sistema registra compra o recepción.
6. El sistema actualiza inventario.
7. El sistema guarda costo histórico por producto recibido.
8. El sistema conserva trazabilidad para cuentas por pagar o contabilidad futura.
```

### Qué significa guardar costo histórico

El sistema debe guardar cuánto costó realmente cada producto cuando entró al inventario.

Esto permite calcular utilidad, costo de venta, valor de inventario y reportes históricos aunque el costo cambie después.

### Documento de proveedor

Si el proveedor entrega factura, recibo, nota de entrega, referencia o cualquier comprobante, el sistema debe permitir registrarlo.

Si no existe documento formal, la compra puede registrarse con referencia interna y notas.

### Reglas importantes

```text
El costo histórico no debe perderse.
El costo de una venta antigua no debe recalcularse usando costos futuros.
El documento de proveedor es opcional, pero recomendado para trazabilidad.
```

### Datos afectados

```text
purchases
purchase_items
stock_movements
products
suppliers
```

### Eventos sugeridos

```text
orden_compra_recibida
inventario_incrementado
```

---

## 22. Flujo: Devolución sobre venta

### Objetivo

Registrar que un cliente devuelve producto vendido.

### Actor principal

```text
Vendedor / Cajero / Gerente
```

### Precondiciones

```text
Existe venta original.
El usuario tiene permiso para registrar devolución.
```

### Flujo principal

```text
1. El usuario busca venta original.
2. El sistema muestra productos vendidos.
3. El usuario selecciona producto devuelto.
4. El usuario registra motivo.
5. El usuario indica estado del producto.
6. Si el producto está en buen estado, puede volver a inventario disponible.
7. Si el producto está dañado, se registra como mercadería dañada.
8. El sistema registra devolución.
9. El usuario decide si devuelve dinero o genera saldo a favor del cliente.
10. El sistema guarda auditoría.
```

### Reglas importantes

```text
Devolución sobre venta no es lo mismo que retorno a proveedor.
El producto devuelto no siempre vuelve a inventario disponible.
El dinero puede devolverse o convertirse en saldo a favor.
```

### Datos afectados

```text
sales
sale_items
sales_returns
sales_return_items
stock_movements
customer_credits
payments
audit_logs
```

### Eventos sugeridos

```text
devolucion_venta_registrada
saldo_cliente_generado
mercaderia_danada_registrada
```

---

## 23. Resumen de decisiones importantes

```text
El cambio de producto en apartado se maneja cancelando la reserva actual y generando saldo a favor.
La venta a crédito puede tener abono inicial.
El pago inicial del apartado es configurable.
El plazo del apartado es configurable.
Después del cierre de caja, el sistema solicita confirmación para abrir caja del siguiente business_date.
La mercadería prestada puede registrarse con persona no formalmente registrada como cliente.
La mercadería prestada puede convertirse en venta de contado o crédito.
La mercadería dañada puede originarse en distintos procesos.
El retorno a proveedor puede quedar pendiente antes de la entrega física.
La compra a proveedor debe guardar costo histórico y documento de proveedor si existe.
La devolución sobre venta puede devolver dinero o generar saldo a favor.
```
