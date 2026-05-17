import { apiFetch } from "@/shared/api/clients"

import {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product.types"

export function getProducts() {
  return apiFetch<Product[]>("/products/")
}

export function getProductById(id: number) {
  return apiFetch<Product>(`/products/${id}`)
}

export function createProduct(payload: CreateProductPayload) {
  return apiFetch<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateProduct(
  id: number,
  payload: UpdateProductPayload
) {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteProduct(id: number) {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
  })
}