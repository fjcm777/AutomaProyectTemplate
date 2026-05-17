import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "../../app"
import { ProductsPage } from "../../features/products/pages/ProductsPage"
import { ProductCreatePage } from "../../features/products/pages/ProductCreatePage"
import { ProductDetailPage } from "../../features/products/pages/ProductDetailPage"
import { ProductEditPage } from "../../features/products/pages/ProductEditPage"

// Keep all app routes in one place so feature modules can be plugged in easily.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: "new",
            element: <ProductCreatePage />,
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
          },
          {
            path: ":id/edit",
            element: <ProductEditPage />,
          },
        ],
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
