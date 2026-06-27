# Actualización de documentos — Casos de uso

Este paquete contiene únicamente los documentos nuevos o afectados por las decisiones revisadas.

## Incluidos

| Documento | Motivo |
|---|---|
| `03-use-cases.md` | Documento generado/actualizado |
| `01-business-rules.md` | Ajustado para aclarar que las devoluciones no generan saldo a favor |
| `02-process-flows.md` | Ajustado para devolución sobre venta con retorno de dinero inmediato |

## Decisiones aplicadas

```text
Anulación de venta = error operativo del mismo business_date, no genera saldo a favor.
Devolución sobre venta = venta válida que se devuelve, retorna dinero en el momento, no genera saldo a favor.
El método de devolución puede ser distinto al método original, pero debe registrarse.
Compras a proveedor pueden ser a crédito, con cuentas por pagar básicas desde el MVP.
Clientes requieren nombre, dirección, teléfono y talla de pie.
Productos tienen marca y código personalizado alfanumérico.
Código de barras queda opcional/preparado para futuro.
```
