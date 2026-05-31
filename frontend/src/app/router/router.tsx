import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "../../app"

import { ProductsPage } from "../../features/products/pages/ProductsPage"
import { ProductCreatePage } from "../../features/products/pages/ProductCreatePage"
import { ProductDetailPage } from "../../features/products/pages/ProductDetailPage"
import { ProductEditPage } from "../../features/products/pages/ProductEditPage"

import { Game } from "../../features/tictactoe/pages/TicTacToePage"
import { CleanSheet } from "../../features/test/pages/CleanSheet"

import { LoginPage } from "../../features/login/pages/LoginPage"

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
      {
        path: "tictactoe",
        element: <Game />,
      },
      {
        path: "test",
        element: <CleanSheet />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
