export interface OrderItemDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  userId: string;
  items: OrderItemDto[];
  totalPrice: number;
  createdAt: string;
}
