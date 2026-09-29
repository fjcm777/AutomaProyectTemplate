// Shapes matching the backend's standard envelope (see docs/design/08-api-contracts.md).

export type SuccessEnvelope<T> = {
  status_code: number
  message: string
  data: T
  warnings?: { code: string; message: string }[] | null
}

export type ErrorEnvelope = {
  status_code: number
  code: string
  message: string
  details?: unknown
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  page_size: number
}
