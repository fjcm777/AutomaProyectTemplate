# 00 — Contexto del Negocio

## 1. Propósito del documento

Este documento describe el contexto general del negocio y del sistema **Automata**.

Su objetivo es servir como punto de partida para entender qué problema resuelve el sistema, cómo opera el negocio, qué procesos principales deben cubrirse y qué decisiones generales deben respetarse durante el desarrollo.

Este documento está pensado para ser entendible tanto para una persona del negocio como para desarrolladores o herramientas de inteligencia artificial que ayuden a construir el sistema.

---

## 2. Nombre del sistema

El sistema se llamará inicialmente:

```text
Automata
```

Este nombre puede cambiar en el futuro y no debe considerarse una restricción técnica.

El negocio inicial para el cual se está diseñando el sistema es:

```text
Calzado Norita
```

---

## 3. Tipo de negocio

Automata está orientado inicialmente a una tienda de:

```text
Calzado, ropa y accesorios
```

Aunque el negocio actual se enfoca principalmente en calzado, el sistema debe diseñarse de forma flexible para manejar otros tipos de productos como ropa, accesorios u otros artículos relacionados.

---

## 4. Objetivo general del sistema

Automata será un sistema tipo ERP adaptado a una tienda comercial pequeña o mediana.

Su objetivo principal es centralizar y controlar las operaciones del negocio, incluyendo:

```text
Inventario
Ventas
Clientes
Apartados
Ventas a crédito
Pagos
Caja y arqueo
Proveedores
Compras
Retornos a proveedor
Mercadería prestada
Mercadería dañada
Reportes
Preparación para contabilidad futura
```

El sistema debe permitir que el negocio tenga mejor control sobre sus productos, ventas, saldos pendientes, movimientos de caja e inventario disponible.

---

## 5. Alcance inicial del negocio

En su primera etapa, el sistema debe cubrir las operaciones esenciales de la tienda.

### Procesos principales

```text
Gestión de productos
Gestión de inventario
Gestión de clientes
Ventas de contado
Ventas por transferencia
Ventas con tarjeta
Ventas a crédito
Apartados
Pagos y abonos
Arqueo de caja
Mercadería prestada
Mercadería dañada
Retorno a proveedor
Reportes básicos
```

### Procesos de segunda etapa

```text
Contabilidad completa
Asientos contables automáticos
Libro diario
Libro mayor
Balance general
Estado de resultados
Cierre contable
Conciliación bancaria
Reglas contables avanzadas
```

---

## 6. Sucursales y bodegas

El sistema será usado inicialmente por una sola tienda.

Sin embargo, debe quedar preparado para manejar varias sucursales o bodegas en el futuro.

Decisión inicial:

```text
Una tienda inicialmente, pero preparado para varias.
```

Esto implica que el diseño debe permitir:

```text
Una o varias bodegas
Una o varias cajas
Una o varias sucursales en el futuro
Inventario separado por ubicación
Reportes filtrados por ubicación si fuera necesario
```

---

## 7. Productos e inventario

El inventario debe manejarse por variante de producto.

La variante mínima recomendada es:

```text
Producto + talla + color
```

Además, los productos deben poder clasificarse por segmento:

```text
Hombre
Mujer
Unisex
```

También deben manejarse categorías generales, por ejemplo:

```text
Zapatos
Sandalias
Tenis
Botas
Accesorios
Ropa
```

El sistema debe permitir consultar disponibilidad real del producto tomando en cuenta:

```text
Stock físico
Stock reservado
Mercadería prestada
Mercadería dañada
Mercadería por retornar a proveedor
Apartados activos
```

La disponibilidad para venta no debe ser simplemente la cantidad física registrada. Debe considerar si el producto está reservado, prestado, dañado o separado para otro proceso.

---

## 8. Modalidades de venta

Automata debe soportar varias modalidades de venta.

### Venta de contado

Una venta de contado puede pagarse mediante:

```text
Efectivo
Transferencia bancaria
Tarjeta
```

Actualmente el negocio no aplica impuestos sobre la venta, pero el sistema debe permitir configurar impuestos en el futuro si fuera necesario.

### Venta a crédito

La venta a crédito es un proceso esencial para el negocio, porque permite captar más clientes.

En este caso, el cliente recibe el producto y queda con un saldo pendiente por pagar.

El sistema debe permitir:

```text
Registrar venta a crédito
Registrar abonos
Consultar saldo pendiente
Consultar historial de pagos
Identificar clientes con deuda activa
```

### Sistema de apartado

El apartado también es un proceso esencial del negocio.

En este caso, el cliente separa uno o varios productos mediante un pago inicial y puede completar el pago posteriormente.

El sistema debe permitir:

```text
Crear apartado
Reservar inventario
Registrar pagos parciales
Controlar fecha límite
Alertar apartados vencidos
Cerrar apartado cuando esté pagado
Liberar inventario si el apartado se cancela o vence
```

---

## 9. Caja y arqueo

El sistema debe incluir control de caja y arqueo.

El arqueo de caja permite comparar el efectivo esperado según el sistema contra el efectivo contado físicamente.

Una regla importante del negocio es que el arqueo puede realizarse antes del final del día calendario.

Por esa razón, el sistema debe manejar una fecha operativa:

```text
business_date
```

Esta fecha permite separar:

```text
Fecha real del registro
Fecha operativa del negocio
```

Ejemplo:

```text
La caja del 24 de junio se cierra a las 7:00 p. m.
Una venta registrada a las 7:30 p. m. puede quedar asignada al business_date del 25 de junio.
```

Esto permite que el negocio cierre caja antes de terminar el día sin perder control de las ventas posteriores.

---

## 10. Mercadería prestada

El sistema debe contemplar el caso de mercadería prestada.

En este contexto, mercadería prestada significa:

```text
Producto entregado temporalmente a una persona de confianza.
No es una venta todavía.
Puede regresar al inventario.
Puede convertirse en venta.
Puede quedar vencida o no devuelta.
```

Este proceso debe tratarse como una salida temporal controlada de inventario.

No debe confundirse con una venta, apartado o crédito.

El sistema debe permitir:

```text
Registrar mercadería prestada
Identificar a la persona responsable
Registrar fecha esperada de devolución
Consultar mercadería prestada activa
Registrar devolución
Convertir mercadería prestada en venta
Alertar mercadería vencida o no devuelta
```

---

## 11. Mercadería dañada

El sistema debe contemplar el caso de mercadería dañada.

Mercadería dañada significa:

```text
Producto que no debe estar disponible para venta por daño, defecto o deterioro.
```

Este proceso es diferente a mercadería prestada.

El sistema debe permitir:

```text
Registrar mercadería dañada
Mover producto a una bodega lógica no vendible
Consultar mercadería dañada
Dar de baja mercadería dañada
Registrar motivo, usuario y fecha
```

Se recomienda manejar una bodega lógica llamada:

```text
Mercadería dañada / No vendible
```

Esto permite que el producto siga existiendo físicamente en el sistema, pero no aparezca como disponible para venta.

---

## 12. Retorno a proveedor

El sistema debe contemplar el retorno de mercadería a proveedor.

Retorno a proveedor significa:

```text
La tienda devuelve mercancía al proveedor.
```

Esto puede ocurrir por defecto, daño, error de compra, acuerdo comercial u otra razón.

Este proceso es diferente a la devolución sobre venta.

El sistema debe permitir:

```text
Registrar retorno a proveedor
Sacar mercadería del inventario disponible
Registrar motivo del retorno
Registrar estado del retorno
Registrar si el proveedor reconoce crédito, reemplazo o reembolso
Consultar créditos disponibles con proveedores
Aplicar crédito de proveedor a compras futuras
```

Cuando el proveedor reconoce un crédito a favor, el sistema debe poder controlarlo como saldo a favor de la tienda.

---

## 13. Facturación legal y configuración fiscal

Automata debe estar preparado para soportar facturación legal o fiscal.

Sin embargo, la aplicación de reglas fiscales debe ser configurable.

En el caso actual del negocio:

```text
No se aplica ningún tipo de impuesto sobre la venta por el momento.
```

Pero el sistema debe quedar preparado para configurar en el futuro:

```text
Impuestos
Series de facturación
Numeración
Reglas fiscales
Datos legales del negocio
Anulación fiscal
Reportes fiscales
```

La ausencia actual de impuestos no debe impedir que el sistema pueda adaptarse posteriormente.

---

## 14. Moneda y tipo de cambio

La moneda principal del sistema será:

```text
Córdoba nicaragüense
```

El dólar puede ser útil para reportes y análisis.

En una primera versión, el tipo de cambio puede ingresarse manualmente usando como referencia la tasa oficial del Banco Central.

El sistema debe permitir:

```text
Registrar operaciones en córdobas
Consultar reportes equivalentes en dólares
Registrar tipo de cambio manualmente
Conservar el tipo de cambio usado para reportes históricos
```

La moneda operativa principal seguirá siendo el córdoba.

---

## 15. Actores funcionales

En la documentación se usarán actores funcionales en español para facilitar la comprensión del negocio.

Estos actores no representan necesariamente usuarios fijos ni roles rígidos del sistema.

| Actor funcional | Nombre técnico sugerido | Descripción |
|---|---|---|
| Administrador | `admin` | Control general del sistema |
| Gerente / Encargado | `manager` | Supervisión operativa, caja, inventario y reportes |
| Vendedor | `seller` | Atención al cliente, ventas, apartados y consulta de disponibilidad |
| Cajero | `cashier` | Cobros, caja y arqueo |
| Encargado de bodega | `warehouse` | Inventario, entradas, salidas, ajustes y mercadería dañada |
| Responsable de compras | `purchasing` | Proveedores, compras y retornos a proveedor |
| Contador | `accountant` | Información contable y financiera |
| Sistema | `system` | Procesos automáticos internos |

---

## 16. Usuarios, roles y permisos

El sistema debe diferenciar claramente:

```text
Usuario
Rol
Permiso
Actor funcional
```

### Usuario

Un usuario es una persona real que accede al sistema.

Los usuarios deben crearse y administrarse desde el sistema.

### Rol

Un rol es un grupo de permisos.

Los roles deben ser dinámicos y administrables desde el sistema.

Esto significa que el negocio debe poder:

```text
Crear roles
Editar roles
Activar o desactivar roles
Asignar permisos a roles
Asignar uno o más roles a usuarios
```

### Permiso

Un permiso representa una acción concreta que el usuario puede realizar.

Ejemplo:

```text
sales.create
cash.close
inventory.adjust
suppliers.supplier_return_create
```

La lógica del sistema debe validar permisos, no nombres fijos de roles.

Correcto:

```text
El usuario puede cerrar caja si tiene el permiso cash.close.
```

Incorrecto:

```text
El usuario puede cerrar caja si su rol se llama Cajero.
```

Esto es importante porque los roles pueden cambiar con el tiempo, pero los permisos representan capacidades reales del sistema.

---

## 17. Contabilidad y trazabilidad

La contabilidad completa será parte de una segunda etapa.

Sin embargo, desde la primera etapa el sistema debe guardar la información necesaria para integrar el módulo contable en el futuro.

Esto significa que el MVP debe registrar operaciones con suficiente trazabilidad.

Cada operación relevante debe conservar datos como:

```text
Fecha real
Fecha operativa
Usuario responsable
Cliente o proveedor relacionado
Documento origen
Método de pago
Caja o sesión de caja
Tipo de operación
Costo del producto
Valor de venta
Descuentos
Saldo pendiente
Movimiento de inventario
Eventos internos generados
```

Esto aplica a procesos como:

```text
Venta directa
Venta a crédito
Apartado
Pago de cliente
Arqueo de caja
Devolución sobre venta
Mercadería prestada
Mercadería dañada
Retorno a proveedor
Crédito a favor con proveedor
Compra a proveedor
```

Aunque no se generen asientos contables en la primera etapa, el sistema debe guardar la información necesaria para que esos asientos puedan generarse posteriormente.

---

## 18. Eventos internos

El sistema puede usar eventos internos para desacoplar procesos.

Estos eventos no son un módulo funcional para el usuario, sino una infraestructura interna.

Ejemplos:

```text
factura_emitida
pago_cliente_recibido
apartado_creado
apartado_vencido
caja_cerrada
mercaderia_prestada_registrada
mercaderia_danada_registrada
retorno_proveedor_creado
credito_proveedor_generado
```

Estos eventos pueden servir en el futuro para:

```text
Generar asientos contables
Crear notificaciones
Actualizar reportes
Registrar auditoría
Sincronizar procesos internos
```

---

## 19. Auditoría

El sistema debe registrar auditoría para operaciones sensibles.

Ejemplos:

```text
Anular venta
Modificar venta
Cerrar caja
Reabrir caja
Registrar diferencia de caja
Dar de baja mercadería dañada
Registrar retorno a proveedor
Aplicar crédito de proveedor
Reabrir período fiscal
```

La auditoría debe permitir saber:

```text
Quién hizo la acción
Cuándo la hizo
Qué cambió
Cuál era el valor anterior
Cuál es el valor nuevo
Cuál fue el motivo
```

---

## 20. Principios generales del sistema

Automata debe construirse siguiendo estos principios:

```text
Flexible para crecer con el negocio
Entendible para usuarios no técnicos
Preparado para varias bodegas o sucursales
Basado en permisos dinámicos
Con trazabilidad suficiente para contabilidad futura
Con separación clara entre procesos de negocio
Con inventario confiable
Con reportes útiles para la toma de decisiones
```

---

## 21. Resumen

Automata será un sistema ERP adaptado inicialmente a Calzado Norita, una tienda de calzado, ropa y accesorios.

El sistema debe cubrir las operaciones principales del negocio desde la primera etapa, incluyendo ventas, crédito, apartados, inventario, caja, mercadería prestada, mercadería dañada y retornos a proveedor.

La contabilidad completa queda para una segunda etapa, pero el sistema debe guardar desde el inicio la información necesaria para integrarla correctamente en el futuro.

La seguridad debe basarse en usuarios, roles dinámicos y permisos, evitando atar reglas del sistema a nombres fijos de roles.

Este documento servirá como base de contexto para los demás documentos de diseño y para cualquier herramienta de IA que ayude en el desarrollo del sistema.
