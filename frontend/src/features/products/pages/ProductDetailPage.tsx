import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProductById } from "../api/products"

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = parseInt(id || "0", 10)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: productId > 0,
  })

  if (isLoading) {
    return <p className="text-center py-8">Cargando...</p>
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">Error al cargar el producto</p>
  }

  if (!product) {
    return <p className="text-center py-8 text-gray-500">Producto no encontrado</p>
  }

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => navigate("/products")}
        className="mb-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Volver
      </button>

      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full max-h-64 object-cover rounded mb-4"
          />
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Descripción</p>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Precio</p>
              <p className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Categoría ID</p>
              <p className="text-xl">{product.category_id}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">ID del Producto</p>
            <p className="text-gray-700">{product.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
