export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  orderId: number;
  userId: number;
  amount: number;
}

export interface CreateOrderRequest {
  userId: number;
  amount: number;
}
