// Pages
export { ProductsPage } from "./pages/ProductsPage"
export { ProductCreatePage } from "./pages/ProductCreatePage"
export { ProductDetailPage } from "./pages/ProductDetailPage"
export { ProductEditPage } from "./pages/ProductEditPage"

// Components
export { ProductTable } from "./components/ProductTable"
export { ProductForm } from "./components/ProductForm"

// Hooks
export { useProducts } from "./hooks/useProducts"
export { useCreateProduct } from "./hooks/useCreateProduct"
export { useUpdateProduct } from "./hooks/useUpdateProduct"
export { useDeleteProduct } from "./hooks/useDeleteProduct"

// Types
export type { Product, CreateProductPayload, UpdateProductPayload } from "./types/product.types"

// API
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api/products"
