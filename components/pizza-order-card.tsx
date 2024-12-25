'use client'

import { PizzaOrder } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PizzaOrderCardProps {
  order: PizzaOrder;
}

export function PizzaOrderCard({ order }: PizzaOrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={order.imageUrl}
          alt={order.type}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{order.type}</h3>
        <p className="text-sm text-gray-600 mb-1">Size: {order.size}</p>
        <p className="text-sm text-gray-600 mb-1">Toppings: {order.toppings.join(', ')}</p>
        <p className="text-sm text-gray-600 mb-2">Ordered on: {order.orderDate}</p>
        <p className="text-lg font-bold text-green-600">${order.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
}
