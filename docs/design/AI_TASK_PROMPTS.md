# AI Task Prompts - Automata / Calzado Norita

**Documento derivado:** biblioteca de prompts para desarrollo asistido por IA  
**Base documental:** documentos `00` a `15`, `AI_CONTEXT.md` y `AI_DEVELOPMENT_GUIDE.md`  
**Estado:** derivado de decisiones confirmadas  
**Uso:** copiar y adaptar estos prompts al pedir tareas de análisis, implementación, revisión o QA.

---

## 1. Reglas para usar estos prompts

Antes de usar cualquier prompt:

1. Adjuntar o proporcionar `AI_CONTEXT.md`.
2. Indicar el documento fuente principal de la tarea.
3. Indicar el módulo o workflow específico.
4. Pedir explícitamente que no se implementen funcionalidades fuera del MVP.
5. Pedir que se reporten inconsistencias antes de generar código.

Cláusula recomendada para casi todos los prompts:

```text
Respeta la documentación confirmada del proyecto Automata / Calzado Norita.
No agregues contabilidad, integraciones externas, audit log UI, logs UI, BI avanzado,
creación de productos desde compras ni funcionalidades fuera del MVP.
Si detectas una contradicción o falta de definición, detente y explícala antes de continuar.
```

---

## 2. Prompt base para implementar un módulo backend

```text
Actúa como desarrollador backend senior para el proyecto Automata / Calzado Norita.

Usa como fuente de verdad:
- AI_CONTEXT.md
- AI_DEVELOPMENT_GUIDE.md
- 04-architecture.md
- 05-database.md
- 07-modules.md
- 08-api-contracts.md
- 10-validation-rules.md
- 11-error-handling.md
- 15-implementation-checklist.md

Tarea:
Implementa el backend del módulo [MODULE_NAME].

Debes respetar:
- FastAPI
- SQLAlchemy 2.x async
- PostgreSQL 16
- Alembic async
- arquitectura de monolito modular
- contrato de errores con status_code, code, message, details
- validaciones backend como autoridad definitiva
- transacciones para operaciones críticas
- RBAC backend cuando aplique

No implementes funcionalidades fuera del MVP.
No implementes contabilidad.
No crees productos desde Purchases.
No agregues interfaces o endpoints no documentados salvo que expliques primero por qué serían necesarios.

Entrega:
1. Estructura de archivos propuesta.
2. Modelos o cambios DB necesarios.
3. Migración Alembic si aplica.
4. Schemas/Pydantic.
5. Servicios/casos de uso.
6. Rutas FastAPI.
7. Validaciones críticas.
8. Manejo de errores.
9. Pruebas recomendadas.
10. Riesgos o dependencias documentales.
```

---

## 3. Prompt base para implementar una ruta/API específica

```text
Actúa como desarrollador backend para Automata / Calzado Norita.

Necesito implementar este endpoint:
[METHOD] [PATH]

Documento fuente principal:
[DOCUMENT_NAME]

Contexto funcional:
[DESCRIBE_USE_CASE]

Respeta:
- contrato API de 08-api-contracts.md
- validaciones de 10-validation-rules.md
- manejo de errores de 11-error-handling.md
- RBAC de 06-auth-rbac.md
- checklist de 15-implementation-checklist.md

El endpoint debe:
- validar permisos en backend;
- validar reglas críticas en backend;
- usar transacción si afecta más de un módulo;
- devolver errores con status_code, code, message, details;
- incluir trace_id en errores críticos/transaccionales cuando aplique;
- no exponer detalles técnicos sensibles en producción.

Entrega:
1. Diseño del endpoint.
2. Request schema.
3. Response schema.
4. Errores esperados.
5. Servicio/caso de uso.
6. Código FastAPI sugerido.
7. Pruebas mínimas.
```

---

## 4. Prompt para implementar migración Alembic

```text
Actúa como desarrollador backend especializado en PostgreSQL, SQLAlchemy 2.x async y Alembic.

Necesito crear una migración para:
[DESCRIBE_CHANGE]

Usa como fuente:
- 05-database.md
- 04-architecture.md
- 15-implementation-checklist.md

Reglas obligatorias:
- PostgreSQL 16.
- Montos deben usar numeric, no float.
- Seeds base deben manejarse mediante Alembic si aplica.
- No guardar imágenes como binario en DB.
- Respetar nombres técnicos en inglés.
- No agregar tablas o columnas fuera del alcance documentado.

Entrega:
1. Explicación del cambio.
2. Script Alembic upgrade.
3. Script Alembic downgrade.
4. Índices/constraints recomendados.
5. Riesgos de datos.
6. Cómo validar la migración.
```

---

## 5. Prompt para revisar una migración

```text
Revisa esta migración Alembic contra la documentación del proyecto Automata / Calzado Norita.

Documentos fuente:
- 05-database.md
- 10-validation-rules.md
- 12-audit-log.md si aplica
- 14-mvp-scope.md
- 15-implementation-checklist.md

Migración:
[PASTE_MIGRATION]

Verifica:
- nombres de tablas y columnas en inglés;
- tipos correctos, especialmente numeric para dinero;
- constraints necesarias;
- índices necesarios;
- downgrade seguro;
- que no agregue funcionalidad fuera del MVP;
- que no implemente contabilidad;
- que no mezcle logs técnicos con audit log;
- que no guarde imágenes como binario.

Devuelve:
1. Errores encontrados.
2. Riesgos.
3. Cambios recomendados.
4. Versión corregida si aplica.
```

---

## 6. Prompt para implementar frontend de una ruta

```text
Actúa como desarrollador frontend React + TypeScript para Automata / Calzado Norita.

Necesito implementar la ruta:
[ROUTE]

Documentos fuente:
- 09-frontend-routes.md
- 08-api-contracts.md
- 10-validation-rules.md
- 11-error-handling.md
- 15-implementation-checklist.md

Respeta:
- React Router v6.
- /login usa PublicLayout.
- Rutas internas usan AppLayout y RequireAuth.
- Crear usa /create.
- Editar usa /:id/edit.
- Backend es autoridad definitiva para permisos.
- Frontend puede ocultar acciones no permitidas, pero no confiar solo en eso.
- Mostrar errores por campo desde details.errors.
- Mostrar warnings sin tratarlos como errores bloqueantes.

Entrega:
1. Estructura de componentes.
2. Ruta React Router.
3. Formulario o vista.
4. Integración con API client compartido.
5. Manejo de errores y warnings.
6. Validaciones frontend.
7. Estados de carga/vacío/error.
```

---

## 7. Prompt para revisar una implementación frontend

```text
Revisa esta implementación frontend contra la documentación de Automata / Calzado Norita.

Documentos fuente:
- 09-frontend-routes.md
- 08-api-contracts.md
- 10-validation-rules.md
- 06-auth-rbac.md
- 15-implementation-checklist.md

Código:
[PASTE_CODE]

Verifica:
- ruta correcta;
- layout correcto;
- protección con RequireAuth si aplica;
- uso del API client compartido;
- manejo de details.errors;
- manejo de warnings;
- mensajes en español;
- que no dependa solo del frontend para permisos;
- que no agregue rutas no documentadas;
- que acciones simples/complejas sigan el criterio definido.

Devuelve:
1. Cumplimientos.
2. Problemas.
3. Riesgos.
4. Cambios recomendados.
```

---

## 8. Prompt para validar un workflow crítico

```text
Actúa como arquitecto de software y QA funcional para Automata / Calzado Norita.

Necesito validar el workflow:
[WORKFLOW_NAME]

Documentos fuente:
- 02-process-flows.md
- 07-modules.md
- 08-api-contracts.md
- 10-validation-rules.md
- 11-error-handling.md
- 12-audit-log.md si aplica
- 15-implementation-checklist.md

Verifica que el workflow incluya:
- validaciones backend;
- permisos;
- cambios de estado;
- impacto en inventario;
- impacto en caja si aplica;
- audit log si pertenece a Sales o Inventory y aplica;
- errores estructurados;
- transaccionalidad;
- reversión total si falla una parte;
- que no incluya contabilidad en MVP.

Entrega:
1. Flujo esperado paso a paso.
2. Validaciones necesarias.
3. Tablas afectadas.
4. Endpoints esperados.
5. Errores esperados.
6. Casos de prueba mínimos.
7. Riesgos de inconsistencia.
```

---

## 9. Prompt para implementar Sale Confirmation

```text
Implementa o diseña el workflow de confirmar venta para Automata / Calzado Norita.

Debe respetar:
- Sales y Cash son módulos separados pero integrados.
- Debe existir caja abierta.
- Debe validar productos activos y stock disponible.
- Debe registrar pago válido.
- Debe descontar inventario.
- Debe generar movimiento de caja.
- Debe emitir o preparar comprobante.
- Debe ejecutarse en transacción.
- Si falla inventario, caja o pago, toda la venta se revierte.
- No implementar contabilidad.

Usa documentos:
08-api-contracts.md, 10-validation-rules.md, 11-error-handling.md,
12-audit-log.md, 15-implementation-checklist.md.

Entrega diseño, pseudocódigo/código, errores esperados y pruebas.
```

---

## 10. Prompt para implementar Sale Void

```text
Implementa o diseña el workflow de anulación de venta para Automata / Calzado Norita.

Debe respetar:
- Solo ventas válidas pueden anularse.
- La anulación debe respetar el día operativo permitido.
- Requiere permiso específico.
- Requiere reason/motivo funcional.
- Debe revertir inventario cuando aplique.
- Debe impactar caja cuando aplique.
- Debe registrar audit log porque Sales está dentro del alcance inicial de auditoría.
- Debe ser transaccional.
- Si falla una parte, no se aplican cambios.
- No implementar contabilidad.

Entrega endpoint, servicio, validaciones, errores, audit log esperado y pruebas.
```

---

## 11. Prompt para implementar Cash Closing

```text
Diseña o implementa el workflow de cierre de caja para Automata / Calzado Norita.

Debe respetar:
- Cash es módulo separado de Sales.
- Cierre de caja pertenece a Cash.
- Cash usa movimientos generados por Sales, devoluciones, anulaciones y movimientos manuales.
- Debe calcular monto esperado.
- Debe validar monto contado.
- Debe calcular diferencia.
- Si hay diferencia, reason es obligatorio.
- No permitir movimientos posteriores en caja cerrada.
- No implementar contabilidad.

Entrega diseño, tablas afectadas, validaciones, errores y pruebas.
```

---

## 12. Prompt para implementar Purchase Receiving

```text
Diseña o implementa el workflow de recepción de compra para Automata / Calzado Norita.

Debe respetar:
- Purchases no crea productos ni variantes en MVP.
- Toda línea debe referenciar producto/variante existente.
- Unit cost debe ser mayor que cero.
- Cantidad recibida debe ser válida.
- La recepción aumenta inventario.
- La recepción registra costo histórico.
- Compra recibida no puede cancelarse directamente.
- Operación debe ser transaccional.
- No implementar contabilidad.

Entrega endpoint, validaciones, transacción, errores y pruebas.
```

---

## 13. Prompt para implementar Audit Log en Sales/Inventory

```text
Implementa o diseña el registro de audit log funcional para el workflow:
[WORKFLOW_NAME]

Documentos fuente:
- 12-audit-log.md
- 15-implementation-checklist.md
- 10-validation-rules.md

Reglas:
- Audit Log inicial solo aplica a Sales e Inventory.
- Guardar en tabla audit_logs de PostgreSQL.
- No crear interfaz de usuario.
- No crear eliminación automática.
- operation_result usa success, failed, blocked.
- reason es motivo funcional de la acción.
- before_data y after_data son resumidos, no snapshots completos.
- metadata guarda contexto adicional.
- No mezclar con logs técnicos.

Entrega:
1. Evento auditado.
2. Cuándo se registra.
3. Payload before_data/after_data/metadata.
4. Casos success/failed/blocked.
5. Pruebas.
```

---

## 14. Prompt para implementar manejo de errores

```text
Implementa o revisa el manejo de errores para Automata / Calzado Norita.

Documentos fuente:
- 08-api-contracts.md
- 10-validation-rules.md
- 11-error-handling.md
- 15-implementation-checklist.md

Reglas:
- Error JSON con status_code, code, message, details.
- HTTP status debe coincidir con status_code.
- Validaciones múltiples en details.errors.
- Warnings no bloqueantes en respuestas exitosas con warnings.
- system.internal_error para errores inesperados.
- business.transaction_failed para fallos transaccionales.
- trace_id en errores críticos/transaccionales.
- No exponer SQL, stack traces, tokens o datos sensibles en producción.
- No usar error_code.

Entrega código/propuesta, ejemplos de respuesta y pruebas.
```

---

## 15. Prompt para revisar inconsistencias documentales

```text
Actúa como revisor de documentación técnica para Automata / Calzado Norita.

Revisa estos documentos:
[LIST_DOCUMENTS]

Busca inconsistencias sobre:
- módulos reales vs workflows;
- MVP scope;
- roadmap;
- contabilidad fuera del MVP;
- Sales y Cash separados pero integrados;
- Products como catálogo maestro;
- Purchases no crea productos;
- Audit Log limitado a Sales e Inventory;
- logs técnicos por stdout/stderr;
- errores API estándar;
- validaciones backend;
- rutas frontend;
- transaccionalidad.

Devuelve:
1. Inconsistencias encontradas.
2. Documento afectado.
3. Texto actual problemático.
4. Texto corregido propuesto.
5. Si requiere decisión nueva o solo alineación.
```

---

## 16. Prompt para generar tests backend

```text
Genera pruebas backend para [MODULE_OR_WORKFLOW] en Automata / Calzado Norita.

Usa como fuente:
- 10-validation-rules.md
- 11-error-handling.md
- 15-implementation-checklist.md
- documento funcional del módulo correspondiente.

Las pruebas deben cubrir:
- casos exitosos;
- validaciones blocking;
- permisos;
- estados inválidos;
- errores estructurados;
- transacción/reversión si aplica;
- audit log si aplica;
- no implementación de alcance fuera del MVP.

Entrega:
1. Lista de casos.
2. Datos de prueba.
3. Ejemplos de tests.
4. Errores esperados.
```

---

## 17. Prompt para generar tests frontend

```text
Genera pruebas frontend para [ROUTE_OR_COMPONENT] en Automata / Calzado Norita.

Usa como fuente:
- 09-frontend-routes.md
- 10-validation-rules.md
- 11-error-handling.md
- 15-implementation-checklist.md

Las pruebas deben cubrir:
- render de ruta correcta;
- protección de ruta si aplica;
- validaciones frontend;
- envío exitoso;
- errores por campo desde details.errors;
- warnings no bloqueantes;
- estados loading/error/empty;
- acciones ocultas o deshabilitadas por permiso cuando aplique.

Entrega lista de pruebas y ejemplos de implementación.
```

---

## 18. Prompt para revisar si una funcionalidad entra en MVP

```text
Evalúa si esta funcionalidad entra en el MVP de Automata / Calzado Norita:
[FEATURE_DESCRIPTION]

Usa como fuente principal:
- 14-mvp-scope.md
- 13-development-roadmap.md
- 15-implementation-checklist.md
- AI_CONTEXT.md

Indica:
1. Si entra en MVP, future scope o está fuera del proyecto.
2. Qué módulo real la contiene.
3. Si es módulo o workflow.
4. Dependencias.
5. Documentos afectados si se acepta.
6. Riesgos de scope creep.

No asumas que debe implementarse si no está confirmado.
```

---

## 19. Prompt para preparar una tarea pequeña de desarrollo

```text
Convierte esta solicitud en una tarea pequeña, implementable y alineada con documentación:
[USER_REQUEST]

Usa:
- AI_CONTEXT.md
- AI_DEVELOPMENT_GUIDE.md
- 15-implementation-checklist.md

Entrega:
1. Título de tarea.
2. Alcance exacto.
3. Fuera de alcance.
4. Documentos fuente.
5. Archivos probables a modificar.
6. Validaciones requeridas.
7. Criterios de aceptación.
8. Pruebas mínimas.
9. Riesgos o dudas.
```

---

## 20. Prompt para actualización documental después de un cambio

```text
Evalúa este cambio y determina qué documentos de Automata / Calzado Norita deben actualizarse:
[CHANGE_DESCRIPTION]

Revisa impacto sobre:
- business rules;
- process flows;
- use cases;
- architecture;
- database;
- auth/RBAC;
- modules;
- API contracts;
- frontend routes;
- validation rules;
- error handling;
- audit log;
- roadmap;
- MVP scope;
- implementation checklist;
- CODE_ALIGNMENT;
- DECISION_LOG;
- README;
- AI_CONTEXT;
- AI_DEVELOPMENT_GUIDE;
- AI_TASK_PROMPTS.

Devuelve:
1. Documentos afectados.
2. Tipo de cambio requerido.
3. Si requiere decisión funcional.
4. Texto propuesto por documento.
```

