import { ErrorEnvelope, SuccessEnvelope } from "./types"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Centralized HTTP client to keep request conventions in one place.
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!response.ok) {
    const payload = await parseJsonSafe(response)

    // Backend error envelope: { status_code, code, message, details }.
    if (typeof payload === "object" && payload !== null && "message" in payload) {
      const errorPayload = payload as ErrorEnvelope
      throw new ApiError(errorPayload.message, response.status, errorPayload.code, errorPayload.details)
    }

    throw new ApiError("Request failed", response.status)
  }

  if (response.status === 204) {
    return null as T
  }

  // Backend success envelope: { status_code, message, data, warnings }.
  const envelope = (await response.json()) as SuccessEnvelope<T>
  return envelope.data
}
