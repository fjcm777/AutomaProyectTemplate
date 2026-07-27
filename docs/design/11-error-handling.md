# 11 - Error Handling

## Propósito

Este documento define cómo Automata / Calzado Norita debe manejar errores técnicos, errores de validación, errores de negocio, errores de permisos, errores transaccionales y advertencias no bloqueantes.

Debe servir como guía para backend, frontend, QA y desarrollo asistido con IA.

Este documento no redefine el contrato API. Debe mantenerse alineado con:

- `04-architecture.md`
- `06-auth-rbac.md`
- `08-api-contracts.md`
- `10-validation-rules.md`
- `12-audit-log.md` cuando sea creado

---

## 1. Principios generales

| Principio | Regla |
|---|---|
| Contrato único | Toda respuesta de error del backend debe seguir el contrato definido en `08-api-contracts.md`. |
| Seguridad | No se deben exponer errores técnicos internos al usuario final. |
| Claridad | Los mensajes visibles al usuario deben estar en español, ser claros y accionables. |
| Trazabilidad | Los errores internos, críticos y transaccionales deben poder rastrearse mediante `trace_id`. |
| Consistencia | Errores similares deben usar códigos y mensajes similares en todos los módulos. |
| Separación | Error handling técnico no reemplaza la auditoría funcional. |
| Ambiente | El nivel de detalle puede variar entre `development` y `production`. |

Regla:

```text
El sistema debe responder errores de forma segura, consistente y trazable,
sin revelar detalles internos al usuario final y sin crear estructuras paralelas
al contrato API ya definido.
```

---

## 2. Formato estándar de error API

El formato base de error ya fue definido en `08-api-contracts.md`.

Campos obligatorios:

| Campo | Uso |
|---|---|
| `status_code` | Código HTTP también incluido en el body. |
| `code` | Código funcional del error. |
| `message` | Mensaje visible para el usuario. |

Campo opcional:

| Campo | Uso |
|---|---|
| `details` | Contexto adicional seguro para frontend, soporte o diagnóstico. |

Ejemplo:

```json
{
  "status_code": 409,
  "code": "business.invalid_state",
  "message": "La operación no es válida para el estado actual.",
  "details": {
    "resource": "sale",
    "operation": "void_sale",
    "current_status": "returned"
  }
}
```

Reglas obligatorias:

```text
El HTTP status real debe coincidir con status_code del body.
No se debe usar error_code como estructura paralela.
No se debe hacer severity obligatorio en el JSON público.
```

---

## 3. Relación con severity de validaciones

`10-validation-rules.md` usa `severity` como clasificación documental:

| Severity | Uso |
|---|---|
| `blocking` | Bloquea guardar, confirmar o ejecutar la operación. |
| `warning` | Advierte, pero permite continuar si la regla funcional lo permite. |
| `informational` | Solo informa. |

Importante:

```text
severity no reemplaza status_code, code, message ni details.
severity no es campo obligatorio del JSON público del backend.
```

---

## 4. Categorías de códigos funcionales

Los códigos funcionales deben usar un prefijo por dominio.

| Categoría | Uso |
|---|---|
| `auth.*` | Autenticación, autorización y sesión. |
| `validation.*` | Validaciones de entrada, formulario o schema. |
| `resource.*` | Recursos inexistentes, inactivos o no disponibles. |
| `business.*` | Reglas de negocio, estados y operaciones inválidas. |
| `inventory.*` | Stock, movimientos, reservas, productos dañados o prestados. |
| `cash.*` | Caja, sesiones, movimientos, diferencias y cierres. |
| `sales.*` | Ventas, anulaciones, devoluciones y comprobantes. |
| `layaway.*` | Apartados, pagos, vencimientos, cancelaciones y cierres. |
| `purchase.*` | Compras, recepción, cancelación y pagos a proveedor. |
| `supplier.*` | Proveedores, retornos y créditos de proveedor. |
| `settings.*` | Configuraciones del sistema. |
| `system.*` | Errores internos, infraestructura o comportamiento inesperado. |

Regla:

```text
Los códigos deben representar el problema funcional, no la excepción técnica interna.
```

Ejemplos válidos:

```text
auth.invalid_credentials
auth.forbidden
validation.invalid_input
resource.not_found
business.invalid_state
business.transaction_failed
inventory.insufficient_stock
cash.closed_session
layaway.expired_payment_allowed
purchase.already_received
supplier.return_already_resolved
settings.invalid_value
system.internal_error
```

Ejemplos que deben evitarse:

```text
SQL_ERROR
FOREIGN_KEY_FAILED
PYDANTIC_EXCEPTION
NULL_REFERENCE
UNHANDLED_EXCEPTION
```

---

## 5. Errores de validación

Los errores de validación ocurren cuando la entrada del usuario no cumple reglas de estructura, formato o negocio.

### 5.1 Validación simple

Ejemplo:

```json
{
  "status_code": 422,
  "code": "validation.invalid_input",
  "message": "Ingrese un valor válido.",
  "details": {
    "field": "quantity"
  }
}
```

### 5.2 Validaciones múltiples

Cuando existan varios errores, deben viajar en `details.errors`.

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

Cada elemento de `details.errors` puede incluir:

| Campo | Uso |
|---|---|
| `field` | Campo relacionado con el error, cuando aplique. |
| `code` | Código específico de ese error individual. |
| `message` | Mensaje visible del error individual. |

Regla:

```text
El frontend debe usar details.errors para pintar errores por campo cuando exista esa lista.
```

---

## 6. Errores de autenticación y permisos

### 6.1 No autenticado

Se usa cuando el usuario no tiene sesión válida o no envía token.

```json
{
  "status_code": 401,
  "code": "auth.unauthorized",
  "message": "Debe iniciar sesión para continuar."
}
```

### 6.2 Credenciales inválidas

```json
{
  "status_code": 401,
  "code": "auth.invalid_credentials",
  "message": "Usuario o contraseña incorrectos."
}
```

### 6.3 Sesión expirada

```json
{
  "status_code": 401,
  "code": "auth.session_expired",
  "message": "Su sesión ha expirado. Inicie sesión nuevamente."
}
```

### 6.4 Sin permiso para acción

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

### 6.5 Sin acceso a sección

```json
{
  "status_code": 403,
  "code": "auth.forbidden",
  "message": "No tiene acceso a esta sección.",
  "details": {
    "resource": "reports",
    "operation": "view_reports"
  }
}
```

Regla:

```text
El frontend puede ocultar secciones o acciones, pero el backend siempre debe validar permisos.
```

---

## 7. Errores de recurso

Los errores de recurso aplican cuando una entidad no existe, está inactiva o no puede usarse.

### 7.1 Recurso no encontrado

```json
{
  "status_code": 404,
  "code": "resource.not_found",
  "message": "El recurso solicitado no existe.",
  "details": {
    "resource": "product",
    "id": 15
  }
}
```

### 7.2 Recurso inactivo

```json
{
  "status_code": 409,
  "code": "resource.inactive",
  "message": "El registro seleccionado no está activo.",
  "details": {
    "resource": "customer",
    "id": 20
  }
}
```

### 7.3 Registro ya existe

```json
{
  "status_code": 409,
  "code": "resource.duplicate",
  "message": "Ya existe un registro con este nombre.",
  "details": {
    "resource": "brand",
    "field": "name"
  }
}
```

---

## 8. Errores de negocio

Los errores de negocio ocurren cuando la solicitud es técnicamente válida, pero viola una regla funcional.

### 8.1 Estado inválido

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

### 8.2 Inventario insuficiente

```json
{
  "status_code": 409,
  "code": "inventory.insufficient_stock",
  "message": "La cantidad solicitada excede el stock disponible.",
  "details": {
    "resource": "inventory",
    "field": "quantity",
    "product_id": 125,
    "product_code": "F102",
    "requested_quantity": 3,
    "available_quantity": 1
  }
}
```

### 8.3 Caja cerrada

```json
{
  "status_code": 409,
  "code": "cash.closed_session",
  "message": "No puede registrar operaciones en una caja cerrada.",
  "details": {
    "resource": "cash",
    "operation": "register_payment"
  }
}
```

---

## 9. Errores transaccionales

Las operaciones críticas multi-módulo deben ejecutarse como transacciones atómicas.

Ejemplos:

| Operación | Módulos afectados |
|---|---|
| Confirmar venta | Sales + Inventory + Cash + Audit |
| Anular venta | Sales + Inventory Reversal + Cash + Audit |
| Devolución de venta | Sales Return + Inventory + Cash + Audit |
| Completar apartado | Layaway + Sales + Inventory + Cash |
| Recibir compra | Purchases + Inventory + Historical Cost |
| Retorno a proveedor | Supplier Return + Inventory + Supplier Credit + Audit |
| Cierre de caja | Cash + Movements + Differences + Audit |

Código estándar confirmado:

```text
business.transaction_failed
```

Respuesta recomendada:

```json
{
  "status_code": 409,
  "code": "business.transaction_failed",
  "message": "No se pudo completar la operación. No se aplicaron cambios.",
  "details": {
    "resource": "sale",
    "operation": "confirm_sale",
    "trace_id": "REQ-20260726-000123"
  }
}
```

Regla:

```text
Si una parte de una operación crítica falla, toda la operación debe revertirse.
La respuesta no debe afirmar cambios parciales.
```

---

## 10. Errores internos inesperados

Código estándar confirmado:

```text
system.internal_error
```

Respuesta segura para producción:

```json
{
  "status_code": 500,
  "code": "system.internal_error",
  "message": "Ocurrió un error inesperado. Intente nuevamente o contacte al administrador.",
  "details": {
    "trace_id": "REQ-20260726-000124"
  }
}
```

Regla:

```text
El usuario final no debe ver stack traces, errores SQL, nombres internos de constraints,
rutas internas, tokens, secretos ni detalles técnicos sensibles.
```

---

## 11. trace_id

`trace_id` es un identificador de trazabilidad para soporte y diagnóstico.

Debe incluirse en `details` cuando aplique a:

- errores internos inesperados;
- errores transaccionales;
- errores críticos de servicios;
- errores repetidos o difíciles de diagnosticar;
- fallos de integración futura.

Ejemplo:

```json
{
  "status_code": 500,
  "code": "system.internal_error",
  "message": "Ocurrió un error inesperado. Intente nuevamente o contacte al administrador.",
  "details": {
    "trace_id": "REQ-20260726-000124"
  }
}
```

Regla:

```text
trace_id no debe reemplazar el logging interno.
Debe permitir relacionar la respuesta enviada al usuario con los registros internos del sistema.
```

---

## 12. Advertencias no bloqueantes

Las advertencias que no bloquean la operación no deben devolverse como errores HTTP.

Deben incluirse en respuestas exitosas mediante `warnings`.

Ejemplo:

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

Regla:

```text
Si la operación fue exitosa, el HTTP status debe ser exitoso.
Las advertencias no bloqueantes deben viajar en warnings.
```

---

## 13. Comportamiento por ambiente

### 13.1 Production

En producción, los errores deben ser seguros y no revelar detalles internos.

No se debe exponer:

- stack traces;
- SQL;
- nombres internos de constraints;
- rutas internas del servidor;
- tokens;
- secretos;
- payloads sensibles;
- detalles de infraestructura.

### 13.2 Development

En desarrollo, el backend puede incluir detalle técnico controlado para facilitar debugging.

Regla:

```text
El detalle técnico en development debe ayudar al desarrollador,
pero no debe modificar el contrato base de error.
```

Ejemplo conceptual en development:

```json
{
  "status_code": 500,
  "code": "system.internal_error",
  "message": "Ocurrió un error inesperado. Intente nuevamente o contacte al administrador.",
  "details": {
    "trace_id": "REQ-20260726-000124",
    "debug": {
      "exception_type": "IntegrityError",
      "module": "sales"
    }
  }
}
```

Importante:

```text
El bloque debug solo debe habilitarse en development y nunca debe exponerse en production.
```

---

## 14. Logging técnico interno

El sistema debe registrar internamente errores relevantes para soporte y diagnóstico.

Deben registrarse internamente:

- errores 500;
- errores transaccionales;
- fallos de conexión a base de datos;
- fallos de jobs;
- errores al procesar imágenes;
- errores inesperados de servicios críticos;
- errores repetidos de permisos cuando puedan indicar mal uso o intento no autorizado;
- fallos de integración futura.

Regla confirmada:

```text
La ubicación física definitiva de los logs técnicos se definirá más adelante.
```

Por tanto, este documento solo establece la necesidad de logging interno, sin decidir todavía si la persistencia final será consola, archivo, base de datos o servicio externo.

Regla provisional:

```text
El sistema debe registrar internamente los errores relevantes para soporte y diagnóstico.
Los errores críticos, internos y transaccionales deben incluir trace_id.
La estrategia definitiva de almacenamiento de logs técnicos será definida en una etapa posterior.
```

---

## 15. Separación entre error handling y auditoría

Los logs técnicos y la auditoría funcional son conceptos distintos.

| Concepto | Uso |
|---|---|
| Error handling | Manejar errores, responder al frontend, registrar fallos técnicos y permitir diagnóstico. |
| Auditoría funcional | Registrar acciones sensibles realizadas por usuarios y cambios relevantes del negocio. |

Ejemplos de error handling:

- error interno inesperado;
- fallo de transacción;
- inventario insuficiente;
- sesión expirada;
- validaciones inválidas.

Ejemplos de auditoría funcional:

- anular venta;
- registrar devolución;
- cerrar caja;
- modificar roles;
- cambiar configuración sensible;
- registrar baja de mercadería dañada.

Regla:

```text
Un error técnico no reemplaza un registro de auditoría funcional.
Una acción sensible puede requerir auditoría incluso si termina exitosamente.
```

La estructura detallada de auditoría se definirá en `12-audit-log.md`.

---

## 16. Responsabilidad por capa

| Capa | Responsabilidad en errores |
|---|---|
| `schemas.py` | Detectar errores de estructura, tipos y formatos básicos. |
| `service.py` | Detectar reglas de negocio, estados, permisos funcionales y transacciones. |
| `repository.py` | No debe traducir errores funcionales; debe reportar fallos de persistencia a la capa superior. |
| `api.py` | Convertir excepciones controladas en respuestas API estándar. |
| `core/errors.py` o `shared/errors.py` | Definir excepciones estándar y mapeo a respuestas. |
| `core/logging.py` | Configurar logging técnico según ambiente. |
| Frontend | Mostrar mensajes en español, usar `details.errors` y manejar `warnings`. |

Regla:

```text
La lógica de negocio no debe depender de strings sueltos de error.
Debe usar excepciones o helpers estándar para garantizar respuestas consistentes.
```

---

## 17. Mapeo recomendado de HTTP status

| HTTP status | Uso recomendado |
|---|---|
| 400 | Request inconsistente o regla de negocio general inválida. |
| 401 | Usuario no autenticado, token inválido o sesión expirada. |
| 403 | Usuario autenticado sin permiso suficiente. |
| 404 | Recurso inexistente. |
| 409 | Conflicto de negocio, estado inválido, duplicado o operación transaccional fallida. |
| 422 | Validaciones de entrada, schema o campos inválidos. |
| 500 | Error interno inesperado. |

Regla:

```text
El status HTTP debe expresar la categoría técnica general,
y code debe expresar el problema funcional específico.
```

---

## 18. Errores que deben evitarse en pantalla

No se deben mostrar al usuario final mensajes como:

```text
Database error.
SQL constraint failed.
Foreign key violation.
Null value not allowed.
Unauthorized.
403 Forbidden.
500 Internal Server Error.
Traceback...
IntegrityError...
```

Deben traducirse a mensajes funcionales:

| Técnico | Usuario final |
|---|---|
| `Unauthorized` | `Debe iniciar sesión para continuar.` |
| `Forbidden` | `No tiene permiso para realizar esta acción.` |
| `Foreign key violation` | `El registro seleccionado no existe o no es válido.` |
| `Unique constraint failed` | `Ya existe un registro con estos datos.` |
| `Invalid status transition` | `La operación no es válida para el estado actual.` |
| `Insufficient stock` | `La cantidad solicitada excede el stock disponible.` |
| `Internal server error` | `Ocurrió un error inesperado. Intente nuevamente o contacte al administrador.` |

---

## 19. Guía para frontend

El frontend debe:

- leer `status_code`, `code`, `message` y `details`;
- mostrar `message` como mensaje principal;
- usar `details.errors` para errores por campo;
- manejar `warnings` en respuestas exitosas;
- redirigir a `/login` cuando reciba `auth.session_expired` o `auth.unauthorized`;
- mostrar `/forbidden` o mensaje equivalente para `auth.forbidden` cuando aplique;
- no mostrar detalles técnicos de `details.debug` aunque existan en development, salvo herramienta interna de desarrollo.

Regla:

```text
El frontend no debe construir mensajes técnicos a partir de excepciones.
Debe mostrar los mensajes seguros entregados por el backend.
```

---

## 20. Relación con documentos posteriores

`11-error-handling.md` deja pendiente para `12-audit-log.md`:

- estructura de tabla de auditoría;
- eventos auditables;
- retención de auditoría;
- consulta de auditoría;
- permisos para ver auditoría;
- separación entre auditoría técnica y funcional si aplica.

También deja pendiente para una etapa posterior:

- almacenamiento físico definitivo de logs técnicos;
- herramienta externa de observabilidad;
- retención de logs técnicos;
- alertas automáticas por errores críticos.

---

## 21. Resumen de reglas confirmadas

| Regla | Estado |
|---|---|
| Usar contrato estándar de `08-api-contracts.md` | `CONFIRMED` |
| No usar `error_code` | `CONFIRMED` |
| No hacer `severity` obligatorio en JSON público | `CONFIRMED` |
| Usar `details.errors` para validaciones múltiples | `CONFIRMED` |
| Usar `warnings` para advertencias no bloqueantes | `CONFIRMED` |
| Usar `system.internal_error` para errores inesperados | `CONFIRMED` |
| Usar `business.transaction_failed` para fallos transaccionales | `CONFIRMED` |
| Usar `trace_id` para errores internos, críticos y transaccionales | `CONFIRMED` |
| Ocultar detalle técnico en producción | `CONFIRMED` |
| Permitir detalle técnico controlado en desarrollo | `CONFIRMED` |
| Diferenciar error handling de auditoría funcional | `CONFIRMED` |
| Definir almacenamiento físico de logs más adelante | `CONFIRMED` |
