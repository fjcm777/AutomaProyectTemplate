# 12 - Audit Log

## Propósito

Este documento define la auditoría funcional de **Automata / Calzado Norita**.

La auditoría funcional registra acciones relevantes realizadas por usuarios sobre operaciones sensibles del negocio. Su objetivo es permitir trazabilidad posterior sobre ventas e inventario.

Este documento debe leerse junto con:

- `05-database.md`
- `07-modules.md`
- `10-validation-rules.md`
- `11-error-handling.md`

---

## 1. Separación entre audit log y logs técnicos

El audit log funcional y los logs técnicos no son lo mismo.

| Concepto | Propósito | Ejemplo | Persistencia |
|---|---|---|---|
| Logs técnicos | Diagnóstico de errores, excepciones y fallos internos | error 500, stack controlado en development, fallo de DB | stdout/stderr del backend; visible con Docker logs / Docker Compose logs |
| Audit log funcional | Historial consultable de acciones sensibles del usuario | anular venta, devolución, ajuste de inventario | Tabla persistente en base de datos |

Regla:

```text
El audit log funcional debe guardarse en una tabla persistente de base de datos,
separada de los logs técnicos de errores.
```

---

## 2. Alcance inicial

En la primera etapa, el audit log funcional se enfocará únicamente en operaciones sensibles relacionadas con:

```text
Sales / Ventas
Inventory / Inventario
```

No se auditarán todavía todos los módulos del sistema.

Regla:

```text
En la primera etapa, el audit log funcional se enfocará únicamente en operaciones sensibles relacionadas con ventas e inventario.

Otros módulos podrán integrarse al audit log en una etapa posterior si el negocio lo requiere.
```

Aunque el alcance inicial sea limitado, la tabla `audit_logs` debe ser genérica y reutilizable para permitir crecimiento futuro sin rediseñar la base de datos.

---

## 3. Tabla `audit_logs`

La auditoría funcional se registrará en una tabla persistente llamada `audit_logs`.

La tabla debe permitir registrar:

- quién ejecutó la acción;
- qué acción ejecutó;
- sobre qué recurso;
- cuándo ocurrió;
- cuál fue el resultado;
- cuál fue el motivo, cuando aplique;
- qué información relevante cambió;
- qué contexto adicional ayuda a entender la operación.

### 3.1 Estructura base

| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `id` | `BIGSERIAL` | Identificador único del registro de auditoría. |
| `user_id` | `BIGINT NULL` | Usuario que ejecutó la acción. |
| `action` | `VARCHAR(100)` | Acción funcional realizada. |
| `resource_type` | `VARCHAR(100)` | Tipo de recurso afectado. |
| `resource_id` | `VARCHAR(100) NULL` | Identificador del recurso afectado. |
| `operation_result` | `VARCHAR(30)` | Resultado de la operación: `success`, `failed` o `blocked`. |
| `reason` | `TEXT NULL` | Motivo funcional de la acción cuando aplique. |
| `before_data` | `JSONB NULL` | Resumen del estado anterior relevante. |
| `after_data` | `JSONB NULL` | Resumen del estado posterior relevante. |
| `metadata` | `JSONB NULL` | Contexto adicional de la operación. |
| `ip_address` | `VARCHAR(45) NULL` | IP de origen si está disponible. |
| `user_agent` | `TEXT NULL` | Navegador/dispositivo si está disponible. |
| `created_at` | `TIMESTAMPTZ` | Fecha y hora del evento. |

### 3.2 Regla de diseño

```text
La tabla audit_logs debe ser genérica y reutilizable por todos los módulos sensibles.
Debe registrar quién ejecutó la acción, qué acción ejecutó, sobre qué recurso,
cuándo ocurrió, cuál fue el resultado, el motivo cuando aplique,
y los datos antes/después cuando sea útil para trazabilidad.
```

### 3.3 Índices recomendados

| Índice | Uso |
|---|---|
| `created_at` | Consultas por fecha. |
| `user_id` | Consultas por usuario. |
| `action` | Consultas por tipo de acción. |
| `resource_type`, `resource_id` | Consultar historial de un recurso específico. |
| `operation_result` | Revisar operaciones fallidas o bloqueadas. |

---

## 4. Resultado de operación

`operation_result` debe indicar qué ocurrió con la operación auditada.

| Valor | Uso |
|---|---|
| `success` | La operación se completó correctamente. |
| `failed` | La operación intentó ejecutarse, pero falló por error técnico o transaccional. |
| `blocked` | La operación fue impedida por validación, permisos o estado inválido. |

Regla:

```text
La auditoría funcional debe registrar operaciones exitosas y también intentos fallidos o bloqueados
cuando el intento sea relevante para seguridad, dinero, inventario, configuración,
estado de procesos o trazabilidad del negocio.
```

En la primera etapa, esta regla aplica especialmente a ventas e inventario.

---

## 5. Acciones auditables iniciales

No todo clic, vista o consulta debe auditarse.

En la primera etapa, las acciones auditables serán únicamente operaciones sensibles de ventas e inventario.

### 5.1 Sales

| Acción | `action` sugerido | Resultado esperado |
|---|---|---|
| Venta confirmada | `sales.confirm` | `success` |
| Venta anulada | `sales.void` | `success` |
| Devolución registrada | `sales.return` | `success` |
| Intento bloqueado de anulación | `sales.void.blocked` | `blocked` |
| Intento bloqueado de devolución | `sales.return.blocked` | `blocked` |

### 5.2 Inventory

| Acción | `action` sugerido | Resultado esperado |
|---|---|---|
| Ajuste de inventario | `inventory.adjust` | `success` |
| Movimiento manual de inventario | `inventory.manual_movement` | `success` |
| Baja por daño | `inventory.damage_write_off` | `success` |
| Préstamo de producto | `inventory.loan` | `success` |
| Retorno de producto prestado | `inventory.loan_return` | `success` |
| Conversión de producto prestado a venta | `inventory.loan_convert_to_sale` | `success` |
| Intento bloqueado por stock insuficiente | `inventory.insufficient_stock.blocked` | `blocked` |
| Intento bloqueado por estado inválido | `inventory.invalid_state.blocked` | `blocked` |

Regla:

```text
Deben auditarse las acciones de ventas e inventario que confirmen, anulen,
devuelvan, ajusten, presten, retornen, den de baja o conviertan productos.

También deben auditarse intentos bloqueados relevantes cuando estén relacionados
con stock insuficiente, estado inválido, anulación o devolución no permitida.
```

---

## 6. `reason`: motivo funcional de la acción

`reason` representa el motivo funcional de la acción auditada.

No es un error técnico ni un comentario interno del sistema. Es la explicación de por qué el usuario ejecutó una acción sensible.

Ejemplos:

| Acción | `reason` esperado |
|---|---|
| Anular una venta | `El cajero seleccionó un método de pago incorrecto.` |
| Registrar devolución | `El cliente devolvió el producto por talla incorrecta.` |
| Ajuste de inventario | `Conteo físico encontró una unidad menos.` |
| Baja por daño | `Producto dañado por humedad en bodega.` |
| Préstamo de producto | `Producto prestado para exhibición externa.` |
| Convertir préstamo a venta | `Cliente decidió comprar el producto prestado.` |

### 6.1 Cuándo es obligatorio

`reason` debe ser obligatorio para operaciones auditables excepcionales, correctivas o sensibles.

| Operación | `reason` obligatorio |
|---|---:|
| Venta confirmada normal | No |
| Movimiento automático por venta | No |
| Movimiento automático por devolución | No |
| Movimiento automático por anulación | No |
| Venta anulada | Sí |
| Devolución registrada | Sí |
| Ajuste manual de inventario | Sí |
| Movimiento manual de inventario | Sí |
| Baja por daño | Sí |
| Préstamo de producto | Sí |
| Retorno de producto prestado | Sí |
| Conversión de producto prestado a venta | Sí |

Regla:

```text
reason debe ser obligatorio para operaciones auditables excepcionales,
correctivas o sensibles, como anulaciones, devoluciones, ajustes manuales,
bajas por daño, préstamos, retornos de préstamos y conversiones a venta.

Las operaciones normales o automáticas pueden auditarse sin motivo manual,
siempre que metadata permita identificar su origen.
```

---

## 7. `before_data`, `after_data` y `metadata`

`before_data` y `after_data` deben guardar datos resumidos y relevantes, no snapshots completos innecesarios.

| Campo | Uso |
|---|---|
| `before_data` | Resumen del estado anterior relevante. |
| `after_data` | Resumen del estado posterior relevante. |
| `metadata` | Contexto adicional que no pertenece directamente al antes/después. |

Regla:

```text
before_data y after_data no deben almacenar copias completas innecesarias del registro.
Deben guardar únicamente los datos necesarios para entender el cambio funcional,
reconstruir la decisión y facilitar revisión posterior.
```

### 7.1 Ejemplos por operación

| Operación | `before_data` | `after_data` |
|---|---|---|
| Venta anulada | Estado anterior, total, caja, productos afectados | Estado anulado, reversión de inventario y caja |
| Devolución de venta | Venta original, productos vendidos, cantidades disponibles para devolución | Productos devueltos, monto devuelto, inventario reintegrado |
| Ajuste de inventario | Stock anterior, producto, ubicación | Stock nuevo, cantidad ajustada, motivo |
| Baja por daño | Stock disponible antes, producto afectado | Stock después, cantidad dada de baja, motivo de daño |
| Préstamo de producto | Stock disponible antes, producto afectado | Cantidad prestada, responsable, stock restante |
| Retorno de producto prestado | Cantidad prestada pendiente | Cantidad retornada, stock actualizado |
| Conversión de prestado a venta | Producto prestado, responsable, estado pendiente | Venta generada, stock/estado actualizado |

### 7.2 Ejemplo JSON

```json
{
  "action": "sales.void",
  "resource_type": "sale",
  "resource_id": "125",
  "operation_result": "success",
  "reason": "El cajero seleccionó un método de pago incorrecto.",
  "before_data": {
    "sale_id": 125,
    "status": "confirmed",
    "total": 1500.00,
    "cash_session_id": 12
  },
  "after_data": {
    "sale_id": 125,
    "status": "voided",
    "inventory_reversed": true,
    "cash_reversed": true
  },
  "metadata": {
    "business_date": "2026-07-27",
    "cash_session_id": 12
  }
}
```

---

## 8. Registro desde backend

La auditoría funcional debe registrarse desde backend, no desde frontend.

Regla:

```text
El frontend puede enviar reason cuando la operación lo requiera,
pero el backend es responsable de crear el audit log con usuario autenticado,
recurso afectado, resultado, datos antes/después y metadata segura.
```

El backend debe obtener de forma confiable:

- `user_id` desde la sesión/token autenticado;
- `created_at` desde el servidor o base de datos;
- `resource_type` y `resource_id` desde la operación ejecutada;
- `operation_result` desde el resultado real de la operación;
- `before_data` y `after_data` desde el service/repository;
- `ip_address` y `user_agent` si están disponibles.

No se debe confiar en que el frontend envíe datos de auditoría completos.

---

## 9. Atomicidad con operaciones críticas

Cuando una operación crítica incluye cambios de negocio y auditoría, debe evitar inconsistencias.

Ejemplos:

| Operación | Debe quedar consistente |
|---|---|
| Anular venta | Venta + reversión de inventario + reversión de caja + audit log |
| Registrar devolución | Devolución + inventario + caja + audit log |
| Ajuste de inventario | Stock + movimiento de inventario + audit log |
| Baja por daño | Stock + registro de daño + movimiento + audit log |
| Conversión de prestado a venta | Préstamo + venta + inventario + caja + audit log |

Regla:

```text
Las operaciones críticas de ventas e inventario deben registrar auditoría dentro del flujo transaccional correspondiente.
Si la operación de negocio falla, no debe quedar un audit log de éxito.
Si la auditoría obligatoria falla en una acción sensible, la operación debe tratarse como fallida para evitar pérdida de trazabilidad.
```

Para intentos bloqueados por permisos, estado o validación, el backend puede registrar un audit log con `operation_result = blocked` cuando el intento sea relevante.

---

## 10. Sin interfaz de audit log en primera etapa

En la primera etapa no habrá una pantalla o módulo frontend para consultar el audit log.

Regla:

```text
En la primera etapa, el audit log funcional se registrará en base de datos
para trazabilidad interna, pero no tendrá una interfaz de consulta dentro del sistema.

La consulta de auditoría podrá hacerse directamente a nivel técnico o administrativo
desde base de datos cuando sea necesario.
```

Implicaciones:

| Punto | Decisión |
|---|---|
| Pantalla de audit log | No |
| Consulta desde frontend | No |
| Edición desde interfaz | No |
| Eliminación desde interfaz | No |
| Exportación desde interfaz | No |
| Consulta técnica/admin desde DB | Sí |

Aunque no exista interfaz, la tabla debe seguir protegida contra modificaciones desde flujos normales del sistema.

---

## 11. Retención y eliminación

En la primera etapa, el audit log se conservará sin eliminación automática.

Regla:

```text
En la primera etapa, los registros de audit log no se eliminarán automáticamente.
La auditoría funcional debe conservarse para trazabilidad histórica de ventas e inventario.

Cualquier política de retención, archivado o limpieza de auditoría se definirá en una etapa posterior.
```

Implicaciones:

| Punto | Decisión |
|---|---|
| Eliminación automática | No |
| Edición de registros auditados | No |
| Eliminación desde interfaz | No aplica |
| Limpieza programada | No |
| Archivado histórico | Futuro |
| Retención configurable | Futuro |

---

## 12. Relación con validaciones

`10-validation-rules.md` define cuándo una operación requiere motivo, permisos, estado válido o transacción atómica.

Este documento define cómo registrar la auditoría funcional cuando esas operaciones ocurren.

Regla:

```text
Las validaciones pueden bloquear una operación antes de ejecutarla.
Si el intento bloqueado es relevante para ventas o inventario, puede registrarse en audit_logs con operation_result = blocked.
```

Ejemplos:

| Caso | Auditoría |
|---|---|
| Usuario intenta anular venta fuera del día operativo | `sales.void.blocked` |
| Usuario intenta devolución sobre venta no válida | `sales.return.blocked` |
| Ajuste de inventario dejaría stock negativo | `inventory.invalid_state.blocked` |
| Venta intenta consumir stock insuficiente | `inventory.insufficient_stock.blocked` |

---

## 13. Relación con error handling

`11-error-handling.md` define cómo responder errores API y cómo registrar fallos técnicos.

El audit log no reemplaza el manejo técnico de errores.

Regla:

```text
Un error técnico puede tener trace_id y log técnico interno.
Una acción sensible puede tener audit log funcional.
Ambos registros pueden coexistir, pero cumplen propósitos distintos.
```

Ejemplo:

| Caso | Error handling | Audit log |
|---|---|---|
| Fallo transaccional al anular venta | Respuesta `business.transaction_failed` con `trace_id` | `sales.void` con `operation_result = failed`, si el intento llegó a ejecutarse |
| Stock insuficiente | Respuesta `inventory.insufficient_stock` | `inventory.insufficient_stock.blocked`, si el intento es relevante |
| Error 500 inesperado | Respuesta `system.internal_error` con `trace_id` | Solo si la acción funcional amerita trazabilidad |

---

## 14. Relación con documentos futuros

Este documento deja fuera de alcance para etapas posteriores:

- interfaz de consulta de audit log;
- exportación de auditoría desde frontend;
- política de retención configurable;
- archivado histórico;
- auditoría extendida a todos los módulos;
- auditoría específica de contabilidad futura.

---

## 15. Decisiones confirmadas

| Decisión | Estado |
|---|---|
| Auditoría funcional persistente en base de datos | `CONFIRMED` |
| Audit log separado de logs técnicos | `CONFIRMED` |
| Tabla `audit_logs` genérica y reutilizable | `CONFIRMED` |
| `operation_result`: `success`, `failed`, `blocked` | `CONFIRMED` |
| Alcance inicial limitado a Sales e Inventory | `CONFIRMED` |
| `before_data` y `after_data` guardan datos resumidos, no snapshots completos | `CONFIRMED` |
| `reason` representa el motivo funcional de la acción | `CONFIRMED` |
| `reason` obligatorio solo para operaciones sensibles/correctivas | `CONFIRMED` |
| Sin interfaz de audit log en primera etapa | `CONFIRMED` |
| Sin eliminación automática en primera etapa | `CONFIRMED` |
