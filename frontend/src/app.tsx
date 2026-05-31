import { useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"

import { LogOutForm } from "./features/login/components/LogOutForm"
import { useThemeContext } from "./shared/contexts/theme-context"

type NavItem = {
  label: string
  to: string
  icon: JSX.Element
}

const navigation: NavItem[] = [
  {
    label: "Productos",
    to: "/products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Z" />
        <path d="M3 7.5V16.5L12 21l9-4.5V7.5" />
        <path d="M12 12v9" />
      </svg>
    ),
  },
  {
    label: "Tic Tac Toe",
    to: "/tictactoe",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M7 4v16M17 4v16M4 7h16M4 17h16" />
      </svg>
    ),
  },
  {
    label: "CleanSheet",
    to: "/test",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
      </svg>
    ),
  },
  {
    label: "Login",
    to: "/login",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
      </svg>
    ),
  },
]

function navItemClass(isActive: boolean) {
  return isActive
    ? "flex items-center gap-3 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
    : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
}

export function App() {
  const { theme, toggleTheme } = useThemeContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 bg-white px-5 py-6 transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Store Shell
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => navItemClass(isActive)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? "Cambiar a Light" : "Cambiar a Dark"}
          </button>

          <div className="mt-3">
            <LogOutForm className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-900/40" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Abrir menú"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Application shell con sidebar
            </p>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              Theme: {theme}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
