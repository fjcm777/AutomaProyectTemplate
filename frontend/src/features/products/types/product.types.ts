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

// makes all fields optional, useful for update operations 
// where you might only want to change a subset of the product's properties.
export type UpdateProductPayload = Partial<CreateProductPayload>