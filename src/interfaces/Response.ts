export interface ApiResponse<T> {
  data: T
}
export interface ErrorResponse {
  status: boolean
  message: string
}
