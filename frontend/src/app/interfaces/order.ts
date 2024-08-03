export interface Order {
    client: number
    total: number
    status: string
    items: Item[]
  }

  export interface OrderResponse {
    id: number
    client: number
    total: number
    status: string
    date_created: string
    date_update: string
    items: Item[]
  }

  export interface Item {
    product: number
    quantity: number
  }
  