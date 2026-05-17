import { useNavigate } from "react-router-dom"
import { ProductForm } from "../components/ProductForm"
import { useCreateProduct } from "../hooks/useCreateProduct"

export function ProductCreatePage() {
  const navigate = useNavigate()
  const mutation = useCreateProduct()

  const handleSubmit = (data: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate("/products")
      },
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Crear Producto
      </h1>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />

      {mutation.error && (
        <p className="mt-4 text-red-500">
          Error: {mutation.error.message}
        </p>
      )}
    </div>
  )
}