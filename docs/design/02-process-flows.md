# 02 - Process Flows

## Venta de contado

1. Usuario selecciona productos.
2. Sistema valida inventario disponible.
3. Sistema calcula subtotal, descuento, impuesto y total.
4. Usuario registra pago.
5. Sistema crea venta.
6. Sistema crea detalle de venta.
7. Sistema descuenta inventario.
8. Sistema registra pago.
9. Si el método afecta caja, registra movimiento de caja.
10. Sistema registra evento interno.

## Venta a crédito

1. Usuario selecciona cliente.
2. Usuario selecciona productos.
3. Sistema valida inventario.
4. Sistema registra abono inicial si existe.
5. Sistema crea venta tipo crédito.
6. Sistema calcula saldo pendiente.
7. Sistema descuenta inventario.
8. Sistema registra pagos y caja si aplica.

## Abono a crédito

1. Usuario selecciona venta pendiente.
2. Usuario registra monto y método de pago.
3. Sistema valida saldo pendiente.
4. Sistema registra pago.
5. Sistema actualiza saldo de venta.
6. Si el método afecta caja, registra movimiento de caja.

## Creación de apartado

1. Usuario selecciona cliente.
2. Usuario selecciona productos.
3. Sistema valida inventario disponible.
4. Sistema toma plazo y pago mínimo desde `settings`.
5. Sistema registra apartado.
6. Sistema reserva inventario.
7. Sistema registra pago inicial si aplica.

## Pago de apartado

1. Usuario selecciona apartado activo.
2. Usuario registra pago.
3. Sistema actualiza saldo del apartado.
4. Si el apartado queda pagado, puede completarse.
5. Al completarse, se genera venta en `sales`.

## Completar apartado

1. Cliente termina de pagar.
2. Sistema marca apartado como completado.
3. Sistema genera venta relacionada al apartado.
4. La venta usa `source_type = layaway` y `source_id = layaway.id`.
5. El inventario reservado se convierte correctamente en salida de venta sin descontar dos veces.

## Cancelación o vencimiento de apartado

1. Sistema o usuario marca apartado como cancelado o vencido.
2. Se libera inventario reservado.
3. Si se conserva abono, se genera saldo a favor.
4. Se registra movimiento de saldo a favor.

## Cambio de producto apartado

1. Se cancela la reserva actual.
2. Se libera inventario.
3. Se conserva el abono como saldo a favor si aplica.
4. Se crea nuevo apartado.
5. Se aplica saldo a favor al nuevo apartado.

## Cierre de caja

1. Usuario cuenta efectivo físico.
2. Sistema calcula monto esperado.
3. Usuario registra monto contado.
4. Sistema calcula diferencia.
5. Sistema cierra sesión de caja.
6. Se registra auditoría y evento.

## Retorno a proveedor pendiente

1. Usuario identifica producto a retornar.
2. Producto se separa como no vendible o se envía al proveedor.
3. Producto deja de estar disponible.
4. Retorno queda pendiente de compensación.
5. Días después se resuelve como crédito, reembolso, reemplazo o sin compensación.
6. Si hay reemplazo, se registra entrada relacionada al retorno original.

## Compra o recepción de mercadería

1. Usuario registra proveedor.
2. Usuario registra productos, cantidades y costos.
3. Sistema registra compra.
4. Al recibir, sistema genera entrada de inventario.
5. Si es crédito, queda saldo pendiente con proveedor.
6. Si se paga, se registran pagos a proveedor.

## Limpieza de auditoría y eventos

Los jobs pueden limpiar registros antiguos según políticas de retención configuradas en `settings`.
