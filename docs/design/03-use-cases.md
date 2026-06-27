# 03 — Casos de Uso

## 1. Propósito del documento

Este documento define los casos de uso funcionales del sistema **Automata**.

Un caso de uso describe una acción concreta que el sistema debe permitir realizar. Este documento sirve como puente entre reglas de negocio, flujos de proceso, base de datos, endpoints del backend y pantallas del frontend.

Los casos de uso están organizados por bloques funcionales.

---

## 2. Convenciones

Cada caso de uso puede incluir:

```text
Código
Nombre
Actor principal
Objetivo
Precondiciones
Flujo principal resumido
Reglas de negocio
Permisos sugeridos
Datos afectados
Eventos sugeridos
Etapa
```

Los actores se muestran en español para la documentación. Los nombres técnicos en código y base de datos pueden mantenerse en inglés.

---

# CU-000 — Autenticación, usuarios, roles y permisos

## CU-001 — Iniciar sesión

**Actor principal:** Usuario del sistema

**Objetivo:** Permitir que un usuario acceda al sistema con credenciales válidas.

**Precondiciones:**

```text
El usuario existe.
El usuario está activo.
```

**Flujo principal resumido:**

```text
1. El usuario ingresa credenciales.
2. El sistema valida usuario y contraseña.
3. El sistema genera sesión o token.
4. El sistema carga permisos del usuario.
```

**Permisos sugeridos:** No aplica, acceso público controlado por credenciales.

**Datos afectados:**

```text
users
user_sessions / tokens
```

**Etapa:** MVP

---

## CU-002 — Cerrar sesión

**Actor principal:** Usuario del sistema

**Objetivo:** Finalizar la sesión activa del usuario.

**Etapa:** MVP

---

## CU-003 — Crear usuario

**Actor principal:** Administrador

**Objetivo:** Registrar una nueva cuenta de usuario.

**Reglas de negocio:**

```text
El usuario debe tener estado activo o inactivo.
Los permisos se obtienen mediante roles.
```

**Permisos sugeridos:** `users.create`

**Datos afectados:**

```text
users
user_roles
```

**Etapa:** MVP

---

## CU-004 — Gestionar roles dinámicos

**Actor principal:** Administrador

**Objetivo:** Crear, editar, activar o desactivar roles del sistema.

**Reglas de negocio:**

```text
Los roles no deben estar quemados en el código.
Los roles deben ser administrables.
```

**Permisos sugeridos:** `roles.manage`

**Datos afectados:**

```text
roles
role_permissions
```

**Etapa:** MVP

---

## CU-005 — Gestionar permisos de roles

**Actor principal:** Administrador

**Objetivo:** Asignar permisos a roles.

**Reglas de negocio:**

```text
El sistema debe autorizar acciones por permisos, no por nombres fijos de roles.
```

**Permisos sugeridos:** `permissions.assign`

**Datos afectados:**

```text
permissions
role_permissions
```

**Etapa:** MVP

---

# CU-100 — Productos e inventario

## CU-101 — Crear producto

**Actor principal:** Encargado de bodega / Administrador

**Objetivo:** Registrar un producto base.

**Reglas de negocio:**

```text
El producto debe tener código personalizado alfanumérico, por ejemplo F102.
La marca debe manejarse desde el inicio para reportes y filtrado.
El código de barras queda como campo opcional preparado para futuro.
```

**Datos obligatorios sugeridos:**

```text
Código personalizado
Nombre
Categoría
Marca
Segmento: hombre, mujer o unisex
Estado
```

**Permisos sugeridos:** `products.create`

**Datos afectados:**

```text
products
brands
categories
```

**Etapa:** MVP

---

## CU-102 — Editar producto

**Actor principal:** Encargado de bodega / Administrador

**Objetivo:** Modificar datos generales de un producto.

**Permisos sugeridos:** `products.update`

**Etapa:** MVP

---

## CU-103 — Desactivar producto

**Actor principal:** Administrador / Encargado de bodega autorizado

**Objetivo:** Evitar que un producto se use en nuevas operaciones sin eliminar su historial.

**Reglas de negocio:**

```text
No se debe eliminar físicamente un producto con historial.
Se debe cambiar su estado.
```

**Permisos sugeridos:** `products.deactivate`

**Etapa:** MVP

---

## CU-104 — Gestionar variantes de producto

**Actor principal:** Encargado de bodega

**Objetivo:** Registrar combinaciones de producto, talla y color.

**Reglas de negocio:**

```text
La unidad mínima de inventario es producto + talla + color.
Cada variante puede tener identificador interno.
El código de barras puede estar asociado a la variante si existe.
```

**Datos afectados:**

```text
product_variants
sizes
colors
```

**Permisos sugeridos:** `product_variants.manage`

**Etapa:** MVP

---

## CU-105 — Gestionar categorías

**Actor principal:** Administrador / Encargado

**Objetivo:** Crear y mantener categorías como sandalias, tenis, botas, accesorios o ropa.

**Permisos sugeridos:** `categories.manage`

**Etapa:** MVP

---

## CU-106 — Gestionar marcas

**Actor principal:** Administrador / Encargado

**Objetivo:** Crear y mantener marcas para filtrado y reportes.

**Permisos sugeridos:** `brands.manage`

**Etapa:** MVP

---

## CU-107 — Gestionar tallas

**Actor principal:** Administrador / Encargado

**Objetivo:** Crear y mantener tallas usadas por los productos.

**Permisos sugeridos:** `sizes.manage`

**Etapa:** MVP

---

## CU-108 — Gestionar colores

**Actor principal:** Administrador / Encargado

**Objetivo:** Crear y mantener colores usados por variantes.

**Permisos sugeridos:** `colors.manage`

**Etapa:** MVP

---

## CU-109 — Consultar disponibilidad de inventario

**Actor principal:** Vendedor / Encargado de bodega

**Objetivo:** Consultar disponibilidad real por producto, talla, color, categoría, segmento o marca.

**Reglas de negocio:**

```text
La disponibilidad no es igual al stock físico.
Debe excluir reservado, prestado, dañado y separado para retorno a proveedor.
```

**Permisos sugeridos:** `inventory.view`

**Etapa:** MVP

---

## CU-110 — Registrar ajuste de inventario

**Actor principal:** Encargado de bodega autorizado

**Objetivo:** Corregir diferencias de inventario con motivo obligatorio.

**Reglas de negocio:**

```text
Todo ajuste debe quedar auditado.
```

**Permisos sugeridos:** `inventory.adjust`

**Eventos sugeridos:** `ajuste_inventario_registrado`

**Etapa:** MVP

---

# CU-200 — Clientes, ventas, crédito, apartados y devoluciones

## CU-201 — Crear cliente

**Actor principal:** Vendedor / Cajero

**Objetivo:** Registrar un cliente.

**Datos obligatorios:**

```text
Nombre
Dirección
Teléfono
Talla de pie
```

**Datos opcionales:**

```text
Correo
Identificación
Fecha de nacimiento
Notas
```

**Permisos sugeridos:** `customers.create`

**Datos afectados:** `customers`

**Etapa:** MVP

---

## CU-202 — Editar cliente

**Actor principal:** Vendedor / Administrador

**Objetivo:** Actualizar datos del cliente.

**Permisos sugeridos:** `customers.update`

**Etapa:** MVP

---

## CU-203 — Consultar historial del cliente

**Actor principal:** Vendedor / Cajero / Gerente

**Objetivo:** Consultar compras, créditos, apartados, saldos pendientes y saldos a favor del cliente.

**Permisos sugeridos:** `customers.view_history`

**Etapa:** MVP

---

## CU-204 — Registrar venta de contado

**Actor principal:** Vendedor / Cajero

**Objetivo:** Registrar una venta pagada en el momento.

**Reglas de negocio:**

```text
Debe validar disponibilidad.
Debe descontar inventario.
Debe registrar pago.
Debe asociarse a caja y business_date.
Debe guardar costo histórico del producto vendido.
```

**Permisos sugeridos:** `sales.create`

**Datos afectados:**

```text
sales
sale_items
payments
stock_movements
cash_sessions
```

**Eventos sugeridos:**

```text
factura_emitida
pago_cliente_recibido
```

**Etapa:** MVP

---

## CU-205 — Registrar venta a crédito

**Actor principal:** Vendedor / Cajero

**Objetivo:** Registrar una venta donde el cliente recibe el producto y queda saldo pendiente.

**Reglas de negocio:**

```text
Puede tener abono inicial.
Debe crear cuenta por cobrar.
Debe descontar inventario.
Si el cliente tiene deuda pendiente, puede requerir permiso especial.
```

**Permisos sugeridos:**

```text
sales.credit_create
sales.credit_override
```

**Datos afectados:**

```text
sales
sale_items
payments
customer_accounts
stock_movements
```

**Eventos sugeridos:**

```text
venta_credito_creada
cuenta_por_cobrar_generada
```

**Etapa:** MVP

---

## CU-206 — Registrar abono a crédito

**Actor principal:** Cajero

**Objetivo:** Registrar pago parcial o total de una deuda de cliente.

**Reglas de negocio:**

```text
El abono debe reducir el saldo pendiente.
Debe registrar método de pago.
Debe asociarse a caja y business_date si aplica.
```

**Permisos sugeridos:** `customer_payments.create`

**Etapa:** MVP

---

## CU-207 — Anular venta del mismo día operativo

**Actor principal:** Cajero / Gerente autorizado

**Objetivo:** Revertir una venta registrada por error operativo.

**Reglas de negocio:**

```text
Solo se permite dentro del mismo business_date.
Debe requerir permiso especial.
Debe solicitar motivo obligatorio.
Debe revertir inventario si corresponde.
Debe revertir o ajustar pagos asociados.
No genera saldo a favor del cliente.
Si la caja ya fue cerrada, no debe anularse; debe manejarse como devolución o ajuste autorizado.
```

**Permisos sugeridos:** `sales.void`

**Datos afectados:**

```text
sales
sale_items
payments
stock_movements
cash_sessions
audit_logs
```

**Etapa:** MVP

---

## CU-208 — Registrar devolución sobre venta

**Actor principal:** Cajero / Gerente autorizado

**Objetivo:** Registrar la devolución de un producto vendido cuando la venta fue válida.

**Reglas de negocio:**

```text
Debe existir venta original.
Debe requerir autorización.
Debe registrar motivo.
Debe registrar estado del producto devuelto.
Toda devolución autorizada retorna el dinero en el momento.
La devolución no genera saldo a favor del cliente.
El método de devolución puede ser diferente al método de pago original, pero debe registrarse y auditarse.
El producto puede volver a inventario disponible o pasar a mercadería dañada.
```

**Permisos sugeridos:** `sales_returns.create`

**Datos afectados:**

```text
sales_returns
sales_return_items
payments
cash_sessions
stock_movements
audit_logs
```

**Eventos sugeridos:**

```text
devolucion_venta_registrada
dinero_cliente_devuelto
```

**Etapa:** MVP

---

## CU-209 — Crear apartado

**Actor principal:** Vendedor / Cajero

**Objetivo:** Reservar productos para un cliente mediante pago inicial.

**Reglas de negocio:**

```text
Debe validar disponibilidad.
Debe exigir pago inicial mínimo configurable.
Debe reservar inventario.
Debe usar plazo configurable.
```

**Permisos sugeridos:** `layaways.create`

**Datos afectados:**

```text
layaways
layaway_items
payments
stock_reservations
```

**Eventos sugeridos:**

```text
apartado_creado
inventario_reservado
```

**Etapa:** MVP

---

## CU-210 — Registrar abono a apartado

**Actor principal:** Cajero

**Objetivo:** Registrar pagos parciales de un apartado activo.

**Permisos sugeridos:** `layaway_payments.create`

**Eventos sugeridos:** `pago_cliente_recibido`

**Etapa:** MVP

---

## CU-211 — Completar apartado

**Actor principal:** Cajero

**Objetivo:** Cerrar un apartado cuando el cliente completa el pago.

**Reglas de negocio:**

```text
La reserva se consume.
Debe generarse venta o documento final según configuración.
No debe descontar inventario dos veces.
```

**Permisos sugeridos:** `layaways.complete`

**Etapa:** MVP

---

## CU-212 — Cancelar apartado por cambio de producto

**Actor principal:** Vendedor / Cajero

**Objetivo:** Manejar el cambio de producto apartado mediante cancelación de reserva y saldo a favor.

**Reglas de negocio:**

```text
Se cancela la reserva del apartado original.
Se libera inventario.
El efectivo recibido se conserva.
El monto pagado se registra como saldo a favor del cliente.
Se crea un nuevo apartado.
El saldo a favor se aplica al nuevo apartado.
```

**Permisos sugeridos:**

```text
layaways.cancel_for_change
customer_credits.create
customer_credits.apply
```

**Datos afectados:**

```text
layaways
stock_reservations
customer_credits
customer_credit_applications
audit_logs
```

**Etapa:** MVP

---

## CU-213 — Resolver apartado vencido

**Actor principal:** Cajero / Gerente

**Objetivo:** Resolver un apartado que superó su fecha límite.

**Reglas de negocio:**

```text
Puede devolverse el abono.
Puede convertirse el abono en saldo a favor.
Puede extenderse plazo con permiso especial.
Debe liberar inventario si se cancela.
```

**Permisos sugeridos:** `layaways.resolve_expired`

**Etapa:** MVP

---

## CU-214 — Aplicar saldo a favor del cliente

**Actor principal:** Cajero / Vendedor

**Objetivo:** Usar saldo disponible del cliente en una venta o apartado.

**Reglas de negocio:**

```text
El saldo puede aplicarse parcial o totalmente.
Debe quedar trazabilidad de origen y aplicación.
```

**Permisos sugeridos:** `customer_credits.apply`

**Etapa:** MVP

---

## CU-215 — Extender plazo de apartado

**Actor principal:** Gerente autorizado

**Objetivo:** Ampliar la fecha límite de un apartado.

**Reglas de negocio:**

```text
Debe requerir permiso especial.
Debe registrar motivo.
Debe quedar auditado.
```

**Permisos sugeridos:** `layaways.extend`

**Etapa:** MVP

---

# CU-300 — Caja y arqueo

## CU-301 — Abrir caja

**Actor principal:** Cajero

**Objetivo:** Crear una sesión de caja para un business_date.

**Permisos sugeridos:** `cash.open`

**Etapa:** MVP

---

## CU-302 — Registrar movimiento manual de caja

**Actor principal:** Cajero / Gerente

**Objetivo:** Registrar entradas o salidas manuales de efectivo.

**Ejemplos:**

```text
Compra de bolsas
Pago de transporte
Entrada por ajuste
```

**Reglas de negocio:**

```text
Debe registrar motivo.
Debe quedar auditado.
```

**Permisos sugeridos:** `cash.movement_create`

**Etapa:** MVP

---

## CU-303 — Consultar resumen esperado de caja

**Actor principal:** Cajero / Gerente

**Objetivo:** Consultar montos esperados por método de pago antes del arqueo.

**Permisos sugeridos:** `cash.summary_view`

**Etapa:** MVP

---

## CU-304 — Realizar arqueo

**Actor principal:** Cajero / Gerente

**Objetivo:** Comparar efectivo esperado contra efectivo contado.

**Permisos sugeridos:** `cash.count`

**Eventos sugeridos:** `arqueo_caja_realizado`

**Etapa:** MVP

---

## CU-305 — Cerrar caja

**Actor principal:** Cajero / Gerente

**Objetivo:** Cerrar la sesión de caja del día operativo.

**Reglas de negocio:**

```text
Las ventas posteriores deben ir al siguiente business_date.
```

**Permisos sugeridos:** `cash.close`

**Eventos sugeridos:** `caja_cerrada`

**Etapa:** MVP

---

## CU-306 — Reabrir caja con permiso especial

**Actor principal:** Gerente / Administrador

**Objetivo:** Reabrir caja cerrada por motivo justificado.

**Reglas de negocio:**

```text
Debe requerir permiso especial.
Debe registrar motivo.
Debe quedar auditado.
```

**Permisos sugeridos:** `cash.reopen`

**Etapa:** MVP

---

## CU-307 — Abrir siguiente caja por venta posterior al cierre

**Actor principal:** Cajero

**Objetivo:** Confirmar apertura de caja para el siguiente business_date cuando se vende después del cierre.

**Reglas de negocio:**

```text
El sistema debe solicitar confirmación.
No debe asignar ventas a una caja cerrada.
```

**Permisos sugeridos:** `cash.open_next_business_day`

**Etapa:** MVP

---

# CU-400 — Compras, proveedores y procesos especiales de inventario

## CU-401 — Crear proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Registrar proveedor.

**Permisos sugeridos:** `suppliers.create`

**Etapa:** MVP

---

## CU-402 — Editar proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Actualizar datos del proveedor.

**Permisos sugeridos:** `suppliers.update`

**Etapa:** MVP

---

## CU-403 — Registrar compra a proveedor

**Actor principal:** Responsable de compras / Encargado de bodega

**Objetivo:** Registrar compra o recepción de mercadería.

**Reglas de negocio:**

```text
Debe registrar proveedor.
Debe registrar productos, cantidades y costos.
Debe guardar costo histórico.
Debe registrar documento de proveedor si existe.
Puede ser compra pagada, compra a crédito o compra parcialmente pagada.
Debe generar saldo pendiente con proveedor cuando aplique.
```

**Permisos sugeridos:** `purchases.create`

**Datos afectados:**

```text
purchases
purchase_items
supplier_accounts
stock_movements
```

**Etapa:** MVP

---

## CU-404 — Registrar documento de proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Asociar factura, recibo, nota de entrega o referencia a una compra.

**Reglas de negocio:**

```text
El documento es opcional si no existe, pero recomendado.
Si no hay documento formal, se puede usar referencia interna y notas.
```

**Permisos sugeridos:** `supplier_documents.create`

**Etapa:** MVP

---

## CU-405 — Registrar pago a proveedor

**Actor principal:** Responsable de compras / Gerente

**Objetivo:** Registrar pago total o parcial de una compra a crédito.

**Reglas de negocio:**

```text
Debe reducir saldo pendiente con proveedor.
Debe registrar método de pago.
Debe conservar trazabilidad para contabilidad futura.
```

**Permisos sugeridos:** `supplier_payments.create`

**Datos afectados:**

```text
supplier_payments
supplier_accounts
```

**Etapa:** MVP

---

## CU-406 — Consultar saldo pendiente con proveedor

**Actor principal:** Responsable de compras / Gerente

**Objetivo:** Ver deudas activas con proveedores.

**Permisos sugeridos:** `supplier_accounts.view`

**Etapa:** MVP

---

## CU-407 — Registrar mercadería prestada

**Actor principal:** Vendedor / Encargado de bodega

**Objetivo:** Registrar salida temporal de producto a persona de confianza.

**Reglas de negocio:**

```text
No es venta.
Puede registrarse con nombre/teléfono sin cliente formal.
Deja de estar disponible para venta.
```

**Permisos sugeridos:** `inventory.loan_create`

**Eventos sugeridos:** `mercaderia_prestada_registrada`

**Etapa:** MVP

---

## CU-408 — Registrar devolución de mercadería prestada

**Actor principal:** Encargado de bodega

**Objetivo:** Registrar retorno de mercadería prestada.

**Reglas de negocio:**

```text
Si vuelve en buen estado, puede regresar a inventario.
Si vuelve dañada, pasa a mercadería dañada.
```

**Permisos sugeridos:** `inventory.loan_return`

**Etapa:** MVP

---

## CU-409 — Convertir mercadería prestada en venta

**Actor principal:** Vendedor / Cajero

**Objetivo:** Convertir préstamo en venta de contado o crédito.

**Reglas de negocio:**

```text
No debe descontar inventario dos veces.
Debe conservar relación con el préstamo original.
```

**Permisos sugeridos:** `inventory.loan_convert_to_sale`

**Etapa:** MVP

---

## CU-410 — Registrar mercadería dañada

**Actor principal:** Encargado de bodega

**Objetivo:** Mover producto a bodega no vendible.

**Permisos sugeridos:** `inventory.damaged_goods_create`

**Eventos sugeridos:** `mercaderia_danada_registrada`

**Etapa:** MVP

---

## CU-411 — Dar de baja mercadería dañada

**Actor principal:** Encargado de bodega autorizado / Gerente

**Objetivo:** Sacar definitivamente del inventario controlado un producto dañado.

**Reglas de negocio:**

```text
Debe requerir permiso especial.
Debe registrar motivo.
Debe quedar auditado.
```

**Permisos sugeridos:** `inventory.damaged_goods_write_off`

**Etapa:** MVP

---

## CU-412 — Registrar retorno a proveedor

**Actor principal:** Responsable de compras / Encargado de bodega

**Objetivo:** Registrar mercadería que será devuelta al proveedor.

**Reglas de negocio:**

```text
Puede quedar pendiente antes de entrega física.
Debe sacar producto de inventario disponible.
Puede resolverse con crédito, reembolso, reemplazo o sin compensación.
```

**Permisos sugeridos:** `suppliers.supplier_return_create`

**Eventos sugeridos:** `retorno_proveedor_creado`

**Etapa:** MVP

---

## CU-413 — Registrar reemplazo inmediato por proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Registrar entrada de mercadería recibida en reemplazo.

**Reglas de negocio:**

```text
No crea crédito pendiente si el proveedor reemplaza en el momento.
El producto recibido puede ser distinto si se registra equivalencia o valor reconocido.
```

**Permisos sugeridos:** `suppliers.supplier_replacement_receive`

**Etapa:** MVP

---

## CU-414 — Registrar crédito a favor con proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Registrar saldo a favor reconocido por proveedor.

**Permisos sugeridos:** `suppliers.supplier_credit_create`

**Eventos sugeridos:** `credito_proveedor_generado`

**Etapa:** MVP

---

## CU-415 — Aplicar crédito de proveedor

**Actor principal:** Responsable de compras

**Objetivo:** Aplicar crédito disponible a una compra futura.

**Reglas de negocio:**

```text
Puede aplicarse parcial o totalmente.
Debe conservar saldo inicial, aplicado y restante.
```

**Permisos sugeridos:** `suppliers.supplier_credit_apply`

**Etapa:** MVP

---

# CU-500 — Reportes

## CU-501 — Consultar ventas por día operativo

**Actor principal:** Gerente / Administrador

**Objetivo:** Ver ventas usando `business_date`.

**Permisos sugeridos:** `reports.sales_by_business_date`

**Etapa:** MVP

---

## CU-502 — Consultar ventas por método de pago

**Actor principal:** Gerente / Administrador

**Objetivo:** Analizar ventas por efectivo, transferencia, tarjeta o crédito.

**Permisos sugeridos:** `reports.sales_by_payment_method`

**Etapa:** MVP

---

## CU-503 — Consultar disponibilidad por categoría, segmento, talla y color

**Actor principal:** Gerente / Responsable de compras

**Objetivo:** Ayudar a decidir qué productos comprar.

**Ejemplo de pregunta que debe responder:**

```text
¿Cuántas sandalias de mujer tenemos disponibles?
```

**Filtros sugeridos:**

```text
Categoría
Segmento
Marca
Talla
Color
Bodega
Disponible
Reservado
Dañado
Prestado
```

**Permisos sugeridos:** `reports.inventory_availability`

**Etapa:** MVP

---

## CU-504 — Consultar productos más vendidos

**Actor principal:** Gerente / Responsable de compras

**Objetivo:** Identificar productos, categorías, marcas, tallas o colores con mayor venta.

**Filtros sugeridos:**

```text
Rango de fechas
business_date
Categoría
Marca
Segmento
Talla
Color
```

**Permisos sugeridos:** `reports.best_sellers`

**Etapa:** MVP

---

## CU-505 — Consultar inventario bajo

**Actor principal:** Gerente / Responsable de compras

**Objetivo:** Detectar productos con baja disponibilidad para reabastecimiento.

**Permisos sugeridos:** `reports.low_stock`

**Etapa:** MVP

---

## CU-506 — Consultar clientes con deuda

**Actor principal:** Gerente / Cajero

**Objetivo:** Ver clientes con saldos pendientes.

**Permisos sugeridos:** `reports.customer_debt`

**Etapa:** MVP

---

## CU-507 — Consultar apartados activos y vencidos

**Actor principal:** Gerente / Vendedor

**Objetivo:** Controlar apartados pendientes.

**Permisos sugeridos:** `reports.layaways`

**Etapa:** MVP

---

## CU-508 — Consultar caja y arqueos

**Actor principal:** Gerente

**Objetivo:** Revisar cierres de caja, diferencias, sobrantes y faltantes.

**Permisos sugeridos:** `reports.cash`

**Etapa:** MVP

---

# CU-600 — Contabilidad futura

## CU-601 — Gestionar catálogo de cuentas contables

**Actor principal:** Contador

**Objetivo:** Crear y mantener cuentas contables.

**Etapa:** Segunda etapa

---

## CU-602 — Generar asientos contables automáticos

**Actor principal:** Sistema / Contador

**Objetivo:** Generar asientos desde ventas, compras, pagos, inventario y caja.

**Precondición importante:**

```text
El MVP debe haber guardado trazabilidad suficiente desde la primera etapa.
```

**Etapa:** Segunda etapa

---

## CU-603 — Consultar libro diario

**Actor principal:** Contador

**Etapa:** Segunda etapa

---

## CU-604 — Consultar libro mayor

**Actor principal:** Contador

**Etapa:** Segunda etapa

---

## CU-605 — Realizar cierre contable

**Actor principal:** Contador / Administrador

**Etapa:** Segunda etapa

---

## CU-606 — Generar balance general

**Actor principal:** Contador / Gerente

**Etapa:** Segunda etapa

---

## CU-607 — Generar estado de resultados

**Actor principal:** Contador / Gerente

**Etapa:** Segunda etapa

---

## CU-608 — Realizar conciliación bancaria

**Actor principal:** Contador

**Etapa:** Segunda etapa

---

# CU-700 — Auditoría y configuración

## CU-701 — Consultar auditoría

**Actor principal:** Administrador / Gerente

**Objetivo:** Revisar acciones sensibles realizadas en el sistema.

**Permisos sugeridos:** `audit.view`

**Etapa:** MVP

---

## CU-702 — Configurar impuestos y facturación legal

**Actor principal:** Administrador

**Objetivo:** Configurar reglas fiscales, series, numeración e impuestos.

**Reglas de negocio:**

```text
Actualmente el negocio no aplica impuestos sobre venta.
El sistema debe permitir ventas sin impuesto.
Debe quedar preparado para activar reglas fiscales en el futuro.
```

**Permisos sugeridos:** `settings.tax_invoice_manage`

**Etapa:** MVP básico / ampliación

---

## CU-703 — Configurar plazo y pago inicial de apartados

**Actor principal:** Administrador / Gerente

**Objetivo:** Definir plazo por defecto y porcentaje mínimo de pago inicial.

**Permisos sugeridos:** `settings.layaway_manage`

**Etapa:** MVP

---

## CU-704 — Configurar tipo de cambio

**Actor principal:** Administrador / Gerente

**Objetivo:** Registrar tipo de cambio manual para reportes en dólares.

**Permisos sugeridos:** `settings.exchange_rate_manage`

**Etapa:** MVP

---

## 3. Resumen de decisiones reflejadas

```text
Los casos de uso están detallados.
La numeración se organiza por bloques funcionales.
Los productos manejan marca desde el inicio.
Los productos tienen código personalizado alfanumérico, por ejemplo F102.
El código de barras queda como campo opcional preparado para futuro.
El cliente requiere nombre, dirección, teléfono y talla de pie.
La anulación de venta solo aplica al mismo business_date y no genera saldo a favor.
La devolución sobre venta retorna dinero en el momento y no genera saldo a favor.
El método de devolución puede ser diferente al método original, pero debe registrarse.
Los apartados pueden generar saldo a favor en cancelación, vencimiento o cambio de producto.
Las compras a proveedor pueden ser al contado, al crédito o parcialmente pagadas.
El sistema debe manejar cuentas por pagar básicas con proveedores desde el MVP.
Los reportes deben incluir disponibilidad por categoría/segmento y productos más vendidos.
La contabilidad completa queda para segunda etapa, pero el MVP debe guardar trazabilidad suficiente.
```
