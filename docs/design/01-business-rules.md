# 01 - Business Rules

Proyecto: **Automata**  
Negocio: **Calzado Norita**  
Fecha de actualizacion: 2026-06-28

## 1. Objetivo

Este documento define reglas de negocio centrales para Automata. Estas reglas deben ser usadas como referencia para diseno de base de datos, casos de uso, contratos API, validaciones, pruebas y desarrollo asistido por IA.

## 2. Principios generales

- El sistema debe proteger la trazabilidad de ventas, inventario, caja, clientes, proveedores y operaciones sensibles.
- Los procesos criticos deben validarse en backend.
- El frontend puede mejorar la experiencia visual, pero no es la fuente real de seguridad ni validacion.
- Las operaciones importantes deben conservar usuario, fecha real, `business_date`, motivo cuando aplique y relacion con documentos origen.

## 3. Disponibilidad de inventario

Disponibilidad = stock fisico - reservado por apartados - mercaderia prestada/reservada - separado para retorno a proveedor - danado/no vendible.

Reglas:

- El inventario danado no esta disponible para venta.
- La mercaderia prestada no esta disponible mientras este prestada.
- La mercaderia reservada por apartado no esta disponible para venta normal.
- El inventario separado para retorno a proveedor no esta disponible.
- Todo cambio de disponibilidad debe generar movimiento o registro trazable.

## 4. Productos y variantes

- El producto base representa el articulo comercial.
- Las variantes representan combinaciones como talla, color u otros atributos.
- La marca debe manejarse desde el MVP para filtros y reportes.
- El codigo personalizado alfanumerico debe permitirse desde el inicio, por ejemplo `F102`.
- El codigo de barras sera opcional y preparado para uso futuro.
- Cada producto tendra una imagen principal desde el MVP.
- La imagen no se guardara como binario en la base de datos; se guardara una ruta o URL.

## 5. Clientes

Datos obligatorios del cliente:

- Nombre.
- Direccion.
- Telefono.
- Talla de pie.

Datos opcionales:

- Correo.
- Identificacion.
- Fecha de nacimiento.
- Notas.

Excepcion:

- La mercaderia prestada puede registrarse para una persona de confianza sin crear cliente formal, siempre que se registre al menos nombre y telefono.

## 6. Ventas de contado

- Una venta de contado debe validar inventario disponible.
- Debe registrar productos, cantidades, precios, descuentos si aplican, metodo de pago, caja y `business_date`.
- Debe descontar inventario.
- Debe registrar pago.
- Debe afectar caja si el metodo de pago lo requiere.
- Debe ejecutarse en transaccion.
- Si una parte falla, toda la venta debe revertirse.

## 7. Ventas a credito

- Las ventas a credito son parte esencial del negocio.
- Puede existir abono inicial.
- Se debe registrar saldo pendiente.
- Una nueva venta a credito con deuda pendiente solo se permite con permiso/autorizacion especial.
- Los abonos a credito deben registrarse con fecha, usuario, metodo de pago, caja/banco y saldo resultante.
- La cuenta por cobrar basica vivira dentro del contexto de ventas/clientes durante el MVP.

## 8. Apartados

- Los apartados reservan inventario.
- Deben tener pago inicial configurable.
- Deben tener plazo configurable.
- El plazo por defecto podra ser 2 meses, pero debe ser configurable.
- El inventario apartado no esta disponible para venta normal.
- Se permite extender plazo solo con permiso especial.
- Un apartado puede estar activo, completado, cancelado o vencido/resuelto.

### Cambio de producto en apartado

Si el cliente desea cambiar el producto apartado:

1. Se cancela la reserva actual.
2. Se libera el inventario anterior.
3. Se conserva el efectivo abonado como saldo a favor del cliente.
4. Se abre un nuevo apartado.
5. Se aplica el saldo a favor al nuevo apartado.

No se modificara directamente el producto dentro del apartado original.

## 9. Saldos a favor de cliente

El saldo a favor puede generarse en procesos de apartado, por ejemplo:

- Cambio de producto apartado.
- Cancelacion de apartado donde se conserva el abono.
- Apartado vencido resuelto conservando el abono.
- Ajuste autorizado especial.

Regla importante:

- Las devoluciones sobre venta no generan saldo a favor. En una devolucion autorizada se devuelve dinero en el momento.

## 10. Devoluciones sobre venta

- Toda devolucion autorizada implica devolver dinero en el momento.
- No genera saldo a favor del cliente.
- El metodo de devolucion puede ser diferente al metodo de pago original.
- El metodo usado debe quedar registrado y auditado.
- Ejemplo: venta pagada por transferencia, devolucion en efectivo.
- La devolucion debe relacionarse con la venta original.
- Debe ajustar inventario si el producto vuelve a estar disponible.
- Debe ejecutarse en transaccion.

## 11. Anulacion de venta

- La anulacion es para errores operativos de vendedor/cajero.
- Solo se permite dentro del mismo `business_date`.
- Requiere permiso especial y motivo.
- Revierte venta, pago e inventario.
- No genera saldo a favor.
- Debe registrar auditoria.
- Debe ejecutarse en transaccion.

## 12. Caja y business_date

- El sistema manejara `created_at` y `business_date`.
- `created_at` representa la fecha/hora real del registro.
- `business_date` representa el dia operativo.
- El arqueo puede hacerse antes del fin del dia calendario.
- Si se registra una venta despues del cierre, el sistema debe solicitar confirmacion para abrir/usar caja del siguiente `business_date`.
- Las ventas, pagos y reportes de caja deben usar `business_date` cuando corresponda.

## 13. Mercaderia prestada

- La mercaderia prestada deja de estar disponible al registrarse.
- No es una venta.
- Puede devolverse al inventario.
- Puede convertirse en venta de contado o credito.
- Si se convierte en venta, no debe descontarse inventario dos veces.
- Puede registrarse para una persona de confianza, no necesariamente cliente formal.

## 14. Mercaderia danada

- La mercaderia danada se mueve a una bodega logica o estado no vendible.
- No esta disponible para venta.
- Dar de baja mercaderia danada requiere permiso especial.
- Debe registrarse motivo y auditoria.

## 15. Retorno a proveedor

- El retorno a proveedor es independiente de la devolucion sobre venta.
- Puede generar credito, reembolso, reemplazo o quedar sin compensacion.
- El credito de proveedor puede aplicarse parcialmente.
- Si el proveedor reemplaza mercaderia en el momento, se registra salida por retorno y entrada por reemplazo.
- Si el producto de reemplazo es diferente, debe registrarse equivalencia o valor reconocido.
- El proceso debe mantener trazabilidad de inventario, proveedor y compensacion.

## 16. Compras y cuentas por pagar basicas

- El sistema debe registrar compras desde el MVP.
- Debe registrar proveedor, documento proveedor si existe, productos, cantidades y costos.
- Debe actualizar inventario.
- Debe guardar costo historico.
- Debe soportar compras a credito y pagos parciales a proveedor.
- La cuenta por pagar basica vivira dentro del contexto de compras/proveedores durante el MVP.

## 17. Facturacion e impuestos

- Actualmente las ventas no aplican impuestos.
- El sistema debe quedar preparado para impuestos, series y numeracion fiscal si se requiere en el futuro.
- La facturacion legal/fiscal debe ser configurable.

## 18. Moneda y tipo de cambio

- La operacion principal sera en cordobas.
- El dolar se usara para reportes cuando se requiera.
- El tipo de cambio sera manual por fecha, basado en Banco Central.
- Los reportes en dolares deben calcularse con el tipo de cambio correspondiente.

## 19. Contabilidad futura

- La contabilidad completa queda para una segunda etapa.
- El MVP debe guardar trazabilidad suficiente para integrarla despues.
- Deben conservarse datos como fecha real, `business_date`, usuario, cliente/proveedor, documento origen, metodo de pago, caja/banco, costo, precio, descuentos, saldos, movimientos de inventario y eventos internos.

## 20. Auditoria selectiva

- No se auditara cada consulta normal del sistema.
- Se auditaran operaciones sensibles o modificaciones importantes.
- Areas principales: ventas, inventario, clientes, caja, proveedores, compras, permisos y contabilidad futura.
- La auditoria debe registrarse desde backend.
- El frontend puede solicitar motivo, pero el backend decide cuando auditar y guarda el registro.

## 21. Borrado logico y estados

- No se eliminaran fisicamente registros con impacto historico, financiero, operativo o de inventario.
- Se usaran estados o borrado logico.
- Ejemplos: `active`, `inactive`, `cancelled`, `voided`, `closed`.
- El borrado fisico se reservara para datos temporales o sin impacto historico.

## 22. Tablas historicas y retencion

- En el MVP no se implementaran tablas historicas.
- `audit_logs` y `business_events` podran limpiarse por antiguedad mediante politica de retencion.
- No se eliminaran registros recientes ni necesarios para procesos abiertos, investigacion activa o cierres pendientes.
