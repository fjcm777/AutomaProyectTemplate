import { useState } from "react"
import { CreateProductPayload } from "../types/product.types"

type ProductFormProps = {
  onSubmit: (data: CreateProductPayload) => void
  isLoading?: boolean
  initialData?: Partial<CreateProductPayload>
}

export function ProductForm({ onSubmit, isLoading = false, initialData }: ProductFormProps) {
  // Reused for create and edit flows by accepting optional initial data.
  const [form, setForm] = useState<CreateProductPayload>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category_id: initialData?.category_id || 0,
    image_url: initialData?.image_url || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    if (!form.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }
    if (form.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0"
    }
    if (form.category_id <= 0) {
      newErrors.category_id = "La categoría es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      // Keep numeric fields typed as numbers before sending to the API.
      [name]:
        name === "price" ||
        name === "category_id"
          ? Number(value)
          : value,
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }))
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (validateForm()) {
      onSubmit(form)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          name="name"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          placeholder="Descripción del producto"
          value={form.description}
          onChange={handleChange}
          disabled={isLoading}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Precio</label>
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          disabled={isLoading}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ID Categoría</label>
        <input
          type="number"
          name="category_id"
          placeholder="ID de la categoría"
          value={form.category_id}
          onChange={handleChange}
          disabled={isLoading}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL Imagen (opcional)</label>
        <input
          name="image_url"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={form.image_url || ""}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 font-medium"
      >
        {isLoading ? "Guardando..." : "Guardar Producto"}
      </button>
    </form>
  )
}
