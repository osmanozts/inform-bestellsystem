export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  userId: string;
  items: CreateOrderItemDto[];
}
