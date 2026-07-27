# 10 - Validation Rules

## Propósito

Este documento define las reglas de validación funcionales y técnicas para Automata / Calzado Norita.

Debe servir como guía para frontend, backend, QA y desarrollo asistido con IA. Las validaciones aquí descritas deben mantener consistencia con:

- `01-business-rules.md`
- `02-process-flows.md`
- `04-architecture.md`
- `05-database.md`
- `06-auth-rbac.md`
- `07-modules.md`
- `08-api-contracts.md`
- `09-frontend-routes.md`

---

## 1. Principios de validación

| Principio | Regla |
|---|---|
| Backend como fuente real | Toda regla crítica debe validarse en backend aunque también exista validación visual en frontend. |
| Frontend para experiencia | El frontend debe anticipar errores, bloquear acciones evidentes y mostrar mensajes claros. |
| Consistencia | Reglas similares deben usar mensajes y comportamientos similares en todos los módulos. |
| Seguridad | No se deben exponer detalles internos, consultas SQL, excepciones técnicas ni nombres de tablas al usuario final. |
| Trazabilidad | Las operaciones sensibles deben registrar usuario, fecha, recurso afectado, operación y motivo cuando aplique. |
| Atomicidad | Las operaciones críticas multi-módulo deben ejecutarse como transacciones atómicas. |
| Contrato API | Los errores del backend deben seguir el formato estándar definido en `08-api-contracts.md`. |

---

## 2. Responsabilidad: frontend vs backend

| Tipo de validación | Frontend | Backend |
|---|---:|---:|
| Campos obligatorios | Sí | Sí |
| Formato visual simple | Sí | Sí |
| Tipos de datos | Sí | Sí |
| Reglas de negocio críticas | Puede ayudar | Sí, obligatorio |
| Permisos | Puede ocultar/deshabilitar UI | Sí, obligatorio |
| Inventario disponible | Puede consultar/advertir | Sí, obligatorio |
| Caja abierta/cerrada | Puede consultar/advertir | Sí, obligatorio |
| Transiciones de estado | Puede bloquear UI | Sí, obligatorio |
| Auditoría | No | Sí |
| Transacciones | No | Sí |

Regla:

```text
El frontend mejora la experiencia, pero no sustituye la validación del backend.
El backend es la fuente definitiva para reglas críticas de negocio, seguridad,
dinero, inventario, estado y auditoría.
```

---

## 3. Clasificación de severidad

La severidad ayuda a documentar el comportamiento esperado de la validación.

| Severity | Uso | Comportamiento |
|---|---|---|
| `blocking` | Error que impide continuar | Bloquea guardar, confirmar o ejecutar la operación |
| `warning` | Advertencia importante | Permite continuar si la regla funcional lo permite |
| `informational` | Información útil | No bloquea la operación |

Importante:

```text
severity es una clasificación documental de reglas de validación.
No reemplaza el contrato JSON del backend definido en 08-api-contracts.md.
```

---

## 4. Reglas comunes de validación

### 4.1 Campos obligatorios, catálogos y registros relacionados

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Required field | Todo campo obligatorio debe tener valor | Sí | Sí | `blocking` | `Este campo es obligatorio.` |
| Related record | El registro relacionado debe existir | Sí | Sí | `blocking` | `El registro seleccionado no existe.` |
| Active related record | El registro relacionado debe estar activo cuando aplique | Sí | Sí | `blocking` | `El registro seleccionado no está activo.` |
| Catalog value | El valor seleccionado debe pertenecer al catálogo permitido | Sí | Sí | `blocking` | `Seleccione un valor válido.` |
| Inactive record use | No se deben usar registros inactivos en nuevas operaciones | Sí | Sí | `blocking` | `No puede usar un registro inactivo en esta operación.` |

### 4.2 Montos y dinero

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Money value | El monto debe ser numérico decimal válido | Sí | Sí | `blocking` | `Ingrese un monto válido.` |
| Non-negative amount | Un monto general no debe ser menor que cero | Sí | Sí | `blocking` | `El monto no puede ser menor que cero.` |
| Positive amount | Pagos, precios y totales confirmados deben ser mayores que cero | Sí | Sí | `blocking` | `El monto debe ser mayor que cero.` |
| Decimal precision | El monto debe respetar la precisión configurada | Sí | Sí | `blocking` | `El monto debe tener máximo dos decimales.` |
| Payment over balance | Un pago no debe exceder el saldo pendiente salvo regla explícita | Sí | Sí | `blocking` | `El monto pagado no puede ser mayor que el saldo pendiente.` |
| Exchange rate | El tipo de cambio debe ser mayor que cero | Sí | Sí | `blocking` | `El tipo de cambio debe ser mayor que cero.` |

### 4.3 Cantidades e inventario

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Quantity | La cantidad debe ser un entero mayor que cero | Sí | Sí | `blocking` | `La cantidad debe ser mayor que cero.` |
| Available stock | La cantidad solicitada no debe exceder el stock disponible | Sí | Sí | `blocking` | `La cantidad solicitada excede el stock disponible.` |
| Reserved stock | El inventario reservado no debe tratarse como disponible | Puede advertir | Sí | `blocking` | `No hay suficiente inventario disponible para reservar.` |
| Movement quantity | Todo movimiento debe indicar cantidad válida | Sí | Sí | `blocking` | `Debe indicar una cantidad válida para el movimiento.` |
| Negative stock | Ninguna operación debe dejar inventario negativo | No | Sí | `blocking` | `El ajuste no puede dejar el inventario en negativo.` |
| Damaged quantity | La cantidad dañada no puede exceder inventario disponible | Sí | Sí | `blocking` | `La cantidad dañada excede el inventario disponible.` |
| Loaned quantity | La cantidad prestada no puede exceder inventario disponible | Sí | Sí | `blocking` | `La cantidad prestada excede el inventario disponible.` |

### 4.4 Fechas y día operativo

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Date | Toda fecha debe ser válida | Sí | Sí | `blocking` | `Ingrese una fecha válida.` |
| Date range | La fecha inicial no puede ser mayor que la final | Sí | Sí | `blocking` | `La fecha inicial no puede ser mayor que la fecha final.` |
| Business date | La operación debe pertenecer al día operativo correcto | Puede advertir | Sí | `blocking` | `La operación no corresponde al día operativo actual.` |
| Sale void date | Una venta solo puede anularse el mismo día operativo | Puede bloquear UI | Sí | `blocking` | `No puede anular una venta fuera del mismo día operativo.` |
| Layaway due date | El vencimiento debe respetar el plazo máximo configurado | Sí | Sí | `blocking` | `La fecha de vencimiento excede el plazo máximo permitido para apartados.` |
| Report date range | Los reportes deben usar rangos válidos | Sí | Sí | `blocking` | `Seleccione un rango de fechas válido.` |
| Closed cash | No se permiten operaciones en caja cerrada | Puede bloquear UI | Sí | `blocking` | `No puede registrar operaciones en una caja cerrada.` |

### 4.5 Estados y transiciones

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Status value | El estado debe ser válido | Sí | Sí | `blocking` | `El estado seleccionado no es válido.` |
| Status transition | Solo se permiten transiciones definidas | Puede bloquear UI | Sí | `blocking` | `La operación no es válida para el estado actual.` |
| Final status | Un estado final no debe modificarse directamente | Puede bloquear UI | Sí | `blocking` | `No puede modificar un registro en estado final.` |
| Cancelled status | Un registro cancelado no debe recibir nuevas operaciones | Puede bloquear UI | Sí | `blocking` | `No puede ejecutar esta operación sobre un registro cancelado.` |
| Closed process | Un proceso cerrado no debe modificarse | Puede bloquear UI | Sí | `blocking` | `No puede modificar un proceso cerrado.` |

### 4.6 Auditoría y motivos

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sensitive reason | Acciones sensibles requieren motivo cuando aplique | Sí | Sí | `blocking` | `Debe indicar un motivo para continuar.` |
| Reason detail | El motivo debe tener suficiente detalle | Sí | Sí | `blocking` | `El motivo debe contener suficiente detalle.` |
| Audit user | Debe identificarse el usuario ejecutor | No | Sí | `blocking` | `No se pudo identificar el usuario que realiza la operación.` |
| Audit timestamp | Debe registrarse fecha y hora | No | Sí | `blocking` | `No se pudo registrar la fecha y hora de la operación.` |
| Audit resource | Debe identificarse el recurso afectado | No | Sí | `blocking` | `No se pudo registrar el recurso afectado.` |

Operaciones sensibles principales:

- anular venta
- registrar devolución de venta
- cerrar o reabrir caja
- registrar diferencia de caja
- cancelar apartado
- dar de baja mercadería dañada
- convertir mercadería prestada en venta
- enviar o resolver retorno a proveedor
- modificar roles/permisos
- cambiar configuraciones sensibles

---

## 5. Validaciones por módulo

### 5.1 Auth / Users

Regla general:

```text
El login usa username y password. El email es dato opcional de contacto
y no se usa como credencial de inicio de sesión en el MVP.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Username login | El usuario debe ingresar username | Sí | Sí | `blocking` | `Ingrese su nombre de usuario.` |
| Password login | La contraseña es obligatoria | Sí | Sí | `blocking` | `Ingrese su contraseña.` |
| Login with email | No se permite login con email | Sí | Sí | `blocking` | `Debe iniciar sesión con su nombre de usuario.` |
| Invalid credentials | Credenciales inválidas no deben indicar cuál campo falló | No | Sí | `blocking` | `Usuario o contraseña incorrectos.` |
| Inactive user | Usuario inactivo no puede iniciar sesión | Puede advertir | Sí | `blocking` | `El usuario está inactivo. Contacte al administrador.` |
| Username | Username obligatorio y único | Sí | Sí | `blocking` | `El nombre de usuario es obligatorio.` |
| Duplicate username | No debe existir otro usuario con el mismo username | Puede advertir | Sí | `blocking` | `Ya existe un usuario con este nombre de usuario.` |
| First name | Nombre requerido | Sí | Sí | `blocking` | `El nombre del usuario es obligatorio.` |
| Last name | Apellido requerido | Sí | Sí | `blocking` | `El apellido del usuario es obligatorio.` |
| Email | Email opcional; si existe debe tener formato válido | Sí | Sí | `blocking` | `Ingrese un correo electrónico válido.` |
| Role assignment | Usuario debe tener al menos un rol válido cuando aplique | Sí | Sí | `blocking` | `Debe asignar al menos un rol válido al usuario.` |

### 5.2 Products

Regla general:

```text
Cada producto debe tener datos comerciales mínimos, código único,
categoría válida, precios correctos y variantes no duplicadas.
Las variantes se validan dentro del contexto del producto.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Product name | Nombre obligatorio | Sí | Sí | `blocking` | `El nombre del producto es obligatorio.` |
| Product code | Código obligatorio y único | Sí | Sí | `blocking` | `El código del producto es obligatorio.` |
| Duplicate product code | No puede repetirse código de producto | Puede advertir | Sí | `blocking` | `Ya existe un producto con este código.` |
| Category | Categoría válida y activa | Sí | Sí | `blocking` | `Debe seleccionar una categoría válida.` |
| Brand | Marca válida si aplica | Sí | Sí | `blocking` | `Debe seleccionar una marca válida.` |
| Gender / segment | Debe ser hombre, mujer, unisex u otro valor permitido | Sí | Sí | `blocking` | `Seleccione un segmento válido.` |
| Cost price | Costo válido y no negativo | Sí | Sí | `blocking` | `Ingrese un costo válido.` |
| Sale price | Precio de venta debe ser mayor que cero | Sí | Sí | `blocking` | `El precio de venta debe ser mayor que cero.` |
| Sale price below cost | Vender por debajo del costo requiere autorización | Sí | Sí | `blocking` | `El precio de venta es menor que el costo. Se requiere autorización para continuar.` |
| Product image | Formato y tamaño de imagen permitidos | Sí | Sí | `blocking` | `La imagen debe tener un formato y tamaño permitido.` |
| Variant duplicate | No debe repetirse la misma combinación talla/color | Puede advertir | Sí | `blocking` | `Ya existe una variante con esta talla y color.` |

### 5.3 Customers

Campos considerados:

```text
id, first_name, last_name, phone, address, foot_size, email,
identification_number, birth_date, notes, photo_url, current_balance,
is_active, deleted_at, deleted_by, created_at, updated_at
```

Regla general:

```text
Clientes requiere datos mínimos de contacto y talla de pie.
El saldo no se modifica directamente; todo cambio debe venir de movimientos trazables.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| First name | Nombre obligatorio | Sí | Sí | `blocking` | `El nombre del cliente es obligatorio.` |
| Last name | Apellido obligatorio | Sí | Sí | `blocking` | `El apellido del cliente es obligatorio.` |
| Phone | Teléfono obligatorio y válido | Sí | Sí | `blocking` | `Ingrese un número de teléfono válido.` |
| Address | Dirección obligatoria | Sí | Sí | `blocking` | `La dirección del cliente es obligatoria.` |
| Foot size | Talla de pie obligatoria y en rango válido | Sí | Sí | `blocking` | `Ingrese una talla de pie válida.` |
| Email | Email opcional; si existe debe ser válido | Sí | Sí | `blocking` | `Ingrese un correo electrónico válido.` |
| Birth date | Fecha de nacimiento opcional pero válida | Sí | Sí | `blocking` | `Ingrese una fecha de nacimiento válida.` |
| Notes | Notas opcionales con longitud máxima | Sí | Sí | `blocking` | `Las notas exceden la longitud permitida.` |
| Photo | Foto opcional, formato permitido | Sí | Sí | `blocking` | `La foto debe tener un formato y tamaño permitido.` |
| Current balance | No puede editarse directamente | No | Sí | `blocking` | `El saldo del cliente no puede modificarse directamente.` |
| Active customer | Solo clientes activos para nuevas operaciones | Sí | Sí | `blocking` | `No puede usar un cliente inactivo en esta operación.` |
| Soft delete fields | `deleted_at` y `deleted_by` son controlados por el sistema | No | Sí | `blocking` | `No puede modificar manualmente los campos de eliminación.` |

### 5.4 Suppliers

Regla general:

```text
Proveedor requiere nombre y teléfono. Los datos complementarios son opcionales.
Proveedores con historial no deben eliminarse físicamente; deben desactivarse.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Supplier name | Nombre obligatorio | Sí | Sí | `blocking` | `El nombre del proveedor es obligatorio.` |
| Similar active name | Advertir duplicado visual o nombre similar | Puede advertir | Sí | `warning` | `Ya existe un proveedor con un nombre similar. Revise antes de continuar.` |
| Phone | Teléfono obligatorio | Sí | Sí | `blocking` | `El teléfono del proveedor es obligatorio.` |
| Phone format | Teléfono con formato válido | Sí | Sí | `blocking` | `Ingrese un número de teléfono válido.` |
| Email | Email opcional válido | Sí | Sí | `blocking` | `Ingrese un correo electrónico válido.` |
| Address | Dirección con longitud máxima | Sí | Sí | `blocking` | `La dirección excede la longitud permitida.` |
| Contact name | Contacto con longitud máxima | Sí | Sí | `blocking` | `El nombre del contacto excede la longitud permitida.` |
| Notes | Notas con longitud máxima | Sí | Sí | `blocking` | `Las notas exceden la longitud permitida.` |
| Active supplier | Solo proveedores activos para compras/retornos nuevos | Sí | Sí | `blocking` | `No puede usar un proveedor inactivo en esta operación.` |
| Supplier with history | No eliminar físicamente si tiene historial | No | Sí | `blocking` | `No puede eliminar físicamente un proveedor con historial. Debe desactivarlo.` |

### 5.5 Inventory

Regla general:

```text
Inventory debe proteger consistencia de stock, evitar inventario negativo,
garantizar trazabilidad de movimientos y controlar operaciones sensibles:
ajustes, mercadería dañada y mercadería prestada.
```

#### Stock y movimientos

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Product variant | Variante debe existir y estar activa | Sí | Sí | `blocking` | `El producto seleccionado no existe o no está activo.` |
| Warehouse/location | Ubicación debe ser válida cuando aplique | Sí | Sí | `blocking` | `Seleccione una ubicación de inventario válida.` |
| Movement type | Tipo de movimiento válido | Sí | Sí | `blocking` | `Seleccione un tipo de movimiento válido.` |
| Movement direction | Dirección válida: entrada, salida o ajuste | Sí | Sí | `blocking` | `Seleccione una dirección válida para el movimiento.` |
| Movement source | Todo movimiento debe tener origen trazable | No | Sí | `blocking` | `No se pudo identificar el origen del movimiento de inventario.` |

#### Adjustments

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Adjustment quantity | Cantidad válida | Sí | Sí | `blocking` | `Debe indicar una cantidad válida para el ajuste.` |
| Negative stock | No puede dejar inventario negativo | No | Sí | `blocking` | `El ajuste no puede dejar el inventario en negativo.` |
| Adjustment reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para el ajuste.` |
| Permission | Requiere permiso de ajuste | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |

#### Damaged goods

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Damaged quantity | Mayor que cero y menor o igual al disponible | Sí | Sí | `blocking` | `La cantidad dañada excede el inventario disponible.` |
| Damage reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para registrar mercadería dañada.` |
| Write-off status | No dar de baja dos veces el mismo registro | Puede bloquear UI | Sí | `blocking` | `La mercadería dañada ya fue dada de baja.` |
| Write-off permission | Requiere permiso especial | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |

#### Loaned goods

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Loaned quantity | Mayor que cero y menor o igual al disponible | Sí | Sí | `blocking` | `La cantidad prestada excede el inventario disponible.` |
| Responsible person | Debe identificarse responsable del préstamo | Sí | Sí | `blocking` | `Debe indicar la persona responsable del préstamo.` |
| Loan reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para el préstamo.` |
| Return quantity | Cantidad retornada válida | Sí | Sí | `blocking` | `La cantidad retornada no es válida.` |
| Convert to sale | Solo préstamos activos pueden convertirse a venta | Puede bloquear UI | Sí | `blocking` | `Solo puede convertir a venta un préstamo activo.` |
| Already returned | No operar préstamos devueltos | Puede bloquear UI | Sí | `blocking` | `El préstamo ya fue retornado.` |

Inventory transfers quedan fuera del MVP inicial.

### 5.6 Sales

Regla general:

```text
Una venta debe tener productos válidos, stock suficiente, pago válido,
caja abierta, día operativo correcto y trazabilidad. Anulación y devolución
validan estado, permisos, motivo, caja, inventario y auditoría en backend.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sale items | Debe existir al menos un producto | Sí | Sí | `blocking` | `Debe agregar al menos un producto para confirmar la venta.` |
| Product | Producto válido y activo | Sí | Sí | `blocking` | `El producto seleccionado no existe o no está activo.` |
| Quantity | Cantidad mayor que cero | Sí | Sí | `blocking` | `La cantidad debe ser mayor que cero.` |
| Stock | Stock suficiente | Sí | Sí | `blocking` | `La cantidad solicitada excede el stock disponible.` |
| Unit price | Precio unitario mayor que cero | Sí | Sí | `blocking` | `El precio unitario debe ser mayor que cero.` |
| Sale total | Total mayor que cero | Sí | Sí | `blocking` | `El total de la venta debe ser mayor que cero.` |
| Credit customer | Venta crédito requiere cliente válido | Sí | Sí | `blocking` | `Debe seleccionar un cliente válido.` |
| Open cash | Debe existir caja abierta cuando aplique | Sí | Sí | `blocking` | `Debe existir una caja abierta para registrar la venta.` |
| Business date | Día operativo correcto | Puede advertir | Sí | `blocking` | `La operación no corresponde al día operativo actual.` |
| Payment method | Método de pago válido | Sí | Sí | `blocking` | `Debe seleccionar un método de pago válido.` |
| Payment amount | Monto mayor que cero | Sí | Sí | `blocking` | `El monto pagado debe ser mayor que cero.` |
| Cash overpayment | Efectivo puede exceder total para calcular vuelto | Sí | Sí | `warning` | `El sistema calculará el vuelto correspondiente.` |
| Transfer/card overpayment | Transferencia/tarjeta no puede exceder total | Sí | Sí | `blocking` | `El monto pagado no puede ser mayor que el total de la venta para este método de pago.` |

#### Anulación de venta

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sale status | Solo venta confirmada puede anularse | Puede bloquear UI | Sí | `blocking` | `Solo puede anular una venta confirmada.` |
| Same business date | Solo mismo día operativo | Puede bloquear UI | Sí | `blocking` | `No puede anular una venta fuera del mismo día operativo.` |
| Void reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para anular la venta.` |
| Cash session | Caja debe permitir la operación | Puede advertir | Sí | `blocking` | `No puede anular la venta porque la caja ya no permite esta operación.` |
| Inventory reversal | Inventario debe revertirse correctamente | No | Sí | `blocking` | `No se pudo revertir el inventario asociado a la venta.` |

#### Devolución de venta

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sale return status | Estado debe permitir devolución | Puede bloquear UI | Sí | `blocking` | `La venta no permite registrar devoluciones en su estado actual.` |
| Return items | Debe seleccionar productos a devolver | Sí | Sí | `blocking` | `Debe seleccionar al menos un producto para devolver.` |
| Return quantity | Cantidad devuelta mayor que cero | Sí | Sí | `blocking` | `La cantidad devuelta debe ser mayor que cero.` |
| Return limit | No exceder cantidad disponible para devolución | Sí | Sí | `blocking` | `La cantidad devuelta excede la cantidad disponible para devolución.` |
| Refund amount | Monto de devolución válido | Sí | Sí | `blocking` | `El monto de devolución no es válido.` |
| Refund method | Método de devolución válido | Sí | Sí | `blocking` | `Debe seleccionar un método de devolución válido.` |
| Return reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para registrar la devolución.` |
| Inventory return | Inventario devuelto debe procesarse | No | Sí | `blocking` | `No se pudo procesar el inventario devuelto.` |

#### Comprobante

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sale exists | Venta debe existir | Sí | Sí | `blocking` | `La venta solicitada no existe.` |
| Receipt available | Comprobante debe estar disponible | Sí | Sí | `blocking` | `La venta aún no tiene comprobante disponible.` |
| Receipt totals | Totales deben coincidir | No | Sí | `blocking` | `Los totales del comprobante no coinciden con la venta.` |

### 5.7 Layaways

Regla general:

```text
Un apartado debe tener cliente válido, productos reservables, pago inicial suficiente,
fecha de vencimiento válida y control de saldo pendiente. Un apartado vencido puede
recibir pagos con advertencia si no está cancelado, completado o en estado final.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Customer | Cliente válido | Sí | Sí | `blocking` | `Debe seleccionar un cliente válido para crear el apartado.` |
| Items | Al menos un producto | Sí | Sí | `blocking` | `Debe agregar al menos un producto para crear el apartado.` |
| Product | Producto válido y activo | Sí | Sí | `blocking` | `El producto seleccionado no existe o no está activo.` |
| Quantity | Cantidad mayor que cero | Sí | Sí | `blocking` | `La cantidad debe ser mayor que cero.` |
| Reservable stock | Stock suficiente para reservar | Sí | Sí | `blocking` | `No hay suficiente inventario disponible para reservar.` |
| Initial payment | Pago inicial mayor que cero | Sí | Sí | `blocking` | `El pago inicial debe ser mayor que cero.` |
| Minimum initial payment | Cumple mínimo configurado | Sí | Sí | `blocking` | `El pago inicial no cumple el mínimo requerido para apartados.` |
| Due date | No excede plazo máximo | Sí | Sí | `blocking` | `La fecha de vencimiento excede el plazo máximo permitido para apartados.` |
| Open cash for payment | Caja abierta para pagos | Sí | Sí | `blocking` | `Debe existir una caja abierta para registrar el pago.` |
| Active layaway payment | Solo apartado activo recibe pagos | Puede bloquear UI | Sí | `blocking` | `Solo un apartado activo puede recibir pagos.` |
| Expired payment | Apartado vencido puede recibir pago con advertencia | Sí | Sí | `warning` | `El apartado está vencido, pero puede registrar el pago si desea continuar.` |
| Payment amount | Monto mayor que cero | Sí | Sí | `blocking` | `El monto pagado debe ser mayor que cero.` |
| Payment limit | No exceder saldo pendiente | Sí | Sí | `blocking` | `El monto pagado no puede ser mayor que el saldo pendiente.` |
| Complete active | Solo apartado activo puede completarse | Puede bloquear UI | Sí | `blocking` | `Solo un apartado activo puede completarse.` |
| Pending balance | No debe quedar saldo pendiente al completar | Sí | Sí | `blocking` | `El apartado aún tiene saldo pendiente.` |
| Reserved inventory | Productos reservados disponibles | No | Sí | `blocking` | `Los productos reservados no están disponibles para completar el apartado.` |
| Sale generation | Completar debe generar venta asociada | No | Sí | `blocking` | `No se pudo generar la venta asociada al apartado.` |
| Cancel status | Estado debe permitir cancelación | Puede bloquear UI | Sí | `blocking` | `El apartado no puede cancelarse en su estado actual.` |
| Cancel reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para cancelar el apartado.` |
| Inventory release | Debe liberar inventario reservado | No | Sí | `blocking` | `No se pudo liberar el inventario reservado.` |
| Customer balance | Debe registrar saldo a favor si aplica | No | Sí | `blocking` | `No se pudo registrar el saldo a favor del cliente.` |

### 5.8 Cash

Regla general:

```text
Toda operación monetaria operativa debe asociarse a caja abierta, día operativo válido,
usuario autorizado y trazabilidad de ingresos, egresos, diferencias, conteos y cierres.
Si existe diferencia de caja, el motivo es obligatorio.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Duplicate open cash | No debe existir otra caja abierta incompatible | Sí | Sí | `blocking` | `Ya existe una caja abierta.` |
| Opening amount | Monto inicial no negativo | Sí | Sí | `blocking` | `El monto inicial no puede ser menor que cero.` |
| Business date | Caja pertenece al día operativo actual | Puede advertir | Sí | `blocking` | `La caja no corresponde al día operativo actual.` |
| Active session | Se requiere caja abierta para movimientos | Sí | Sí | `blocking` | `Debe existir una caja abierta para registrar el movimiento.` |
| Movement type | Tipo de movimiento válido | Sí | Sí | `blocking` | `Seleccione un tipo de movimiento válido.` |
| Movement amount | Monto mayor que cero | Sí | Sí | `blocking` | `El monto del movimiento debe ser mayor que cero.` |
| Movement reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para el movimiento de caja.` |
| Closed cash | No registrar movimientos en caja cerrada | Puede bloquear UI | Sí | `blocking` | `No puede registrar movimientos en una caja cerrada.` |
| Close active | Solo caja abierta puede cerrarse | Puede bloquear UI | Sí | `blocking` | `Solo puede cerrar una caja abierta.` |
| Counted amount | Monto contado no negativo | Sí | Sí | `blocking` | `El monto contado no puede ser menor que cero.` |
| Expected amount | Sistema debe calcular monto esperado | No | Sí | `blocking` | `No se pudo calcular el monto esperado de caja.` |
| Difference reason | Toda diferencia requiere motivo | Sí | Sí | `blocking` | `Debe indicar un motivo para la diferencia de caja.` |
| Already closed | No cerrar una caja cerrada | Puede bloquear UI | Sí | `blocking` | `La caja ya está cerrada.` |
| Session missing | Sesión debe existir | Sí | Sí | `blocking` | `La sesión de caja no existe.` |
| Sale after close | Operaciones posteriores requieren nueva caja | Sí | Sí | `blocking` | `Debe abrir una nueva caja para registrar operaciones posteriores al cierre.` |

### 5.9 Purchases

Regla general:

```text
Compras debe asegurar proveedor válido, productos y variantes existentes, cantidades correctas,
costos consistentes, estado controlado, recepción trazable y pagos que no excedan
saldo pendiente. La recepción registra inventario y costo histórico.

En el MVP, Purchases no debe crear productos ni variantes directamente. Si el producto o variante no existe, debe crearse primero desde Products.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Supplier | Proveedor válido y activo | Sí | Sí | `blocking` | `Debe seleccionar un proveedor válido.` |
| Purchase items | Al menos un producto | Sí | Sí | `blocking` | `Debe agregar al menos un producto a la compra.` |
| Product variant | Producto/variante existente, válido y activo | Sí | Sí | `blocking` | `El producto seleccionado no existe o no está activo.` |
| Missing product in purchase | No se permite crear producto/variante desde Purchases en el MVP | Sí | Sí | `blocking` | `Debe crear primero el producto y su variante desde Products antes de registrar la compra.` |
| Quantity | Cantidad mayor que cero | Sí | Sí | `blocking` | `La cantidad debe ser mayor que cero.` |
| Unit cost | Costo unitario mayor que cero | Sí | Sí | `blocking` | `El costo unitario debe ser mayor que cero.` |
| Purchase total | Total mayor que cero | Sí | Sí | `blocking` | `El total de la compra debe ser mayor que cero.` |
| Supplier document | Referencia válida si se registra | Sí | Sí | `blocking` | `El documento del proveedor excede la longitud permitida.` |
| Purchase date | Fecha válida | Sí | Sí | `blocking` | `Ingrese una fecha de compra válida.` |
| Receive status | Solo compras pendientes pueden recibirse | Puede bloquear UI | Sí | `blocking` | `Solo puede recibir una compra pendiente.` |
| Received items | Al menos un producto recibido | Sí | Sí | `blocking` | `Debe seleccionar al menos un producto para recibir.` |
| Received quantity | Cantidad recibida mayor que cero | Sí | Sí | `blocking` | `La cantidad recibida debe ser mayor que cero.` |
| Received limit | No exceder cantidad pendiente de recibir | Sí | Sí | `blocking` | `La cantidad recibida excede la cantidad pendiente de recibir.` |
| Inventory entry | Debe registrar entrada de inventario | No | Sí | `blocking` | `No se pudo registrar la entrada de inventario.` |
| Historical cost | Debe registrar costo histórico | No | Sí | `blocking` | `No se pudo registrar el costo histórico de la compra.` |
| Cancel status | Solo compras no recibidas pueden cancelarse | Puede bloquear UI | Sí | `blocking` | `Solo puede cancelar una compra que aún no ha sido recibida.` |
| Cancel reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para cancelar la compra.` |
| Payment amount | Pago mayor que cero | Sí | Sí | `blocking` | `El monto pagado debe ser mayor que cero.` |
| Payment limit | No exceder saldo pendiente | Sí | Sí | `blocking` | `El monto pagado no puede ser mayor que el saldo pendiente.` |
| Payment method | Método de pago válido | Sí | Sí | `blocking` | `Debe seleccionar un método de pago válido.` |

### 5.10 Supplier Returns

Regla general:

```text
Supplier Returns debe asegurar proveedor válido, productos válidos, cantidades disponibles,
motivo obligatorio, salida de inventario trazable y resolución controlada.
Todo retorno resuelto debe tener un tipo de resolución.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Supplier | Proveedor válido y activo | Sí | Sí | `blocking` | `Debe seleccionar un proveedor válido.` |
| Return items | Al menos un producto | Sí | Sí | `blocking` | `Debe agregar al menos un producto al retorno.` |
| Product variant | Producto válido y activo | Sí | Sí | `blocking` | `El producto seleccionado no existe o no está activo.` |
| Return quantity | Cantidad mayor que cero | Sí | Sí | `blocking` | `La cantidad a retornar debe ser mayor que cero.` |
| Available stock | No exceder inventario disponible | Sí | Sí | `blocking` | `La cantidad a retornar excede el inventario disponible.` |
| Return reason | Motivo obligatorio | Sí | Sí | `blocking` | `Debe indicar un motivo para el retorno a proveedor.` |
| Send status | Solo retornos permitidos pueden enviarse | Puede bloquear UI | Sí | `blocking` | `El retorno no puede enviarse en su estado actual.` |
| Inventory removal | Debe registrar salida de inventario | No | Sí | `blocking` | `No se pudo registrar la salida de inventario.` |
| Resolve status | Solo retornos enviados pueden resolverse | Puede bloquear UI | Sí | `blocking` | `Solo puede resolver un retorno que ya fue enviado.` |
| Resolution type | Todo retorno resuelto requiere tipo válido | Sí | Sí | `blocking` | `Seleccione un tipo de resolución válido.` |
| Resolution amount | Monto válido si aplica | Sí | Sí | `blocking` | `Ingrese un monto de resolución válido.` |
| Resolution detail | Nota o detalle obligatorio | Sí | Sí | `blocking` | `Debe indicar el detalle de la resolución.` |
| Supplier credit | Crédito debe registrarse de forma controlada | No | Sí | `blocking` | `No se pudo registrar el crédito del proveedor.` |

### 5.11 Reports

Regla general:

```text
Reports debe validar filtros, rangos de fechas, moneda, tipo de cambio, estados
y formatos de exportación antes de generar o exportar reportes. Reportes en USD
requieren tipo de cambio oficial configurado. Reportes de productos se cubren
dentro de ventas e inventario.
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Date range | Fecha inicial no mayor que final | Sí | Sí | `blocking` | `La fecha inicial no puede ser mayor que la fecha final.` |
| Required filters | Filtros obligatorios completos | Sí | Sí | `blocking` | `Complete los filtros requeridos para generar el reporte.` |
| Report type | Tipo de reporte válido | Sí | Sí | `blocking` | `Seleccione un tipo de reporte válido.` |
| Export format | Formato permitido | Sí | Sí | `blocking` | `Seleccione un formato de exportación válido.` |
| Empty results | Informar sin bloquear | Sí | Sí | `informational` | `No se encontraron resultados para los filtros seleccionados.` |
| Large report range | Bloquear si excede límite configurable por tipo de reporte | Sí | Sí | `blocking` | `El rango seleccionado excede el límite permitido para este reporte.` |
| Report currency | Moneda válida | Sí | Sí | `blocking` | `Seleccione una moneda válida para el reporte.` |
| USD report | Requiere tipo de cambio oficial | Sí | Sí | `blocking` | `Debe configurar el tipo de cambio oficial para generar reportes en USD.` |
| Exchange rate | Mayor que cero | Sí | Sí | `blocking` | `El tipo de cambio debe ser mayor que cero.` |

### 5.12 Admin / Catalogs

Regla general:

```text
Admin / Catalogs debe evitar duplicados, garantizar valores activos y válidos,
y proteger trazabilidad histórica. Registros de catálogo usados por operaciones
históricas no deben eliminarse físicamente; deben desactivarse.
```

Los nombres de catálogos deben normalizarse para comparar duplicados. Deben considerarse duplicados:

```text
"Nike"
"nike"
" NIKE "
```

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Catalog name | Nombre obligatorio | Sí | Sí | `blocking` | `El nombre es obligatorio.` |
| Name length | Respetar longitud máxima | Sí | Sí | `blocking` | `El nombre excede la longitud permitida.` |
| Normalized duplicate | No duplicar nombre normalizado | Puede advertir | Sí | `blocking` | `Ya existe un registro con este nombre.` |
| Catalog status | Estado válido | Sí | Sí | `blocking` | `Seleccione un estado válido.` |
| Catalog in use | No eliminar físicamente si está en uso | No | Sí | `blocking` | `No puede eliminar este registro porque ya está en uso.` |
| Catalog deactivate | Puede desactivarse si está en uso | Puede advertir | Sí | `warning` | `Este registro está en uso. Puede desactivarlo, pero no eliminarlo físicamente.` |

### 5.13 Admin / Settings

Regla general:

```text
Admin / Settings protege configuraciones que afectan ventas, apartados, caja,
reportes, seguridad y operación general. Toda modificación sensible valida permisos
en backend y registra auditoría.
```

Cuando existan procesos activos afectados, cada configuración define si aplica inmediatamente, solo a nuevas operaciones o si debe bloquearse.

| Configuración | Comportamiento confirmado |
|---|---|
| Porcentaje mínimo de apartado | Aplica solo a nuevos apartados |
| Plazo máximo de apartado | Aplica solo a nuevos apartados, salvo ajuste autorizado |
| Regla de caja | No debe cambiarse si hay caja abierta, o debe aplicar desde próxima apertura |
| Tipo de cambio oficial | Aplica a nuevos reportes generados después del cambio |
| Seguridad / sesión | Puede aplicar desde nuevo login o renovación de sesión |

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Setting key | Configuración debe existir | No | Sí | `blocking` | `La configuración solicitada no existe.` |
| Setting value | Valor cumple tipo esperado | Sí | Sí | `blocking` | `El valor ingresado no es válido para esta configuración.` |
| Sensitive setting | Solo usuarios autorizados | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |
| Audit setting change | Cambio sensible auditado | No | Sí | `blocking` | `No se pudo registrar la auditoría del cambio.` |
| Active process setting | Aplicar regla específica si afecta procesos activos | Puede advertir | Sí | `warning` / `blocking` | `Esta configuración puede afectar operaciones activas. Revise la regla de aplicación antes de continuar.` |
| Business name | Nombre del negocio obligatorio | Sí | Sí | `blocking` | `El nombre del negocio es obligatorio.` |
| Official exchange rate | Tipo de cambio mayor que cero | Sí | Sí | `blocking` | `El tipo de cambio debe ser mayor que cero.` |
| Exchange rate date | Fecha aplicable obligatoria | Sí | Sí | `blocking` | `Debe indicar la fecha del tipo de cambio.` |
| Session timeout | Tiempo de sesión mayor que cero | Sí | Sí | `blocking` | `El tiempo de sesión debe ser mayor que cero.` |

---

## 6. Validaciones transversales

### 6.1 Inventario transversal

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Available stock | Ninguna operación consume más stock del disponible | Sí | Sí | `blocking` | `La cantidad solicitada excede el stock disponible.` |
| Reserved stock | Stock reservado no se trata como disponible | Puede advertir | Sí | `blocking` | `Este producto tiene inventario reservado y no está disponible para esta operación.` |
| Movement source | Todo movimiento tiene origen trazable | No | Sí | `blocking` | `No se pudo identificar el origen del movimiento de inventario.` |
| Negative stock | Ninguna operación deja inventario negativo | No | Sí | `blocking` | `La operación no puede dejar el inventario en negativo.` |

Aplica principalmente a Sales, Layaways, Inventory Adjustments, Damaged Goods, Loaned Goods, Purchases y Supplier Returns.

### 6.2 Caja transversal

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Open cash session | Toda operación monetaria requiere caja abierta cuando aplique | Sí | Sí | `blocking` | `Debe existir una caja abierta para registrar esta operación.` |
| Closed cash session | No registrar movimientos en caja cerrada | Puede bloquear UI | Sí | `blocking` | `No puede registrar operaciones en una caja cerrada.` |
| Business date | Operación asociada al día operativo correcto | Puede advertir | Sí | `blocking` | `La operación no corresponde al día operativo actual.` |
| Cash movement source | Movimiento de caja con origen identificable | No | Sí | `blocking` | `No se pudo identificar el origen del movimiento de caja.` |

Aplica a Sales, Sale Returns, Sale Voids, Layaway Payments, Cash Movements y Purchase Payments.

### 6.3 Estado transversal

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Valid transition | Solo transiciones definidas | Puede bloquear UI | Sí | `blocking` | `La operación no es válida para el estado actual.` |
| Final status | Estados finales no se modifican directamente | Puede bloquear UI | Sí | `blocking` | `No puede modificar un registro en estado final.` |
| Cancelled status | Registros cancelados no reciben operaciones nuevas | Puede bloquear UI | Sí | `blocking` | `No puede operar sobre un registro cancelado.` |
| Completed status | Procesos completados solo cambian por flujos autorizados | Puede bloquear UI | Sí | `blocking` | `No puede modificar un proceso completado.` |

### 6.4 Permisos transversales

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Route access | Usuario requiere permiso para acceder a sección | Sí | Sí | `blocking` | `No tiene acceso a esta sección.` |
| Protected action | Usuario requiere permiso para acción sensible | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |
| Admin action | Usuarios autorizados modifican catálogos, roles, usuarios o settings | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |
| Override permission | Operaciones excepcionales requieren permiso específico | Puede ocultar acción | Sí | `blocking` | `No tiene permiso para realizar esta acción.` |

Aplica a price override, void sale, return sale, cancel layaway, write off damaged goods, convert loaned goods to sale, send/resolve supplier return, close/reopen cash y settings.

### 6.5 Auditoría transversal

Nota de alcance: `12-audit-log.md` define que, en primera etapa, la auditoría funcional persistente se limita a operaciones sensibles de Sales e Inventory. Las reglas siguientes describen la validación general para acciones sensibles, pero la persistencia en `audit_logs` se aplicará según el alcance confirmado del documento 12.

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Sensitive action reason | Motivo obligatorio cuando aplique | Sí | Sí | `blocking` | `Debe indicar un motivo para continuar.` |
| Audit user | Usuario ejecutor identificado | No | Sí | `blocking` | `No se pudo identificar el usuario que realiza la operación.` |
| Audit timestamp | Fecha y hora registradas | No | Sí | `blocking` | `No se pudo registrar la fecha y hora de la operación.` |
| Audit resource | Recurso afectado identificado | No | Sí | `blocking` | `No se pudo registrar el recurso afectado.` |
| Audit operation | Operación ejecutada identificada | No | Sí | `blocking` | `No se pudo registrar la operación ejecutada.` |

### 6.6 Cliente y saldo transversal

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Active customer | Solo clientes activos para nuevas operaciones | Sí | Sí | `blocking` | `No puede usar un cliente inactivo en esta operación.` |
| Customer balance direct edit | Saldo no se modifica manualmente | No | Sí | `blocking` | `El saldo del cliente no puede modificarse directamente.` |
| Customer balance movement | Cambio de saldo por operación trazable | No | Sí | `blocking` | `No se pudo registrar el movimiento de saldo del cliente.` |

### 6.7 Proveedor transversal

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Active supplier | Solo proveedores activos para nuevas operaciones | Sí | Sí | `blocking` | `No puede usar un proveedor inactivo en esta operación.` |
| Supplier balance / credit | Créditos del proveedor deben venir de operaciones trazables | No | Sí | `blocking` | `No se pudo registrar el crédito del proveedor.` |
| Supplier history | Proveedores con historial no se eliminan físicamente | No | Sí | `blocking` | `No puede eliminar físicamente un proveedor con historial. Debe desactivarlo.` |

### 6.8 Operaciones atómicas

Regla confirmada:

```text
Cuando una operación crítica afecte más de un módulo, todas sus validaciones,
registros y efectos secundarios deben ejecutarse como una sola operación atómica.

Si una parte de la operación falla, toda la operación debe revertirse.
```

| Operación | Módulos afectados |
|---|---|
| Venta | Sales + Inventory + Cash + Audit |
| Apartado | Layaway + Inventory Reservation + Cash + Customer Balance si aplica |
| Devolución de venta | Sales Return + Inventory + Cash + Audit |
| Anulación de venta | Sales + Inventory Reversal + Cash + Audit |
| Compra recibida | Purchases + Inventory + Historical Cost |
| Retorno a proveedor | Supplier Return + Inventory + Supplier Credit + Audit |
| Baja de mercadería dañada | Inventory + Damaged Goods + Audit |
| Conversión de mercadería prestada a venta | Loaned Goods + Sales + Inventory + Cash + Audit |
| Cierre de caja | Cash + Movements + Differences + Audit |
| Cambio sensible de configuración | Settings + Audit |

| Field / Condition | Rule | Frontend | Backend | Severity | Recommended message |
|---|---|---:|---:|---|---|
| Multi-module operation | Operaciones críticas multi-módulo deben ejecutarse atómicamente | No | Sí | `blocking` | `No se pudo completar la operación. No se aplicaron cambios.` |

---

## 7. Guía de mensajes de validación

### 7.1 Principios

| Regla | Descripción |
|---|---|
| Claridad | El mensaje explica qué está mal. |
| Acción | El mensaje indica qué debe corregir el usuario. |
| Español | Mensajes visibles al usuario en español. |
| No técnico | No mostrar nombres internos de tablas, constraints, excepciones ni errores SQL. |
| Consistencia | Reglas similares usan mensajes similares. |
| Seguridad | No revelar detalles internos, tokens, queries ni estructura técnica. |

### 7.2 Mensajes recomendados por tipo

| Tipo | Mensaje recomendado |
|---|---|
| Campo obligatorio | `Este campo es obligatorio.` |
| Valor inválido | `Ingrese un valor válido.` |
| Selección inválida | `Seleccione un valor válido.` |
| Registro inexistente | `El registro seleccionado no existe.` |
| Registro inactivo | `El registro seleccionado no está activo.` |
| Sin permiso para sección | `No tiene acceso a esta sección.` |
| Sin permiso para acción | `No tiene permiso para realizar esta acción.` |
| Estado inválido | `La operación no es válida para el estado actual.` |
| Monto inválido | `Ingrese un monto válido.` |
| Cantidad inválida | `La cantidad debe ser mayor que cero.` |
| Fecha inválida | `Ingrese una fecha válida.` |
| Rango inválido | `La fecha inicial no puede ser mayor que la fecha final.` |
| Inventario insuficiente | `La cantidad solicitada excede el stock disponible.` |
| Caja cerrada | `No puede registrar operaciones en una caja cerrada.` |
| Motivo requerido | `Debe indicar un motivo para continuar.` |
| Operación transaccional fallida | `No se pudo completar la operación. No se aplicaron cambios.` |

### 7.3 Mensajes a evitar

No mostrar mensajes técnicos como:

```text
Validation failed.
Invalid field.
Database error.
Foreign key violation.
Null value not allowed.
Unauthorized.
403 Forbidden.
500 Internal Server Error.
SQL constraint failed.
```

Ejemplos de traducción funcional:

| Mensaje técnico | Mensaje recomendado |
|---|---|
| `Unauthorized` | `No tiene permiso para realizar esta acción.` |
| `Foreign key violation` | `El registro seleccionado no existe o no es válido.` |
| `Null value not allowed` | `Este campo es obligatorio.` |
| `Stock constraint failed` | `La cantidad solicitada excede el stock disponible.` |
| `Invalid status transition` | `La operación no es válida para el estado actual.` |

---

## 8. Alineación con respuestas JSON del backend

La estructura de errores del backend ya está definida en `08-api-contracts.md`.

Regla:

```text
10-validation-rules.md no introduce una estructura paralela de errores.
Las respuestas de error del backend deben respetar el contrato estándar de API.
```

Campos obligatorios:

- `status_code`
- `code`
- `message`

Campo opcional:

- `details`

Para múltiples errores de validación:

```text
details.errors debe contener la lista de errores por campo.
Cada error dentro de details.errors puede incluir field, code y message.
```

### 8.1 Ejemplo de validación múltiple

```json
{
  "status_code": 422,
  "code": "validation.invalid_input",
  "message": "Hay campos inválidos. Revise la información ingresada.",
  "details": {
    "resource": "sale",
    "operation": "confirm_sale",
    "errors": [
      {
        "field": "customer_id",
        "code": "validation.required",
        "message": "Debe seleccionar un cliente válido."
      },
      {
        "field": "quantity",
        "code": "inventory.insufficient_stock",
        "message": "La cantidad solicitada excede el stock disponible."
      }
    ]
  }
}
```

### 8.2 Ejemplo de error de negocio

```json
{
  "status_code": 409,
  "code": "business.invalid_state",
  "message": "La operación no es válida para el estado actual.",
  "details": {
    "resource": "purchase",
    "operation": "cancel_purchase",
    "current_status": "received"
  }
}
```

### 8.3 Ejemplo de permiso insuficiente

```json
{
  "status_code": 403,
  "code": "auth.forbidden",
  "message": "No tiene permiso para realizar esta acción.",
  "details": {
    "resource": "sale",
    "operation": "void_sale",
    "required_permission": "sales.void"
  }
}
```

### 8.4 Warnings no bloqueantes

Las advertencias no bloqueantes no deben devolverse como errores HTTP. Deben incluirse como `warnings` en respuestas exitosas cuando aplique.

```json
{
  "status_code": 200,
  "message": "Pago registrado correctamente.",
  "data": {
    "layaway_id": 88,
    "payment_id": 501
  },
  "warnings": [
    {
      "code": "layaway.expired_payment_allowed",
      "message": "El apartado está vencido, pero puede registrar el pago si desea continuar."
    }
  ]
}
```

---

## 9. Documentos relacionados afectados

Las reglas de este documento impactan o complementan:

| Documento | Impacto |
|---|---|
| `04-architecture.md` | Refuerza transacciones y validaciones por capa. |
| `06-auth-rbac.md` | Refuerza validación real de permisos en backend y respuesta estándar para `auth.forbidden`. |
| `07-modules.md` | Alinea responsabilidades por módulo con reglas de validación. |
| `08-api-contracts.md` | Reutiliza y amplía el formato estándar de errores y warnings. |
| `CODE_ALIGNMENT.md` | Define cómo evolucionar el código para implementar validaciones y errores estructurados. |
| `DECISION_LOG.md` | Registra decisiones confirmadas en esta iteración. |

---

## 10. Resumen de decisiones confirmadas

- Frontend valida para UX; backend valida como fuente definitiva.
- Las reglas se clasifican como `blocking`, `warning` o `informational`.
- Mensajes visibles al usuario en español, claros y accionables.
- Login con `username`, no email.
- Precio de venta menor que costo requiere autorización.
- Saldo de cliente no se modifica directamente.
- Proveedores con historial se desactivan, no se eliminan físicamente.
- Operaciones de inventario no pueden dejar stock negativo.
- Efectivo puede exceder total de venta para calcular vuelto; transferencia/tarjeta no.
- Apartado vencido puede recibir pago con advertencia si su estado lo permite.
- Toda diferencia de caja requiere motivo.
- Costo unitario de compra debe ser mayor que cero.
- Todo retorno a proveedor resuelto requiere tipo de resolución.
- Reportes con rangos demasiado amplios se bloquean según límite configurable.
- Catálogos comparan duplicados ignorando mayúsculas/minúsculas y espacios extra.
- Cambios de settings con procesos activos se comportan según tipo de configuración.
- Operaciones críticas multi-módulo deben ser atómicas.
- Errores backend siguen `08-api-contracts.md`; warnings no bloqueantes van en respuestas exitosas.
