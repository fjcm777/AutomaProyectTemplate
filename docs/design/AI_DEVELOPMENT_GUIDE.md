# AI Development Guide - Automata / Calzado Norita

**Documento derivado:** guía operativa para desarrollo asistido por IA  
**Base documental:** documentos `00` a `15`  
**Estado:** derivado de decisiones confirmadas  
**Uso:** definir cómo debe trabajar una IA o desarrollador al implementar, modificar o revisar el sistema.

---

## 1. Propósito

Esta guía define las reglas que una IA o desarrollador debe seguir al trabajar en el sistema Automata / Calzado Norita.

El objetivo es evitar que el desarrollo asistido por IA:

- invente módulos;
- cambie decisiones confirmadas;
- agregue funcionalidades fuera del MVP;
- contradiga contratos API;
- ignore validaciones backend;
- mezcle módulos con workflows;
- implemente contabilidad antes de tiempo;
- cree pantallas, endpoints o tablas no confirmadas;
- ignore transaccionalidad en operaciones críticas.

---

## 2. Regla principal

```text
La IA debe tratar la documentación del proyecto como fuente de verdad.
Si una instrucción del usuario contradice documentación confirmada, debe señalarlo antes de proponer cambios.
```

Cuando exista duda, la IA debe:

1. identificar el documento fuente afectado;
2. explicar la posible contradicción;
3. proponer una decisión explícita;
4. no implementar cambios irreversibles sin confirmación.

---

## 3. Orden de consulta recomendado

Antes de implementar una tarea, consultar:

1. `AI_CONTEXT.md`
2. `DECISION_LOG.md`
3. `14-mvp-scope.md`
4. `13-development-roadmap.md`
5. `15-implementation-checklist.md`
6. Documento funcional específico:
   - `01-business-rules.md`
   - `02-process-flows.md`
   - `03-use-cases.md`
   - `07-modules.md`
7. Documento técnico específico:
   - `04-architecture.md`
   - `05-database.md`
   - `06-auth-rbac.md`
   - `08-api-contracts.md`
   - `09-frontend-routes.md`
   - `10-validation-rules.md`
   - `11-error-handling.md`
   - `12-audit-log.md`
8. `CODE_ALIGNMENT.md`

Regla de precedencia:

```text
Si un caso de uso antiguo entra en conflicto con decisiones posteriores, prevalecen DECISION_LOG.md, 14-mvp-scope.md, 13-development-roadmap.md, 15-implementation-checklist.md y los documentos técnicos específicos.

03-use-cases.md no debe usarse para reintroducir funcionalidades excluidas del MVP, campos inexistentes, estados no confirmados o flujos revertidos.
```

---

## 4. Reglas de alcance MVP

La IA debe respetar que el MVP incluye:

- Auth / Users;
- Roles / Permissions;
- Admin / Catalogs;
- Admin / Settings;
- Products;
- Customers;
- Suppliers;
- Inventory;
- Cash;
- Sales;
- Layaways;
- Purchases;
- Reports básicos;
- Audit Log limitado;
- Error Handling;
- Technical Logs básicos.

La IA no debe implementar en MVP:

- Accounting / Contabilidad;
- BI avanzado;
- e-commerce;
- app móvil nativa;
- integraciones externas obligatorias;
- dashboard de logs;
- interfaz de audit log;
- microservicios;
- creación de productos desde compras;
- operaciones multi-tienda avanzadas.

---

## 5. Reglas sobre módulos y workflows

La IA debe diferenciar:

| Tipo | Ejemplo |
|---|---|
| Módulo real | Sales, Cash, Inventory, Purchases |
| Workflow | Sale void, Cash closing, Purchase receiving, Supplier return |

Regla:

```text
No convertir workflows en módulos independientes si la documentación los define como flujos internos o transversales.
```

Ejemplos:

- Sale void pertenece a Sales.
- Sale return pertenece a Sales.
- Cash closing pertenece a Cash.
- Purchase receiving pertenece a Purchases + Inventory.
- Supplier return pertenece a Suppliers + Inventory + Purchases.
- Damaged goods pertenece a Inventory.
- Loaned goods pertenece a Inventory.

---

## 6. Reglas técnicas obligatorias

Toda implementación debe respetar:

| Área | Regla |
|---|---|
| Arquitectura | Monolito modular |
| Backend | FastAPI |
| Frontend | React + TypeScript |
| DB | PostgreSQL 16 |
| ORM | SQLAlchemy 2.x async |
| Migraciones | Alembic async |
| Seeds | Alembic, no scripts sueltos sin control |
| Montos | `numeric`, no `float` |
| Imágenes | Path/URL, no binario en DB |
| Logs técnicos | stdout/stderr del backend |
| Errores críticos | Incluir `trace_id` cuando aplique |
| Contabilidad | Fuera del MVP |

---

## 7. Reglas de backend

El backend es la autoridad definitiva para:

- permisos;
- validaciones críticas;
- existencia de registros relacionados;
- estados y transiciones;
- dinero;
- inventario;
- stock disponible;
- caja abierta/cerrada;
- operaciones transaccionales;
- auditoría funcional cuando aplique;
- errores estructurados.

El frontend puede validar y ocultar acciones, pero nunca reemplaza validaciones backend.

---

## 8. Reglas de API

Toda API debe respetar el contrato estándar.

Error simple:

```json
{
  "status_code": 409,
  "code": "business.invalid_state",
  "message": "La operación no es válida para el estado actual.",
  "details": {
    "resource": "sale",
    "operation": "void_sale"
  }
}
```

Validación múltiple:

```json
{
  "status_code": 422,
  "code": "validation.invalid_input",
  "message": "Hay campos inválidos. Revise la información ingresada.",
  "details": {
    "errors": [
      {
        "field": "quantity",
        "code": "validation.greater_than_zero",
        "message": "La cantidad debe ser mayor que cero."
      }
    ]
  }
}
```

Advertencia no bloqueante:

```json
{
  "status_code": 200,
  "message": "Pago registrado correctamente.",
  "data": {},
  "warnings": [
    {
      "code": "layaway.expired_payment_allowed",
      "message": "El apartado está vencido, pero puede registrar el pago si desea continuar."
    }
  ]
}
```

Reglas:

- No usar `error_code`.
- No hacer `severity` obligatorio en JSON público.
- HTTP status debe coincidir con `status_code`.
- Producción no debe exponer SQL, stack traces, tokens ni datos sensibles.

---

## 9. Reglas de frontend

Frontend debe respetar `09-frontend-routes.md`.

Reglas base:

- React Router v6.
- `/login` pública.
- `/dashboard` protegida.
- `/` redirige según autenticación.
- Rutas internas usan `AppLayout`.
- Login usa `PublicLayout`.
- Rutas internas usan `RequireAuth`.
- `/admin` agrupa rutas administrativas.
- Crear usa `/create`.
- Editar usa `/:id/edit`.
- Acciones complejas pueden tener rutas propias.
- Acciones simples pueden resolverse con botones, modales o formularios internos.
- Frontend debe mostrar `details.errors` por campo cuando estén disponibles.
- Frontend debe mostrar `warnings` sin tratarlos como errores bloqueantes.

---

## 10. Reglas de Auth / RBAC

- Login usa `username` y `password`.
- Email no es credencial principal.
- Usuario inactivo no puede iniciar sesión.
- Backend valida permisos antes de ejecutar acciones protegidas.
- Frontend puede ocultar acciones no permitidas.
- Roles y permisos viven en base de datos.
- Seeds de roles/permisos mediante Alembic.

Mensajes confirmados:

- `Usuario o contraseña incorrectos.`
- `No tiene acceso a esta sección.`
- `No tiene permiso para realizar esta acción.`

---

## 11. Reglas de Products y Purchases

La IA debe respetar:

```text
Products es el catálogo maestro.
Purchases no crea productos ni variantes en el MVP.
```

Implementar Purchases bajo estas reglas:

- toda compra requiere proveedor válido;
- toda línea de compra debe referenciar producto/variante existente;
- `unit_cost` debe ser mayor que cero;
- recibir compra aumenta inventario;
- recibir compra registra costo histórico;
- compra recibida no puede cancelarse directamente;
- retornos a proveedor son flujo operativo separado.

---

## 12. Reglas de Sales y Cash

Sales y Cash son módulos separados pero integrados.

Sales:

- crea ventas;
- confirma ventas;
- anula ventas;
- registra devoluciones;
- emite comprobante;
- impacta inventario y caja.

Cash:

- abre caja;
- registra movimientos manuales;
- recibe movimientos por ventas/devoluciones/anulaciones;
- cierra caja;
- calcula diferencias;
- exige motivo si hay diferencia.

Regla:

```text
Sales necesita Cash para confirmar operaciones monetarias.
Cash usa movimientos generados por Sales para cierre, pero cierre de caja pertenece a Cash.
```

---

## 13. Reglas de Audit Log

Audit Log funcional:

- tabla persistente `audit_logs` en PostgreSQL;
- alcance inicial: Sales e Inventory;
- sin interfaz de usuario en MVP;
- sin eliminación automática en MVP;
- separado de logs técnicos.

Auditar cuando aplique:

- venta anulada;
- devolución de venta;
- intento bloqueado relevante de anulación/devolución;
- ajuste de inventario;
- movimiento manual;
- baja por daño;
- préstamo;
- retorno de préstamo;
- conversión de préstamo a venta;
- intentos bloqueados relevantes de inventario.

---

## 14. Reglas de logs técnicos

- Emitir por `stdout/stderr` del backend.
- Consultar con `docker logs` o `docker compose logs api`.
- No crear UI de logs.
- No implementar dashboard de monitoreo en MVP.
- No registrar contraseñas, tokens o datos sensibles.
- Registrar errores 500, excepciones no controladas, fallos transaccionales y `trace_id`.

---

## 15. Reglas de desarrollo por fases

La IA debe respetar el roadmap:

1. Technical foundation.
2. Auth, Users, Roles, Permissions, Catalogs base.
3. Products, Customers, Suppliers.
4. Inventory base.
5. Cash base.
6. Sales base.
7. Layaways.
8. Purchases.
9. Operational exception flows.
10. Reports.
11. Stabilization, checklist and AI documentation.

No desarrollar módulos fuera de orden si sus dependencias no existen.

---

## 16. Checklist antes de entregar código

Antes de entregar una implementación, verificar:

- ¿Respeta el MVP scope?
- ¿Respeta el roadmap?
- ¿Respeta módulos reales vs workflows?
- ¿Respeta contratos API?
- ¿Valida backend reglas críticas?
- ¿Usa errores estructurados?
- ¿Usa transacciones en flujos críticos?
- ¿Actualiza inventario/caja/auditoría cuando aplica?
- ¿No implementa contabilidad?
- ¿No crea productos desde compras?
- ¿No agrega UI de audit log/logs?
- ¿No expone datos sensibles?
- ¿Incluye migración Alembic si cambia DB?
- ¿Incluye seeds Alembic si agrega datos base?
- ¿Actualiza documentación si cambia una decisión?
- ¿Corrí `lint-imports` (ver `16-enforcement.md`) tras tocar `service.py`/`repository.py` de algún módulo, y pasó sin violaciones?

---

## 17. Cómo responder si falta información

Si una tarea no está soportada por documentación:

- no inventar;
- decir qué documento no lo define;
- proponer pregunta de decisión;
- indicar documentos que serían afectados;
- no generar código definitivo hasta confirmar.

Si la tarea sí está soportada:

- ejecutar con base en los documentos;
- citar reglas relevantes en la explicación;
- mencionar dependencias y pruebas recomendadas.

---

## 18. Resultado esperado de una IA

Una IA debe entregar:

- solución alineada con documentación;
- código o propuesta modular;
- migraciones cuando aplique;
- validaciones backend;
- manejo de errores estándar;
- pruebas o checklist de validación;
- advertencias de impacto documental si aplica.

La IA no debe entregar soluciones que aumenten alcance sin confirmación.

