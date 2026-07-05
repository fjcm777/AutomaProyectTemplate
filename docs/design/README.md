# Automata / Calzado Norita - Índice de documentación

**Versión:** documentación recuperada y corregida  
**Fecha:** 2026-07-05  
**Estado:** base documental válida hasta `08-api-contracts.md`  
**Siguiente documento pendiente:** `09-frontend-routes.md`

---

## 1. Propósito

Esta documentación define el diseño funcional y técnico del sistema **Automata** para **Calzado Norita**.

Debe servir como guía para:

- El propietario o responsable funcional del negocio.
- Desarrolladores backend.
- Desarrolladores frontend.
- IA utilizada para desarrollo asistido.
- Revisión de reglas de negocio.
- Generación de código coherente con la arquitectura acordada.

---

## 2. Cómo navegar la documentación

La documentación debe revisarse en este orden:

```text
00 -> contexto del negocio
01 -> reglas de negocio
02 -> flujos de proceso
03 -> casos de uso
04 -> arquitectura
05 -> base de datos
06 -> autenticación y permisos
07 -> módulos backend
08 -> contratos API
```

Antes de implementar una funcionalidad, se recomienda revisar:

1. La regla de negocio en `01-business-rules.md`.
2. El flujo relacionado en `02-process-flows.md`.
3. El caso de uso en `03-use-cases.md`.
4. Las tablas involucradas en `05-database.md`.
5. El módulo responsable en `07-modules.md`.
6. El endpoint correspondiente en `08-api-contracts.md`.

---

## 3. Índice de documentos

| Orden | Documento | Propósito | Cuándo usarlo |
|---:|---|---|---|
| 00 | [`00-business-context.md`](00-business-context.md) | Contexto general del negocio, alcance, stack y principios. | Para entender el objetivo del sistema. |
| 01 | [`01-business-rules.md`](01-business-rules.md) | Reglas funcionales obligatorias. | Antes de implementar procesos de negocio. |
| 02 | [`02-process-flows.md`](02-process-flows.md) | Flujos paso a paso. | Para entender operaciones completas. |
| 03 | [`03-use-cases.md`](03-use-cases.md) | Casos de uso por actor, permiso y regla. | Para planificar pantallas, endpoints y pruebas. |
| 04 | [`04-architecture.md`](04-architecture.md) | Arquitectura, estructura de código y transacciones. | Antes de crear módulos o servicios. |
| 05 | [`05-database.md`](05-database.md) | Diccionario técnico de datos. | Antes de crear modelos, migraciones o consultas. |
| 06 | [`06-auth-rbac.md`](06-auth-rbac.md) | Autenticación, roles, permisos y seguridad. | Antes de proteger endpoints o rutas. |
| 07 | [`07-modules.md`](07-modules.md) | Organización modular backend. | Para decidir dónde ubicar código. |
| 08 | [`08-api-contracts.md`](08-api-contracts.md) | Contratos API, respuestas, errores y endpoints. | Antes de implementar API o cliente frontend. |
| CA | [`CODE_ALIGNMENT.md`](CODE_ALIGNMENT.md) | Diferencia entre código actual y diseño objetivo. | Para entender qué existe y qué falta implementar. |

---

## 4. Diagramas disponibles

| Diagrama | Archivo | Propósito |
|---|---|---|
| Casos de uso | [`automata-use-cases.drawio`](automata-use-cases.drawio) | Actores y casos principales. |
| Arquitectura | [`automata-architecture.drawio`](automata-architecture.drawio) | Frontend, backend, DB, módulos, jobs y shared/core. |
| Base de datos | [`automata-database-er.drawio`](automata-database-er.drawio) | Entidades y relaciones principales. |
| Módulos | [`automata-modules.drawio`](automata-modules.drawio) | Responsabilidades y relación entre módulos. |
| API | [`automata-api-contracts.drawio`](automata-api-contracts.drawio) | Contratos, endpoints y respuesta estándar. |

Los archivos `.drawio` pueden abrirse en diagrams.net / draw.io.

---

## 5. Estado actual del código vs documentación

El proyecto `AutomaProyectTemplate.zip` representa una **base/template inicial**, no el sistema completo.

La documentación define el **diseño objetivo confirmado** para Automata / Calzado Norita.

Para revisar la alineación entre código actual y documentación, usar:

```text
CODE_ALIGNMENT.md
```

Regla importante:

```text
Si el código actual todavía no implementa algo documentado, no significa que la documentación esté incorrecta.
Significa que esa parte queda pendiente de implementación.
```

---

## 6. Decisiones técnicas principales

| Tema | Decisión |
|---|---|
| Arquitectura | Monolito modular |
| Backend | FastAPI |
| Frontend | React + TypeScript + Vite |
| DB | PostgreSQL |
| ORM | SQLAlchemy async |
| Migraciones | Alembic |
| Auth | JWT access token simple |
| Password hashing | Argon2 |
| Roles/permisos | Dinámicos en DB |
| Config técnica | `.env` |
| Config funcional | Tabla `settings` |
| Jobs | Scripts simples / cron / scheduler externo |
| Reportes | Solo lectura |
| Archivos | Uploads locales/volumen; DB guarda URL |
| Respuestas API | `status_code`, `message`, `data` |
| Errores API | `status_code`, `code`, `message`, `details` |

---

## 7. Decisiones funcionales principales

| Área | Decisión |
|---|---|
| Inventario | Todo cambio genera `inventory_movements`. |
| Disponibilidad | Considera reservado, dañado, prestado y retorno proveedor. |
| Productos | Producto base + variantes por talla/color. |
| Ventas | La venta final vive en `sales`. |
| Crédito | Ventas a crédito dejan `balance_due`. |
| Apartados | Reservan inventario y al completarse generan venta. |
| Devoluciones | Devuelven dinero, no saldo a favor. |
| Anulación | Solo mismo `business_date`, revierte inventario/pagos/caja. |
| Caja | Usa `business_date`, sesiones y movimientos. |
| Clientes | Saldo a favor con movimientos, no edición directa. |
| Proveedores | Retornos pueden quedar pendientes y resolverse después. |
| Settings | Valores funcionales variables viven en DB. |
| Auditoría | Acciones sensibles quedan registradas. |

---

## 8. Guía rápida por tarea

### Crear o modificar una tabla

Revisar:

```text
05-database.md
04-architecture.md
07-modules.md
```

### Crear un endpoint

Revisar:

```text
08-api-contracts.md
07-modules.md
06-auth-rbac.md
03-use-cases.md
```

### Implementar una regla de negocio

Revisar:

```text
01-business-rules.md
02-process-flows.md
03-use-cases.md
07-modules.md
```

### Crear una pantalla frontend

Revisar:

```text
08-api-contracts.md
06-auth-rbac.md
07-modules.md
CODE_ALIGNMENT.md
```

Luego continuar con:

```text
09-frontend-routes.md
```

### Implementar ventas

Revisar:

```text
01-business-rules.md
02-process-flows.md
03-use-cases.md
05-database.md
08-api-contracts.md
```

### Implementar apartados

Revisar:

```text
01-business-rules.md
02-process-flows.md
03-use-cases.md
05-database.md
08-api-contracts.md
```

### Implementar inventario

Revisar:

```text
01-business-rules.md
02-process-flows.md
05-database.md
07-modules.md
08-api-contracts.md
```

---

## 9. Flujo de trabajo acordado

El trabajo documental se hace documento por documento.

Reglas:

1. Se toma el siguiente documento pendiente.
2. Se analiza por bloques.
3. Si aparece una duda funcional, técnica o un vacío lógico, se resuelve antes de documentar.
4. El usuario confirma decisiones importantes.
5. Después se genera o actualiza el documento.
6. Si una decisión afecta documentos anteriores, esos documentos también se actualizan.
7. Si afecta diagramas, también se actualizan los `.drawio`.
8. Se entrega un `.zip` con todos los documentos y diagramas afectados.

No se debe avanzar a documentos nuevos si hay una corrección estructural pendiente en documentos anteriores.

---

## 10. Siguiente paso

Después de revisar y aprobar este paquete, el siguiente documento a trabajar es:

```text
09-frontend-routes.md
```

Ese documento debe definir:

- Layout general frontend.
- Rutas públicas.
- Rutas protegidas.
- Módulos/pantallas.
- Relación permisos-rutas.
- Menú lateral.
- Navegación por experiencia de usuario.
- Relación con `auth/me`.
- Estructura recomendada de carpetas frontend.
- Diferencia entre estructura backend por dominio y frontend por experiencia de usuario.

---

## 11. Nota de calidad

Este paquete reemplaza versiones anteriores degradadas o demasiado resumidas.

En particular, `05-database.md` fue reconstruido como diccionario técnico, incluyendo:

- Tabla.
- Campo.
- Tipo PostgreSQL.
- Nullable.
- Default.
- PK/FK.
- Unique.
- Checks.
- Índices.
- Descripción funcional.
- Reglas relacionadas.

Este ZIP debe considerarse la base documental válida antes de continuar.
