# 00 - Business Context

## Sistema

**Nombre:** Automata  
**Negocio inicial:** Calzado Norita  
**Tipo de negocio:** tienda de calzado, ropa y accesorios.

Automata será un sistema ERP adaptado inicialmente a Calzado Norita, pero diseñado para poder reutilizarse en otros negocios similares con cambios mínimos de configuración.

## Stack confirmado

- Backend: FastAPI.
- Frontend: React + TypeScript + Vite.
- Base de datos: PostgreSQL.
- ORM: SQLAlchemy 2.x async.
- Migraciones: Alembic.
- Arquitectura inicial: monolito modular.
- Contenedores: Docker Compose.

## Alcance de negocio

El sistema debe soportar inicialmente:

- Productos de calzado, ropa y accesorios.
- Productos con variantes por talla y color.
- Inventario por sucursal y bodega.
- Ventas de contado.
- Ventas a crédito.
- Apartados.
- Caja y arqueo.
- Clientes.
- Proveedores.
- Compras.
- Retornos a proveedor.
- Mercadería dañada.
- Mercadería prestada.
- Reportes.
- Configuración funcional desde base de datos.
- Auditoría selectiva.
- Eventos internos para trazabilidad y futura contabilidad.

## Moneda

La operación principal será en córdobas.

El sistema debe permitir reportes en dólares usando tipo de cambio manual por fecha, basado en una fuente como el Banco Central.

## Facturación e impuestos

Actualmente el negocio no aplica impuestos, pero el sistema debe quedar preparado para soportar impuestos configurables.

El impuesto se manejará como configuración funcional en base de datos, no quemado en código.

## Actores funcionales

Los nombres visibles pueden estar en español, mientras que los nombres técnicos se mantendrán en inglés.

Actores base:

- Administrador (`admin`)
- Gerente / Encargado (`manager`)
- Vendedor (`seller`)
- Cajero (`cashier`)
- Encargado de bodega (`warehouse`)
- Responsable de compras (`purchasing`)
- Contador (`accountant`)
- Sistema (`system`)

## Roles y permisos

Los roles y permisos serán dinámicos y vivirán en base de datos.

La seguridad no debe depender del nombre del rol, sino de los permisos asignados.

## Principio general

Automata debe ser práctico para el MVP, pero suficientemente ordenado para crecer sin reescribir todo el sistema.
