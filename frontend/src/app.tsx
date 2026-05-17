import { Outlet, Link } from "react-router-dom"

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold hover:opacity-90">
              Store
            </Link>
            <ul className="flex gap-6">
              <li>
                <Link
                  to="/products"
                  className="hover:opacity-90 transition"
                >
                  Productos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>

      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-600">
          <p>&copy; 2024 Store. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}