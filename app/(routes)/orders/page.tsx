'use client'

import { motion } from 'framer-motion';
import { CurrentOrder, PizzaOrder } from '@/lib/types';
import { CurrentOrderTracker } from './_components/current-order-tracker';
import { PizzaOrderCard } from './_components/pizza-order-card';

const currentOrder: CurrentOrder = {
  id: 'current',
  type: 'Supreme',
  size: 'Large',
  toppings: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Sausage', 'Bell Peppers', 'Onions', 'Olives'],
  orderDate: '2023-05-20',
  price: 19.99,
  imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0',
  status: 'Baking',
  estimatedDeliveryTime: '7:30 PM'
};

const pastOrders: PizzaOrder[] = [
  {
    id: '1',
    type: 'Margherita',
    size: 'Medium',
    toppings: ['Tomato Sauce', 'Mozzarella', 'Basil'],
    orderDate: '2023-05-15',
    price: 12.99,
    imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0'
  },
  {
    id: '2',
    type: 'Pepperoni',
    size: 'Large',
    toppings: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    orderDate: '2023-05-10',
    price: 15.99,
    imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0'
  },
  {
    id: '3',
    type: 'Vegetarian',
    size: 'Small',
    toppings: ['Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Onions', 'Mushrooms'],
    orderDate: '2023-05-05',
    price: 11.99,
    imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0'
  },
  {
    id: '4',
    type: 'Hawaiian',
    size: 'Medium',
    toppings: ['Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],
    orderDate: '2023-04-30',
    price: 13.99,
    imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0'
  },
  {
    id: '5',
    type: 'Meat Lovers',
    size: 'Large',
    toppings: ['Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Sausage', 'Bacon', 'Ground Beef'],
    orderDate: '2023-04-25',
    price: 17.99,
    imageUrl: 'https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0'
  },
];

export default function PastOrders() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 mt-[2rem]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pizza Order Tracker</h1>

        <CurrentOrderTracker order={currentOrder} />

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Orders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastOrders.map((order) => (
            <PizzaOrderCard key={order.id} order={order} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
