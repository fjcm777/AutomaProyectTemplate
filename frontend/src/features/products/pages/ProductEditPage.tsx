import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProductById } from "../api/products"
import { ProductForm } from "../components/ProductForm"
import { useUpdateProduct } from "../hooks/useUpdateProduct"
import { CreateProductPayload } from "../types/product.types"

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = parseInt(id || "0", 10)

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: productId > 0,
  })

  const updateMutation = useUpdateProduct()

  const handleSubmit = (data: CreateProductPayload) => {
    updateMutation.mutate(
      { id: productId, payload: data },
      {
        onSuccess: () => {
          navigate(`/products/${productId}`)
        },
      }
    )
  }

  if (isLoadingProduct) {
    return <p className="text-center py-8">Cargando...</p>
  }

  if (productError) {
    return <p className="text-center py-8 text-red-500">Error al cargar el producto</p>
  }

  if (!product) {
    return <p className="text-center py-8 text-gray-500">Producto no encontrado</p>
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/products")}
        className="mb-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Editar Producto
      </h1>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        initialData={product}
      />

      {updateMutation.error && (
        <p className="mt-4 text-red-500">
          Error: {updateMutation.error.message}
        </p>
      )}
    </div>
  )
}
