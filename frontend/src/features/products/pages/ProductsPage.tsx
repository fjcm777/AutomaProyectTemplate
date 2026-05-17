import { Link } from "react-router-dom"
import { ProductTable } from "../components/ProductTable"
import { useProducts } from "../hooks/useProducts"

export function ProductsPage() {
  // Query ownership stays in the page; table only renders data.
  const {
    data,
    isLoading,
    error,
  } = useProducts()

  if (isLoading) {
    return <p className="text-center py-8">Cargando productos...</p>
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">Error al cargar los productos</p>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Productos
        </h1>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          + Crear Producto
        </Link>
      </div>

      <ProductTable
        products={data || []}
      />
    </div>
  )
}
