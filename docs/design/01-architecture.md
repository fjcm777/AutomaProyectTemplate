# 01 — Arquitectura del Sistema

## Stack Tecnológico

| Capa | Tecnología | Versión sugerida |
|------|------------|------------------|
| Backend | FastAPI + Python | Python 3.12 / FastAPI 0.115+ |
| ORM | SQLAlchemy | 2.x |
| Migraciones | Alembic | 1.x |
| Validación | Pydantic | v2 |
| Base de datos | PostgreSQL | 16+ |
| Frontend | React + TypeScript | React 18 / TS 5.x |
| Build tool | Vite | 6.x |
| State / Fetching | TanStack Query | v5 |
| Estilos | Tailwind CSS | 3.x |
| Infraestructura | Docker + Docker Compose | v2 |

---

## Patrón Arquitectónico

El sistema usa **Modular Monolith con Vertical Slice** tanto en backend como en frontend.

Cada dominio funcional vive en su propio módulo y mantiene separación por capas:

```text
Model → Schema → Repository → Service → API
```

### Ventajas

- Agregar módulos nuevos sin reescribir los existentes.
- Mantener reglas de negocio encapsuladas por dominio.
- Facilitar pruebas unitarias e integración.
- Permitir una futura separación hacia microservicios si fuera necesario.
- Evitar dependencias directas entre módulos usando eventos internos.

---

## Estructura Backend

```text
backend/app/
├── core/
│   ├── config.py
│   ├── database.py
│   └── dependencies.py
├── db/
│   └── base.py
├── modules/
│   ├── auth/
│   ├── inventory/
│   ├── sales/
│   ├── customers/
│   ├── suppliers/
│   ├── reports/
│   └── accounting/          ← módulo futuro / fase posterior
├── shared/
│   ├── events/              ← infraestructura interna, no módulo funcional
│   ├── audit/
│   ├── notifications/
│   ├── exceptions.py
│   └── pagination.py
└── main.py
```

---

## Estructura Frontend

```text
frontend/src/
├── app/
│   ├── app.tsx
│   └── router/
│       └── router.tsx
├── features/
│   ├── auth/
│   ├── inventory/
│   ├── sales/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── returns/
│   │   └── layaways/        ← subproceso de ventas
│   ├── customers/
│   ├── suppliers/
│   ├── reports/
│   └── accounting/          ← futuro
└── shared/
    ├── api/
    ├── components/
    ├── hooks/
    ├── types/
    └── utils/
```

---

## Módulos Funcionales

| Módulo | Backend | Frontend | Tablas principales |
|--------|---------|----------|-------------------|
| Autenticación | `auth/` | `auth/` | `users`, `roles`, `permissions`, `refresh_tokens`, `activity_log` |
| Inventario | `inventory/` | `inventory/` | `products`, `categories`, `sizes`, `colors`, `product_variants`, `stock`, `stock_reservations`, `stock_movements` |
| Ventas | `sales/` | `sales/` | `invoices`, `invoice_items`, `customer_payments`, `sales_returns`, `layaways`, `layaway_items`, `layaway_payments`, `layaway_alerts` |
| Clientes | `customers/` | `customers/` | `customers`, `customer_credit_log` |
| Proveedores | `suppliers/` | `suppliers/` | `suppliers`, `purchase_orders`, `purchase_order_items`, `purchase_returns`, `supplier_payments` |
| Reportes | `reports/` | `reports/` | vistas, queries y agregaciones |
| Contabilidad | `accounting/` | `accounting/` | `chart_of_accounts`, `accounting_rules`, `journal_entries`, `journal_entry_lines`, `fiscal_periods` |

---

## Infraestructura Interna

| Componente | Ubicación sugerida | Propósito |
|------------|--------------------|-----------|
| Eventos de dominio | `shared/events/` | Registrar eventos como `invoice_issued`, `layaway_created`, `customer_payment_received` |
| Auditoría | `shared/audit/` o `auth/activity_log` | Registrar acciones sensibles del sistema |
| Notificaciones | `shared/notifications/` | Alertas internas: apartados vencidos, stock bajo, saldos vencidos |
| Paginación | `shared/pagination.py` | Respuestas paginadas reutilizables |
| Excepciones | `shared/exceptions.py` | Errores comunes de dominio/API |

`shared/events` no debe considerarse módulo funcional; es una pieza técnica para desacoplar procesos.

---

## Convenciones de Nombres

### Backend

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Módulos | `snake_case` | `inventory`, `sales` |
| Archivos | `snake_case` | `api.py`, `models.py` |
| Modelos SQLAlchemy | `PascalCase` | `ProductVariant`, `Layaway` |
| Tablas | `snake_case` plural | `product_variants`, `layaway_payments` |
| Columnas | `snake_case` | `created_at`, `outstanding_balance` |
| Schemas Pydantic | `PascalCase` + sufijo | `LayawayCreate`, `InvoiceOut` |
| Funciones | `snake_case` | `create_layaway()` |

### Frontend

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Features | `kebab-case` o `snake_case` consistente | `sales`, `inventory` |
| Componentes | `PascalCase` | `LayawayTable.tsx` |
| Hooks | `camelCase` con prefijo `use` | `useLayaways.ts` |
| API files | `camelCase` | `layawaysApi.ts` |
| Tipos | `PascalCase` | `Layaway`, `Invoice` |

---

## Decisiones Arquitectónicas

1. **El sistema de apartado pertenece a ventas.** No se recomienda crear un módulo separado `layaway`; es una modalidad de venta.
2. **La reserva de inventario pertenece a inventario.** Ventas crea el apartado, pero inventario controla la reserva física mediante `stock_reservations`.
3. **Eventos internos desacoplan los módulos.** Ventas no debe llamar directamente a contabilidad.
4. **Contabilidad puede ser fase futura.** Debe consumir eventos operativos ya confirmados.
5. **Reportes no deben duplicar reglas de negocio.** Deben consultar datos consolidados o vistas preparadas.


---

## Arquitectura de Eventos Internos

Los eventos de integración no son un módulo funcional visible para el usuario. Se implementan como infraestructura interna en:

```text
backend/app/shared/events/
```

Su propósito es desacoplar procesos entre módulos. Por ejemplo, cuando `sales` emite una factura, no debe llamar directamente a `accounting`. En su lugar, registra un evento como `factura_emitida`, que puede ser procesado posteriormente por contabilidad, reportes, auditoría o notificaciones.

Eventos internos sugeridos:

```text
factura_emitida
apartado_creado
apartado_vencido
pago_cliente_recibido
orden_compra_recibida
ajuste_inventario_registrado
devolucion_venta_registrada
periodo_cerrado
asiento_cierre_generado
```

---

## Alcance por etapas

| Área | Etapa |
|------|-------|
| Ventas directas, crédito y apartado | Primera etapa |
| Inventario, stock, reservas y kardex | Primera etapa |
| Clientes, proveedores, reportes básicos y RBAC | Primera etapa |
| Catálogo de cuentas, reglas contables y asientos base | Segunda etapa |
| Cierre contable formal | Segunda etapa |
| Conciliación bancaria | Segunda etapa |

La conciliación bancaria puede ubicarse como subárea futura de `accounting` o como soporte interno en `shared/bank_reconciliation`.
