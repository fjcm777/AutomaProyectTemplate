# Paquete de documentacion actualizado - Automata

Fecha: 2026-06-28

Este paquete contiene los documentos actualizados segun las decisiones discutidas para el proyecto Automata.

## Archivos incluidos

- `01-business-rules.md`
- `02-process-flows.md`
- `03-use-cases.md`
- `04-architecture.md`

## Motivo de actualizacion

Se genero el documento `04-architecture.md` completo y se actualizaron documentos anteriores que podian verse afectados por decisiones arquitectonicas y reglas aclaradas durante la conversacion.

## Ajustes importantes incluidos

- Devoluciones sobre venta devuelven dinero en el momento y no generan saldo a favor.
- Apartados pueden generar saldo a favor en cambios/cancelaciones/resoluciones.
- Alembic manejara estructura y seeds base.
- Auditoria sera selectiva.
- No habra tablas historicas en el MVP.
- `audit_logs` y `business_events` podran limpiarse por retencion.
- Docker Compose sera la base de desarrollo/despliegue inicial.
- PostgreSQL y uploads tendran persistencia.
- Backend sera monolito modular.
- Frontend se organizara por features.
- Permisos usaran formato `recurso.accion`.
