# CODE_ALIGNMENT - Revisión del proyecto actual

## Propósito

Este documento resume lo observado en `AutomaProyectTemplate.zip` y explica cómo debe interpretarse frente a la documentación funcional/técnica recuperada.

## Estado actual del código revisado

### Backend

El proyecto contiene un backend FastAPI con estructura modular inicial:

```text
backend/app/
  main.py
  core/
  db/
  shared/
  modules/
    health/
    categories/
    products/
```

Módulos implementados actualmente:

- `health`
- `categories`
- `products`

Patrón ya presente en módulos:

```text
api.py
models.py
schemas.py
service.py
repository.py
```

Esto coincide con la arquitectura objetivo del sistema, aunque el ERP completo aún no está implementado.

### Frontend

El proyecto contiene frontend React + TypeScript + Vite.

Estructura observada:

```text
frontend/src/
  app/router/router.tsx
  features/login/
  features/products/
  features/test/
  features/tictactoe/
  shared/api/
  shared/contexts/
```

El frontend actual sirve como base para continuar con `09-frontend-routes.md` después de aprobar esta documentación corregida.

## Interpretación correcta

El código actual es un **template/base inicial**. La documentación recuperada define el **diseño objetivo confirmado** para Automata / Calzado Norita.

Por tanto:

```text
El código actual no limita el diseño final.
La documentación debe guiar la evolución del código.
Los módulos faltantes se implementarán progresivamente siguiendo la documentación.
```

## Módulos pendientes respecto al diseño objetivo

El diseño documentado incluye:

- `auth`
- `users`
- `products`
- `inventory`
- `customers`
- `sales`
- `layaways`
- `cash`
- `suppliers`
- `purchases`
- `reports`
- `settings`

En el código actual ya existen bases para:

- `products`
- `categories`, actualmente como módulo separado; en la documentación objetivo, catálogos de producto pueden integrarse bajo `products` o mantenerse con una decisión técnica explícita.
- `health`

## Regla de trabajo para continuar

Antes de avanzar a `09-frontend-routes.md`, el usuario debe revisar y aprobar este ZIP corregido.

Una vez aprobado, el documento `09-frontend-routes.md` debe tomar en cuenta:

- La arquitectura objetivo.
- La estructura real actual del frontend.
- Los permisos definidos en `06-auth-rbac.md`.
- Los contratos definidos en `08-api-contracts.md`.

---

# Complemento v5

La documentacion v5 incluye decisiones objetivo que pueden no existir aun en el codigo actual:

| Elemento | Estado esperado |
|---|---|
| `inventory_loans` | Pendiente de implementar |
| `customer_credit_applications` | Pendiente de implementar |
| `quantity_available` generado por PostgreSQL | Pendiente de migracion |
| Reembolso de saldo a favor | Pendiente de implementar |
| Utilidad estimada en reportes | Pendiente de implementar |
| Restriccion de estados finales | Pendiente de implementar en services |
| Transferencias internas | Fuera del MVP inicial |

---

# Complemento 09 - Frontend routes

`09-frontend-routes.md` define el diseno objetivo de rutas navegables del frontend.

## Diferencias relevantes con el template actual

| Elemento actual | Diseno objetivo |
|---|---|
| `/` muestra productos o pantalla inicial del template | `/` debe redirigir a `/dashboard` si hay sesion o a `/login` si no hay sesion |
| `/products/new` | Debe evolucionar a `/products/create` |
| `features/login` | Debe evolucionar a `features/auth` |
| `App` actual con `Outlet` | Puede evolucionar a `AppLayout` para rutas protegidas |
| `/login` dentro del layout actual | Debe usar `PublicLayout` separado |
| `/test` | Ruta de prueba; no pertenece al diseno final |
| `/tictactoe` | Ruta de prueba; no pertenece al diseno final |

## Estructura frontend objetivo

```text
frontend/src/
  app/
    router/
      router.tsx
    layouts/
      AppLayout.tsx
      PublicLayout.tsx
    guards/
      RequireAuth.tsx
      GuestOnly.tsx
  features/
    auth/
    dashboard/
    products/
    customers/
    suppliers/
    inventory/
    sales/
    layaways/
    cash/
    purchases/
    reports/
    admin/
  shared/
```

## Regla de alineacion

El template actual es una base tecnica ajustable. Las rutas y features de prueba no deben guiar el diseno final del ERP.

La implementacion frontend debe tomar como referencia `09-frontend-routes.md` y mantener consistencia con:

- `06-auth-rbac.md` para permisos;
- `08-api-contracts.md` para consumo de API;
- `01-business-rules.md` y `02-process-flows.md` para flujos criticos.


---

# Complemento v7 - Validaciones, errores y transacciones

`10-validation-rules.md` define el patrón objetivo para validaciones del sistema.

## Implicaciones para el código actual

| Área | Ajuste esperado |
|---|---|
| Schemas | Validar estructura, tipos básicos, campos requeridos y formatos simples. |
| Services | Validar reglas de negocio, permisos funcionales, estados, stock, caja, saldos y transacciones. |
| Repositories | Persistencia y consultas; no deben contener reglas de negocio principales. |
| API handlers | Orquestar request/response, dependencias, permisos y conversión a respuestas estándar. |
| Frontend | Validar para UX, mostrar mensajes en español y respetar respuestas del backend. |

## Errores backend

El código debe respetar `08-api-contracts.md`:

```json
{
  "status_code": 422,
  "code": "validation.invalid_input",
  "message": "Hay campos inválidos. Revise la información ingresada.",
  "details": {
    "errors": []
  }
}
```

No debe implementarse una estructura paralela con `error_code`.

## Warnings

Las advertencias no bloqueantes deben regresar en respuestas exitosas mediante `warnings`.

Ejemplo:

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

## Transacciones

Los services que afecten múltiples módulos deben ejecutar la operación como una transacción atómica.
Esto aplica a ventas, apartados, devoluciones, anulaciones, compras recibidas, retornos a proveedor,
bajas de inventario, conversiones de préstamos a venta y cierre de caja.


---

# Complemento v8 - Error handling

`11-error-handling.md` define el patrón objetivo para manejo de errores del sistema.

## Implicaciones para el código actual

| Área | Ajuste esperado |
|---|---|
| Excepciones estándar | Crear o consolidar helpers en `core/errors.py` o `shared/errors.py` para responder con `status_code`, `code`, `message` y `details`. |
| API handlers | Convertir excepciones controladas en respuestas API estándar sin duplicar lógica por endpoint. |
| Services | Lanzar errores funcionales para reglas de negocio, estados, permisos, inventario, caja y transacciones. |
| Repositories | No deben convertir errores técnicos en mensajes de usuario; deben propagar fallos a capas superiores. |
| Frontend | Consumir `message`, `details.errors` y `warnings` sin inventar mensajes técnicos. |
| Logging | Registrar errores relevantes internamente y usar `trace_id` en errores internos, críticos y transaccionales. |

## Códigos confirmados

```text
system.internal_error
business.transaction_failed
```

## Reglas importantes

- No implementar una estructura paralela con `error_code`.
- No hacer `severity` obligatorio en el JSON público.
- No exponer stack traces, SQL, constraints, tokens, secretos ni rutas internas en producción.
- En `development` puede existir detalle técnico controlado dentro de `details.debug`.
- Los logs técnicos del MVP deben emitirse por stdout/stderr del backend y ser visibles mediante Docker logs / Docker Compose logs; la centralización, monitoreo, alertas y retención formal quedan para etapa posterior.
- Error handling técnico no reemplaza auditoría funcional.

## Alineación agregada por 12-audit-log.md

La auditoría funcional debe implementarse como capacidad compartida de backend, preferiblemente en `shared/audit.py`, pero su alcance inicial queda limitado a operaciones sensibles de Sales e Inventory.

Reglas de implementación:

```text
- No crear interfaz frontend de audit log en primera etapa.
- No auditar consultas normales.
- No auditar todavía todos los módulos.
- Registrar audit_logs desde service.py/backend, no desde frontend.
- El frontend solo envía reason cuando la operación lo requiera.
- El backend completa user_id, action, resource_type, resource_id, operation_result, before_data, after_data, metadata, ip_address, user_agent y created_at.
- before_data y after_data deben ser resumidos y relevantes, no snapshots completos innecesarios.
- No implementar eliminación automática de audit_logs en primera etapa.
```

Campos confirmados para la tabla:

```text
user_id
action
resource_type
resource_id
operation_result
reason
before_data
after_data
metadata
ip_address
user_agent
created_at
```


---

# Complemento v10 - Roadmap de desarrollo

El orden de implementacion objetivo queda definido en `13-development-roadmap.md`.

```text
Phase 0  - Technical foundation
Phase 1  - Auth, Users, Roles, Permissions, Catalogs base
Phase 2  - Products, Customers, Suppliers
Phase 3  - Inventory base
Phase 4  - Cash base
Phase 5  - Sales base
Phase 6  - Layaways
Phase 7  - Purchases
Phase 8  - Operational exception flows
Phase 9  - Reports
Phase 10 - Stabilization, implementation checklist, AI documentation
```

Reglas de alineacion para desarrollo:

```text
- No implementar ventas completas antes de caja base.
- No implementar compras antes de productos, proveedores e inventario base.
- Purchases no debe crear productos ni variantes en el MVP.
- Accounting / Contabilidad no forma parte del MVP; queda para etapa futura.
- Los documentos AI se generan al final de la documentacion principal.
```


---

## v11 - MVP Scope alignment

`14-mvp-scope.md` defines what is included in the first operational version and what must remain future scope.

Implementation rules:

- Do not implement modules or workflows outside MVP unless explicitly re-scoped.
- Treat real modules and workflows separately. Workflows such as sale voids, sale returns, cash closing, damaged goods, loaned goods, purchase receiving and supplier returns belong inside their related modules.
- Keep Sales and Cash as separate modules. Sales records the commercial operation; Cash records and controls money movements and closing.
- Cash is part of the MVP. Accounting is not part of the MVP.
- Purchases must not create products or variants in the MVP. It must reference existing Products/Variants.
- Audit Log is limited to sensitive Sales and Inventory actions and has no UI in the MVP.
- Technical logs must be emitted by the backend through stdout/stderr and be visible with Docker logs / Docker Compose logs. Do not implement a logs UI, monitoring dashboard, alerting or centralized observability in the MVP.
- Advanced analytics, e-commerce, native mobile app, external integrations, advanced multi-store workflows and advanced inventory planning are future scope.

Required Docker log visibility for MVP:

```bash
docker compose logs api
docker compose logs -f api
```
