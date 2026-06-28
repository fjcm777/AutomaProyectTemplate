# Automata Design Docs

Documentación base del sistema Automata para Calzado Norita.

## Documentos incluidos

- `00-business-context.md`
- `01-business-rules.md`
- `02-process-flows.md`
- `03-use-cases.md`
- `04-architecture.md`
- `05-database.md`
- `06-auth-rbac.md`
- `07-modules.md`
- `08-api-contracts.md`

## Diagramas incluidos

- `automata-use-cases.drawio`
- `automata-architecture.drawio`
- `automata-database-er.drawio`
- `automata-modules.drawio`
- `automata-api-contracts.drawio`

## Estado

Este paquete incorpora el documento `08-api-contracts.md` y actualiza los documentos afectados por las decisiones de API:

- Formato estándar de respuestas.
- HTTP status real + `status_code` en body.
- Contratos base por módulo.
- Apartados completados generan venta en `sales`.
- Ventas originadas desde apartados usan `source_type/source_id`.
