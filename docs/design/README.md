# 📋 Documentación de Diseño del Sistema

> **Proyecto:** Sistema de Gestión Modular (Calzado Norita)
> **Stack:** FastAPI · React + TypeScript · PostgreSQL
> **Etapa:** 1 — Diseño
> **Última actualización:** 2026-06-02

---

## Índice General

| # | Documento | Descripción |
|---|-----------|-------------|
| 1 | [Arquitectura](./01-architecture.md) | Stack, estructura modular y convenciones de nombres |
| 2 | [Casos de Uso](./02-use-cases.md) | Casos de uso por módulo y actores del sistema |
| 3 | [Base de Datos](./03-database.md) | Diagramas ERD y SQL completo por módulo |
| 4 | [Auth + RBAC](./04-auth-rbac.md) | Autenticación, roles, permisos y flujos de seguridad |
| 5 | [Estructura de Módulos](./05-modules.md) | Estructura de archivos backend y frontend |

---

## Módulos del Sistema

```
┌─────────────────────────────────────────────┐
│              SISTEMA DE GESTIÓN             │
├──────────┬──────────┬───────────┬───────────┤
│   auth   │inventory │   sales   │ customers │
├──────────┴──────────┴───────────┴───────────┤
│          suppliers        reports           │
└─────────────────────────────────────────────┘
```

| Módulo | Descripción |
|--------|-------------|
| `auth` | Autenticación JWT, usuarios, roles y permisos (RBAC) |
| `inventory` | Productos, categorías, bodegas, stock y movimientos |
| `sales` | Cotizaciones, facturas, pagos y notas de crédito |
| `customers` | Clientes, crédito y estado de cuenta |
| `suppliers` | Proveedores, órdenes de compra y pagos |
| `reports` | Reportes analíticos y dashboard de KPIs |

---

## Estado del Diseño

- [x] Arquitectura definida
- [x] Casos de uso documentados
- [x] Base de datos diseñada (SQL completo)
- [x] Auth + RBAC diseñado
- [x] Estructura de módulos definida
- [ ] Flujos de negocio detallados
- [ ] Wireframes / mockups UI
- [ ] Implementación
