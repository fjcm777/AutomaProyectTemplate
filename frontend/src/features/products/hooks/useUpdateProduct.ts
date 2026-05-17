import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { updateProduct } from "../api/products"

import { UpdateProductPayload } from "../types/product.types"

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateProductPayload
    }) => updateProduct(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
    },
  })
}