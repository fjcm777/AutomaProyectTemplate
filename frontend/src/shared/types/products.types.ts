export type Product = {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  image_url?: string | null
}

export type CreateProductPayload = {
  name: string
  description: string
  price: number
  category_id: number
  image_url?: string | null
}

export type UpdateProductPayload = Partial<CreateProductPayload>