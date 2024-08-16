export interface CartItem {
  id: number
  name: string
  price: number
  maxQuantity: number
  quantityToBuy: number
  details: string
  image: string
  updatedPrice?: number
}
