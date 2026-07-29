# AI Context - Automata / Calzado Norita

**Documento derivado:** contexto maestro para desarrollo asistido por IA  
**Base documental:** documentos `00` a `15`  
**Estado:** derivado de decisiones confirmadas  
**Uso:** entregar este archivo a una IA o desarrollador antes de pedir implementaciones, revisiones o generación de código.

---

## 1. Propósito del sistema

Automata es un sistema ERP/POS operativo para **Calzado Norita**, una tienda inicialmente enfocada en calzado y preparada para manejar ropa y accesorios en el futuro.

El sistema debe permitir operar de forma controlada:

- catálogo de productos y variantes;
- clientes;
- proveedores;
- inventario;
- caja;
- ventas;
- apartados;
- compras;
- retornos a proveedor;
- productos dañados;
- productos prestados;
- reportes operativos;
- auditoría funcional limitada;
- validaciones y trazabilidad mínima.

La documentación debe servir como guía para desarrollo humano y desarrollo asistido por IA. Una IA no debe inventar alcance, módulos, contratos, rutas o reglas que contradigan los documentos fuente.

---

## 2. Stack técnico confirmado

| Área | Decisión |
|---|---|
| Backend | FastAPI |
| Frontend | React + TypeScript |
| Router frontend | React Router v6 |
| Base de datos | PostgreSQL 16 |
| ORM | SQLAlchemy 2.x async |
| Migraciones | Alembic async |
| Seeds | Mediante migraciones Alembic |
| Contenedores | Docker Compose |
| Arquitectura | Monolito modular |
| Autenticación | OAuth2/token flow con `username` y `password` |
| Password hashing | Argon2 |
| Moneda principal | Córdobas |
| USD | Solo para reportes con tipo de cambio oficial configurado |

---

## 3. Principios de arquitectura

El sistema usa un **monolito modular**. Esto significa:

- no se implementan microservicios en el MVP;
- cada módulo debe tener responsabilidades claras;
- se permite comunicación entre módulos cuando sea funcionalmente necesaria;
- los flujos críticos multi-módulo deben ejecutarse de forma transaccional;
- si una parte de una operación crítica falla, toda la operación debe revertirse;
- se debe preparar la arquitectura para integraciones futuras, pero sin implementarlas en el MVP.

Operaciones críticas multi-módulo incluyen, entre otras:

- confirmar venta;
- anular venta;
- registrar devolución;
- crear apartado;
- registrar pago de apartado;
- completar apartado;
- cancelar apartado;
- recibir compra;
- retornar a proveedor;
- registrar baja por daño;
- convertir producto prestado a venta;
- cerrar caja.

---

## 4. Módulos reales acordados

Estos son los módulos reales del sistema. No deben confundirse con workflows internos.

| Módulo | MVP | Nota |
|---|---:|---|
| Auth / Users | Sí | Login con `username`, gestión de usuarios, usuarios activos/inactivos |
| Roles / Permissions | Sí | RBAC dinámico en base de datos |
| Admin / Catalogs | Sí | Categorías, marcas, tallas, colores, métodos de pago y catálogos base |
| Admin / Settings | Sí | Configuración básica del negocio y operación |
| Products | Sí | Catálogo maestro de productos y variantes |
| Customers | Sí | Clientes, datos obligatorios y saldo controlado |
| Suppliers | Sí | Proveedores y datos de contacto |
| Inventory | Sí | Stock, movimientos, ajustes, dañados y prestados |
| Cash | Sí | Caja operativa, apertura, movimientos, cierre y diferencias |
| Sales | Sí | Venta, anulación, devolución y comprobante |
| Layaways | Sí | Apartados, pagos, completado y cancelación |
| Purchases | Sí | Compras, recepción, cancelación y pago a proveedor |
| Reports | Sí, básico | Reportes operativos, no BI avanzado |
| Audit Log | Sí, limitado | Solo Sales e Inventory en primera etapa, sin UI |
| Accounting | No | Segunda etapa / post-MVP |

---

## 5. Workflows incluidos en el MVP

Estos workflows pertenecen a módulos existentes. No deben modelarse como módulos independientes salvo que un documento fuente lo indique explícitamente.

| Workflow | Pertenece a |
|---|---|
| Sale Voids / Anulación de venta | Sales + Inventory + Cash + Audit Log cuando aplique |
| Sale Returns / Devolución de venta | Sales + Inventory + Cash + Audit Log cuando aplique |
| Cash Opening / Apertura de caja | Cash |
| Cash Closing / Cierre de caja | Cash, usando movimientos generados por Sales y otros movimientos |
| Cash Difference / Diferencia de caja | Cash |
| Inventory Adjustments / Ajustes de inventario | Inventory |
| Damaged Goods / Productos dañados | Inventory |
| Loaned Goods / Productos prestados | Inventory |
| Layaway Payments / Pagos de apartado | Layaways + Cash |
| Layaway Cancellation / Cancelación de apartado | Layaways + Inventory + Customer balance cuando aplique |
| Purchase Receiving / Recepción de compra | Purchases + Inventory + Historical Cost |
| Supplier Returns / Retornos a proveedor | Suppliers + Inventory + Purchases |

---

## 6. Alcance MVP confirmado

El MVP debe permitir operar la tienda con:

- autenticación y permisos;
- catálogos base;
- productos y variantes;
- clientes;
- proveedores;
- inventario;
- caja;
- ventas;
- apartados;
- compras;
- retornos a proveedor;
- productos dañados y prestados;
- reportes operativos básicos;
- auditoría funcional limitada;
- manejo de errores estructurado;
- logs técnicos básicos;
- validaciones críticas en backend;
- frontend con rutas protegidas.

El MVP no requiere:

- contabilidad completa;
- asientos contables;
- catálogo de cuentas;
- conciliación bancaria;
- cierres contables;
- BI avanzado;
- e-commerce;
- aplicación móvil nativa;
- integraciones externas obligatorias;
- monitoreo avanzado de logs;
- interfaz de audit log;
- operaciones multi-tienda avanzadas;
- microservicios.

---

## 7. Decisiones que una IA no debe reinterpretar

Estas decisiones están cerradas y deben respetarse:

1. **Accounting / Contabilidad queda fuera del MVP.**
2. **Cash / Caja sí entra al MVP** porque es operativo, no contabilidad formal.
3. **Sales y Cash son módulos separados pero integrados.**
4. **Products es el catálogo maestro.**
5. **Purchases no crea productos ni variantes en el MVP.**
6. Si durante una compra el producto no existe, debe crearse primero en Products.
7. **Audit Log inicial solo aplica a Sales e Inventory.**
8. No habrá interfaz de Audit Log en el MVP.
9. El Audit Log funcional se guarda en PostgreSQL en tabla persistente.
10. Los logs técnicos se emiten por `stdout/stderr` del backend y son visibles con Docker logs.
11. No habrá dashboard ni centralización avanzada de logs en el MVP.
12. Backend es autoridad definitiva para validaciones críticas.
13. Frontend valida para mejorar UX, pero no reemplaza validaciones backend.
14. Errores API usan `status_code`, `code`, `message`, `details`.
15. Validaciones múltiples usan `details.errors`.
16. Advertencias no bloqueantes usan `warnings` en respuestas exitosas.
17. Errores inesperados usan `system.internal_error`.
18. Fallos transaccionales usan `business.transaction_failed`.
19. Errores críticos/transaccionales deben incluir `trace_id`.
20. Montos deben usar tipos `numeric`, no `float`.
21. Imágenes no se guardan como binario en DB; se guarda path/URL.
22. Seeds base se cargan mediante Alembic.

---

## 8. Contrato estándar de errores API

El backend debe responder errores usando el contrato definido en `08-api-contracts.md` y reforzado en `10-validation-rules.md` y `11-error-handling.md`.

Ejemplo:

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
      }
    ]
  }
}
```

Reglas:

- El HTTP status real debe coincidir con `status_code`.
- No usar `error_code`.
- No hacer `severity` obligatorio en el JSON público.
- `severity` queda como clasificación documental de reglas: `blocking`, `warning`, `informational`.
- En producción no se exponen SQL, stack traces, tokens ni datos sensibles.
- En desarrollo puede mostrarse detalle técnico controlado.

---

## 9. Warnings no bloqueantes

Las advertencias que no bloquean la operación no deben devolverse como errores HTTP.

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

---

## 10. Validaciones

Las validaciones deben dividirse por responsabilidad:

| Capa | Responsabilidad |
|---|---|
| Frontend | Mejorar UX, validar campos simples, mostrar errores por campo |
| Backend | Autoridad definitiva para reglas críticas |

Backend debe validar siempre:

- permisos;
- estados;
- dinero;
- inventario;
- stock disponible;
- transiciones;
- auditoría cuando aplique;
- operaciones críticas multi-módulo;
- reglas de seguridad;
- existencia y estado de registros relacionados.

Mensajes visibles al usuario deben estar en español, ser claros y accionables.

---

## 11. Frontend

Frontend usa React Router v6.

Reglas confirmadas:

- `/login` es ruta pública.
- `/dashboard` y rutas internas son protegidas.
- `/` redirige a `/dashboard` si está autenticado y a `/login` si no lo está.
- Usuario autenticado que visita `/login` redirige a `/dashboard`.
- Rutas internas usan `AppLayout`.
- Login usa `PublicLayout`.
- Rutas internas protegidas usan `RequireAuth`.
- Rutas administrativas usan prefijo `/admin`.
- Crear usa `/create`.
- Editar usa `/:id/edit`.
- Acciones complejas pueden tener ruta propia.
- Acciones simples pueden usar modales, botones o formularios internos.
- Rutas de prueba como `test` y `tictactoe` no pertenecen al diseño final.

---

## 12. Auth / RBAC

- Login usa `username` y `password`.
- Email no es credencial principal; es opcional/contacto.
- Usuarios inactivos no pueden iniciar sesión.
- Backend debe validar permisos aunque el frontend oculte acciones.
- Mensaje para sección no autorizada: `No tiene acceso a esta sección.`
- Mensaje para acción no autorizada: `No tiene permiso para realizar esta acción.`
- Roles y permisos son dinámicos en base de datos.
- Datos base de roles/permisos se cargan con Alembic.

---

## 13. Products / Purchases

Reglas críticas:

- Products administra el catálogo maestro.
- Products gestiona productos y variantes.
- Product code debe ser único.
- Purchases registra compras sobre productos existentes.
- Purchases no crea productos ni variantes en el MVP.
- Unit cost en compras debe ser mayor que cero.
- Al recibir compra, se aumenta inventario y se registra costo histórico.

---

## 14. Sales / Cash

Sales y Cash son módulos separados pero integrados.

- Sales registra la operación comercial.
- Cash registra y controla movimientos monetarios.
- Sales necesita caja abierta para confirmar ventas.
- Cash usa movimientos de Sales para cierre de caja.
- Cierre de caja pertenece a Cash.
- Caja operativa entra al MVP.
- Contabilidad no entra al MVP.

---

## 15. Audit Log funcional

Audit Log funcional:

- se guarda en PostgreSQL;
- usa tabla `audit_logs`;
- es persistente;
- no tiene interfaz en MVP;
- no tiene eliminación automática en MVP;
- está limitado inicialmente a Sales e Inventory;
- no debe mezclarse con logs técnicos.

Campos base:

- `id`
- `user_id`
- `action`
- `resource_type`
- `resource_id`
- `operation_result`
- `reason`
- `before_data`
- `after_data`
- `metadata`
- `ip_address`
- `user_agent`
- `created_at`

`operation_result` usa:

- `success`
- `failed`
- `blocked`

`before_data` y `after_data` guardan datos resumidos, no snapshots completos.

`reason` es el motivo funcional de la acción y es obligatorio para operaciones sensibles/correctivas.

---

## 16. Logs técnicos

Logs técnicos:

- se emiten por `stdout/stderr` del backend;
- son visibles con `docker logs` o `docker compose logs api`;
- no tienen interfaz en el sistema;
- no tienen dashboard de monitoreo en MVP;
- no incluyen contraseñas, tokens ni datos sensibles;
- registran errores internos, excepciones, fallos transaccionales y `trace_id` cuando aplique.

Centralización, retención formal, alertas, monitoreo y almacenamiento externo quedan para futuro.

---

## 17. Roadmap confirmado

| Fase | Enfoque |
|---|---|
| Phase 0 | Technical foundation |
| Phase 1 | Auth, Users, Roles, Permissions, Catalogs base |
| Phase 2 | Products, Customers, Suppliers |
| Phase 3 | Inventory base |
| Phase 4 | Cash base |
| Phase 5 | Sales base |
| Phase 6 | Layaways |
| Phase 7 | Purchases |
| Phase 8 | Operational exception flows |
| Phase 9 | Reports |
| Phase 10 | Stabilization, implementation checklist, AI documentation |

Accounting queda como fase futura/post-MVP.

---

## 18. Cómo usar este contexto con IA

Antes de pedir código a una IA:

1. Entregar este `AI_CONTEXT.md`.
2. Indicar el documento fuente específico que aplica.
3. Pedir que no invente alcance no confirmado.
4. Pedir que revise dependencias con otros documentos.
5. Pedir que devuelva inconsistencias si detecta contradicciones.
6. Para tareas de implementación, usar prompts de `AI_TASK_PROMPTS.md`.
7. Para reglas de trabajo, usar `AI_DEVELOPMENT_GUIDE.md`.

