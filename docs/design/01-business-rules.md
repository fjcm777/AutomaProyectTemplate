# 01 — Reglas de Negocio

## 1. Propósito del documento

Este documento define las reglas de negocio que deben respetarse en el sistema **Automata**.

Las reglas aquí descritas sirven como guía para diseño de base de datos, desarrollo backend, desarrollo frontend, validaciones, permisos, reportes, auditoría, integración contable futura y uso de inteligencia artificial para generar código.

Estas reglas son independientes de la tecnología. El sistema puede cambiar internamente, pero las reglas del negocio deben mantenerse consistentes.

---

## 2. Principios generales

Automata debe respetar los siguientes principios:

```text
La disponibilidad de inventario debe ser confiable.
Toda operación sensible debe quedar auditada.
Los roles deben ser dinámicos.
La autorización debe hacerse por permisos, no por nombres fijos de roles.
La contabilidad completa puede quedar para segunda etapa, pero la trazabilidad debe existir desde el MVP.
Los procesos de negocio no deben mezclarse si representan situaciones distintas.
```

---

## 3. Reglas de usuarios, roles y permisos

### RN-001 — Los usuarios son personas reales

Un usuario representa una persona real que accede al sistema. Los usuarios deben tener credenciales de acceso y estado activo o inactivo.

### RN-002 — Los roles deben ser dinámicos

Los roles no deben estar quemados en el código.

El sistema debe permitir crear roles, editar roles, activar o desactivar roles, asignar permisos a roles y asignar uno o más roles a usuarios.

Los roles base pueden existir como configuración inicial, pero no deben limitar el crecimiento del negocio.

### RN-003 — El sistema debe validar permisos, no nombres de roles

La lógica del sistema no debe depender de reglas como:

```text
Si el rol se llama Vendedor, puede vender.
```

La regla correcta es:

```text
Si el usuario tiene el permiso sales.create, puede vender.
```

Ejemplos:

| Acción | Permiso sugerido |
|---|---|
| Crear venta | `sales.create` |
| Cerrar caja | `cash.close` |
| Registrar mercadería dañada | `inventory.damaged_goods_create` |
| Dar de baja mercadería dañada | `inventory.damaged_goods_write_off` |
| Registrar retorno a proveedor | `suppliers.supplier_return_create` |
| Aplicar crédito de proveedor | `suppliers.supplier_credit_apply` |

---

## 4. Reglas de productos e inventario

### RN-004 — El inventario debe manejarse por variante

La unidad mínima de inventario debe considerar:

```text
Producto + talla + color
```

Además, el producto debe permitir clasificación por segmento:

```text
Hombre
Mujer
Unisex
```

### RN-005 — La disponibilidad no es igual al stock físico

La disponibilidad para venta debe calcularse considerando restricciones del negocio.

Regla propuesta:

```text
Disponible para venta =
stock físico
- stock reservado por apartados
- stock reservado/prestado
- stock separado para retorno a proveedor
- stock dañado/no vendible
```

Por lo tanto, un producto puede existir físicamente, pero no estar disponible para venta.

### RN-006 — El inventario disponible debe actualizarse con cada operación relevante

Deben afectar inventario:

```text
Compras
Ventas
Devoluciones sobre venta
Apartados
Cancelación de apartados
Mercadería prestada
Devolución de mercadería prestada
Mercadería dañada
Retorno a proveedor
Traslados entre bodegas
Ajustes manuales
```

### RN-007 — Los movimientos de inventario deben conservar trazabilidad

Todo movimiento de inventario debe registrar al menos producto o variante, cantidad, bodega origen, bodega destino, tipo de movimiento, documento origen, usuario responsable, fecha real y motivo o nota si aplica.


---

## 5. Reglas de ventas

### RN-008 — Una venta emitida descuenta inventario disponible

Cuando una venta se confirma, el sistema debe descontar la mercadería vendida del inventario disponible.

Si la venta proviene de un proceso que ya había descontado o separado inventario, el sistema no debe descontar dos veces.

Ejemplo:

```text
Mercadería prestada convertida en venta.
```

### RN-009 — El sistema debe soportar varias formas de pago

Una venta de contado puede pagarse por:

```text
Efectivo
Transferencia
Tarjeta
```

El sistema también debe soportar venta a crédito, apartados y abonos parciales.

### RN-010 — Las ventas deben registrar datos necesarios para contabilidad futura

Toda venta debe guardar información suficiente para que pueda generarse contabilidad en una segunda etapa.

Debe conservarse:

```text
Fecha real
Fecha operativa
Cliente, si aplica
Usuario responsable
Detalle de productos
Precio de venta
Costo del producto vendido
Descuento
Método de pago
Caja o sesión de caja
Saldo pendiente, si aplica
Documento origen, si aplica
```

---

## 6. Reglas de ventas a crédito

### RN-011 — La venta a crédito es un proceso esencial

La venta a crédito forma parte del MVP porque permite captar más clientes.

El sistema debe permitir registrar venta a crédito, registrar abonos, consultar saldo pendiente, consultar historial de pagos e identificar clientes con deuda activa.

### RN-012 — Se permite vender a crédito a clientes con deuda pendiente solo con control de permisos

El sistema puede permitir una nueva venta a crédito a un cliente con deuda pendiente, pero debe requerir autorización mediante permisos.

Regla:

```text
Si el cliente tiene deuda pendiente o vencida, el sistema debe permitir la venta solo si el usuario tiene permiso autorizado para hacerlo.
```

Esto evita bloquear el negocio, pero mantiene control.

Permiso sugerido:

```text
sales.credit_override
```

---

## 7. Reglas de apartados

### RN-013 — Un apartado reserva inventario

Cuando se crea un apartado, el sistema debe reservar el inventario correspondiente.

La mercadería apartada no debe aparecer como disponible para venta.

### RN-014 — Un apartado puede recibir pagos parciales

El sistema debe permitir registrar abonos a un apartado hasta completar el total.

Cada abono debe registrar fecha, monto, método de pago, usuario responsable y caja o sesión de caja si aplica.

### RN-015 — Un apartado vencido no debe quedarse sin resolución

Cuando un apartado vence, el sistema debe alertar y permitir resolverlo.

Las resoluciones permitidas son:

```text
Devolver el abono al cliente
Convertir el abono en saldo a favor del cliente
Extender o reactivar el apartado con autorización
Cancelar el apartado y liberar inventario
```

### RN-016 — El abono de un apartado puede convertirse en saldo a favor del cliente

Si el negocio decide no devolver el dinero al cliente, el sistema debe permitir registrar ese monto como saldo a favor.

Este saldo debe poder aplicarse a futuras ventas, apartados u otras operaciones permitidas.

Estructura sugerida para implementación futura:

```text
customer_credits
customer_credit_applications
```

### RN-017 — El cambio de producto en un apartado se maneja cancelando la reserva actual

Para simplificar el proceso y mantener trazabilidad clara, el sistema no debe modificar directamente los productos dentro del mismo apartado como primera opción del MVP.

Si el cliente desea cambiar el producto apartado, el flujo recomendado es:

```text
Cancelar la reserva del apartado actual.
Liberar el inventario reservado.
Conservar el efectivo recibido.
Registrar el monto pagado como saldo a favor del cliente.
Crear un nuevo apartado para el nuevo producto.
Aplicar el saldo a favor del cliente al nuevo apartado.
```

Esta decisión evita inconsistencias en inventario, recálculo de saldos y auditoría del apartado original.

### RN-018 — El cambio de producto apartado debe conservar trazabilidad

Cuando un cliente cambia el producto apartado, el sistema debe conservar relación entre:

```text
Apartado original cancelado
Saldo a favor generado
Nuevo apartado creado
Saldo a favor aplicado
Usuario que realizó la operación
Motivo del cambio
Fecha y hora
```

Si el nuevo producto tiene mayor valor, la diferencia queda como saldo pendiente en el nuevo apartado.

Si el nuevo producto tiene menor valor, el saldo restante puede conservarse como saldo a favor del cliente o devolverse, según decisión del negocio y permisos del usuario.

Todo este proceso debe quedar auditado.


---

## 8. Reglas de caja y arqueo

### RN-019 — Toda operación de cobro debe asociarse a caja cuando aplique

Las ventas, abonos, pagos de apartados y otros cobros deben asociarse a una caja o sesión de caja cuando correspondan.

### RN-020 — El sistema debe manejar fecha operativa

El sistema debe manejar:

```text
created_at
business_date
```

`created_at` representa la fecha y hora real del registro.

`business_date` representa el día operativo del negocio.

### RN-021 — Las ventas posteriores al cierre de caja pasan al siguiente business_date

Si la caja del día fue cerrada antes del final del día calendario, las ventas posteriores deben asignarse al siguiente `business_date`.

### RN-022 — El sistema puede crear o usar automáticamente una caja para el siguiente día operativo

Después del cierre de caja, si se registra una nueva venta, el sistema puede crear o usar automáticamente una nueva sesión de caja para el siguiente `business_date`.

Regla:

```text
Si no existe sesión de caja abierta para el nuevo business_date, el sistema puede crearla automáticamente según configuración.
```

Esta regla busca mantener fluidez operativa sin impedir ventas posteriores al arqueo.

### RN-023 — El arqueo debe comparar efectivo esperado contra efectivo contado

El sistema debe calcular el efectivo esperado considerando monto inicial de caja, pagos en efectivo, entradas manuales, salidas manuales y reembolsos en efectivo.

La diferencia debe registrarse como:

```text
Sin diferencia
Sobrante
Faltante
```

### RN-024 — Reabrir caja requiere permiso especial

Una caja cerrada solo debe reabrirse con permiso especial y motivo obligatorio.

Debe quedar auditado usuario que reabre, fecha y hora, motivo, estado anterior y estado nuevo.

---

## 9. Reglas de mercadería prestada

### RN-025 — La mercadería prestada no es una venta

Mercadería prestada significa que un producto se entrega temporalmente a una persona de confianza.

No debe generar factura hasta que se confirme la compra.

### RN-026 — La mercadería prestada deja de estar disponible para venta

Desde el momento en que se registra como prestada, la mercadería no debe aparecer como disponible para venta.

Esto se debe a que salió físicamente de la tienda o bodega.

### RN-027 — La mercadería prestada debe registrar responsable

El sistema debe registrar nombre de la persona responsable, tipo de responsable, teléfono si aplica, fecha esperada de devolución, usuario que registró el préstamo y notas.

Tipos sugeridos de responsable:

```text
customer
seller
trusted_person
employee
other
```

### RN-028 — La devolución de mercadería prestada debe reincorporar inventario si está apta

Si la mercadería prestada regresa en buen estado, puede volver al inventario disponible.

Si regresa dañada, debe manejarse como mercadería dañada.

### RN-029 — Si mercadería prestada se convierte en venta, no debe descontar inventario dos veces

Cuando una mercadería prestada se convierte en venta, el sistema debe registrar la venta y marcar la reserva como consumida.

Si el inventario ya fue separado o descontado al momento del préstamo, la factura no debe descontarlo nuevamente.

### RN-030 — El sistema debe alertar mercadería prestada vencida

Si la mercadería prestada supera su fecha esperada de devolución, el sistema debe alertar o permitir consulta de préstamos vencidos.


---

## 10. Reglas de mercadería dañada

### RN-031 — La mercadería dañada no está disponible para venta

Todo producto registrado como dañado, defectuoso o no vendible debe quedar fuera de la disponibilidad de venta.

### RN-032 — La mercadería dañada debe moverse a una bodega lógica

Se recomienda manejar una bodega lógica:

```text
Mercadería dañada / No vendible
```

Esto permite controlar productos que existen físicamente, pero no pueden venderse.

### RN-033 — Dar de baja mercadería dañada requiere permiso especial

Dar de baja definitiva una mercadería dañada debe requerir permiso especial.

Permiso sugerido:

```text
inventory.damaged_goods_write_off
```

La acción debe guardar auditoría y motivo.

---

## 11. Reglas de retorno a proveedor

### RN-034 — Retorno a proveedor es un proceso independiente

Retorno a proveedor no es lo mismo que devolución sobre venta.

Puede originarse por producto defectuoso, daño, error de compra, acuerdo comercial, reemplazo solicitado o mercadería no vendible.

### RN-035 — El retorno a proveedor debe sacar mercadería del inventario disponible

Cuando se registra retorno a proveedor, la mercadería debe dejar de estar disponible para venta.

Puede manejarse primero en una bodega lógica:

```text
Mercadería por retornar a proveedor
```

Y luego registrar salida cuando se entrega al proveedor.

### RN-036 — El proveedor puede compensar mediante crédito, reembolso o reemplazo

Un retorno a proveedor puede resolverse mediante:

```text
Crédito a favor
Reembolso
Reemplazo de mercadería
Sin compensación
```

### RN-037 — Si el proveedor reconoce crédito, debe registrarse como crédito a favor

Si el proveedor no entrega producto ni devuelve dinero en el momento, pero reconoce un monto a favor de la tienda, el sistema debe registrar un crédito de proveedor.

Estructura sugerida:

```text
supplier_credits
supplier_credit_applications
```

### RN-038 — El crédito de proveedor puede aplicarse parcial o totalmente

El sistema debe permitir aplicar el crédito de proveedor en compras futuras.

Ejemplo:

```text
Crédito reconocido: C$ 1,000
Aplicado a compra futura: C$ 400
Saldo restante: C$ 600
```

### RN-039 — Si el proveedor reemplaza mercadería en el momento, no se crea crédito pendiente

Si el proveedor entrega mercadería de reemplazo en el momento, el sistema debe registrar:

```text
Salida por retorno a proveedor
Entrada de mercadería por reemplazo
```

En este caso, no se crea crédito pendiente, salvo que exista diferencia de valor.

### RN-040 — El producto recibido como reemplazo puede ser distinto

El proveedor puede reemplazar un producto por otro diferente, siempre que se registre la equivalencia o valor reconocido.

Ejemplo:

```text
Se retorna un producto de C$ 1,000.
El proveedor entrega otro producto distinto por valor equivalente.
```

El sistema debe permitir registrar la entrada de mercadería aunque no sea el mismo producto.


---

## 12. Reglas de clientes y saldos a favor

### RN-041 — El cliente puede tener saldo a favor

El sistema debe permitir manejar saldo a favor del cliente cuando aplique.

Esto puede originarse por apartado vencido cuyo abono no se devuelve, cambio de producto apartado por uno de menor valor, devolución de venta sin devolución inmediata de efectivo o ajuste autorizado.

### RN-042 — El saldo a favor del cliente debe poder aplicarse a operaciones futuras

El saldo a favor puede aplicarse a nueva venta, nuevo apartado o pago parcial de una operación.

Toda aplicación debe quedar registrada y auditada.

Estructura sugerida:

```text
customer_credits
customer_credit_applications
```

---

## 13. Reglas de facturación legal y configuración fiscal

### RN-043 — La facturación legal debe ser configurable

El sistema debe estar preparado para facturación legal o fiscal, pero las reglas fiscales deben ser configurables.

Actualmente el negocio no aplica impuestos sobre venta.

### RN-044 — El sistema debe permitir ventas sin impuesto

En el contexto actual, las ventas pueden emitirse sin impuesto.

Sin embargo, el sistema debe quedar preparado para configurar impuestos, series, numeración, reglas fiscales, anulación fiscal y reportes fiscales.

---

## 14. Reglas de moneda y tipo de cambio

### RN-045 — La moneda principal es el córdoba

Las operaciones principales del sistema deben registrarse en córdobas.

### RN-046 — Los reportes pueden mostrarse en dólares

El dólar puede usarse para reportes y análisis.

El tipo de cambio puede ingresarse manualmente usando la tasa oficial correspondiente.

### RN-047 — El tipo de cambio usado debe conservarse para reportes históricos

Si se genera un reporte equivalente en dólares, el sistema debe conservar o poder reconstruir el tipo de cambio usado para la fecha correspondiente.

---

## 15. Reglas de contabilidad futura

### RN-048 — La contabilidad completa queda para segunda etapa

El MVP no necesita generar todos los asientos contables, libro diario, libro mayor, balance general ni cierre contable.

### RN-049 — El MVP debe guardar trazabilidad suficiente para contabilidad

Desde la primera etapa, las operaciones deben guardar información suficiente para anexar el módulo contable después.

Esto incluye fecha real, fecha operativa, usuario, cliente o proveedor, documento origen, método de pago, caja o banco, costo, precio, descuento, saldo pendiente, movimiento de inventario y evento interno.

### RN-050 — Los eventos internos deben permitir generar asientos futuros

Los eventos internos no son visibles para el usuario final, pero pueden servir para generar contabilidad después.

Ejemplos:

```text
factura_emitida
pago_cliente_recibido
apartado_creado
caja_cerrada
retorno_proveedor_creado
credito_proveedor_generado
```

---

## 16. Reglas de auditoría

### RN-051 — Toda operación sensible debe quedar auditada

Deben quedar auditadas acciones como anular venta, modificar venta, cerrar caja, reabrir caja, registrar diferencia de caja, registrar mercadería prestada, registrar mercadería dañada, dar de baja mercadería dañada, registrar retorno a proveedor, aplicar crédito de proveedor, modificar apartado, cambiar producto apartado y convertir saldo a favor.

### RN-052 — La auditoría debe registrar estado anterior y nuevo

Cuando aplique, la auditoría debe guardar usuario, fecha y hora, acción realizada, entidad afectada, valor anterior, valor nuevo, motivo, IP o dispositivo si aplica.

---

## 17. Reglas de reportes

### RN-053 — Los reportes deben basarse en datos operativos confiables

Los reportes deben considerar correctamente `business_date`, métodos de pago, caja, inventario disponible, inventario no vendible, mercadería prestada, apartados activos, ventas a crédito, saldos pendientes, créditos de proveedor y saldos a favor de clientes.

### RN-054 — Los reportes no deben mezclar fecha real y fecha operativa sin aclaración

Si un reporte usa `created_at`, debe indicarlo.

Si usa `business_date`, también debe indicarlo.

Esto es importante especialmente en reportes de caja y ventas diarias.

---

## 18. Resumen de reglas críticas

Las reglas más importantes del sistema son:

```text
La disponibilidad no es igual al stock físico.
Una venta descuenta inventario, salvo que el inventario ya haya sido separado previamente.
Un apartado reserva inventario.
El cambio de producto en apartado se maneja cancelando la reserva actual, generando saldo a favor y creando un nuevo apartado.
Un cliente puede tener saldo a favor.
Una caja cerrada mueve ventas posteriores al siguiente business_date.
La mercadería prestada no es venta y no está disponible para venta.
La mercadería dañada no está disponible para venta.
Un retorno a proveedor puede generar crédito, reembolso o reemplazo.
Los créditos de proveedor pueden aplicarse parcialmente.
Los roles son dinámicos.
Las acciones se autorizan por permisos.
El MVP debe guardar trazabilidad para contabilidad futura.
Toda operación sensible debe auditarse.
```
