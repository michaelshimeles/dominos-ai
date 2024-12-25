export interface PizzaOrder {
  id: string;
  type: string;
  size: string;
  toppings: string[];
  orderDate: string;
  price: number;
  imageUrl: string;
}

export type OrderStatus = 'Preparing' | 'Baking' | 'Quality Check' | 'Out for Delivery' | 'Delivered';

export interface CurrentOrder extends PizzaOrder {
  status: OrderStatus;
  estimatedDeliveryTime: string;
}
