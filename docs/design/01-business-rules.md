# 01 - Business Rules

## Inventario disponible

La disponibilidad se calcula considerando:

- Stock físico.
- Cantidad reservada por apartados.
- Cantidad prestada.
- Cantidad separada para retorno a proveedor.
- Cantidad dañada o no vendible.

Regla:

```text
available = on_hand - reserved - loaned - supplier_return - damaged
```

## Mercadería prestada

La mercadería prestada:

- Deja de estar disponible.
- No es venta.
- Puede estar asociada a un cliente o solo a nombre/teléfono.
- Puede devolverse.
- Puede convertirse en venta sin descontar inventario dos veces.

## Mercadería dañada

La mercadería dañada:

- Deja de estar disponible.
- Puede moverse a una bodega lógica no vendible.
- No se da de baja automáticamente.
- La baja requiere permiso especial y motivo.

## Retorno a proveedor

El retorno a proveedor es independiente de la devolución sobre venta.

Puede resolverse como:

- Crédito a favor.
- Reembolso.
- Reemplazo.
- Sin compensación.

Los retornos pueden quedar pendientes de resolución. El producto puede separarse como no vendible antes de enviarse al proveedor, y la compensación puede resolverse días después.

## Ventas a crédito

Las ventas a crédito son parte esencial del negocio.

Se permite nueva venta a crédito con deuda pendiente solo con permiso o autorización especial.

## Apartados

Reglas principales:

- Requieren pago inicial configurable.
- Tienen plazo configurable.
- El plazo por defecto puede ser 60 días.
- Reservan inventario.
- Si se completan, generan una venta en `sales`.
- Si se cancelan o vencen, pueden generar saldo a favor según política definida.
- El cambio de producto apartado se maneja cancelando la reserva actual, generando saldo a favor si aplica y creando un nuevo apartado.

## Devolución sobre venta

Toda devolución autorizada sobre venta implica devolver dinero en el momento.

Reglas:

- No genera saldo a favor.
- Puede usar un método de devolución distinto al método original.
- Debe quedar auditada.
- Puede retornar producto a inventario vendible o no vendible.

## Anulación de venta

La anulación se usa por error operativo.

Reglas:

- Solo se permite en el mismo `business_date`.
- Requiere permiso especial.
- Requiere motivo.
- Revierte venta, pago, inventario y caja.
- No genera saldo a favor.

## Caja y business_date

El sistema maneja:

- `created_at`: fecha/hora real.
- `business_date`: día operativo.

Si una caja fue cerrada y se registra una venta después, el sistema debe solicitar confirmación para abrir o usar caja del siguiente `business_date`.

## Configuraciones variables

Toda configuración funcional variable debe vivir en base de datos.

Ejemplos:

- Impuesto activo.
- Porcentaje de impuesto.
- Nombre del impuesto.
- Moneda principal.
- Plazo de apartados.
- Porcentaje mínimo de abono.
- Retención de auditoría.
- Retención de eventos.

La configuración técnica vive en `.env`.

## Auditoría

La auditoría es selectiva.

Se auditan operaciones sensibles, no consultas normales.

Ejemplos:

- Anulación de venta.
- Devolución.
- Ajuste de inventario.
- Baja de inventario.
- Cierre de caja.
- Cambios de permisos.
- Cambios de configuración sensible.

## Borrado lógico

Los registros importantes no se borran físicamente.

Se usa:

- `is_active`
- `deleted_at`
- `deleted_by`

cuando aplique.
