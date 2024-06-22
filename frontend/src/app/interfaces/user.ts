export interface LoginResponse {
    refresh: string;
    access: string;
    message: string;
  }

export interface User{
    first_name: string;
    last_name: string;
    email: string;
}
  