import { Product } from "../types/product.types"
import { useDeleteProduct } from "../hooks/useDeleteProduct"

type ProductTableProps = {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  const deleteProductMutation = useDeleteProduct()

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteProductMutation.mutate(id)
    }
  }

  if (products.length === 0) {
    return <p className="text-gray-500">No hay productos disponibles</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Precio</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Categoría</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{product.id}</td>
              <td className="border border-gray-300 px-4 py-2 font-medium">{product.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                {product.description?.substring(0, 50)}...
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                ${product.price.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">{product.category_id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteProductMutation.isPending}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  {deleteProductMutation.isPending ? "Eliminando..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
