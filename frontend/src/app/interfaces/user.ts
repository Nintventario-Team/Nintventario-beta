export interface LoginResponse {
  refresh: string
  access: string
  message: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}
