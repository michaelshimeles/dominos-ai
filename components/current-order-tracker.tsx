'use client'

import { CurrentOrder, OrderStatus } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CurrentOrderTrackerProps {
  order: CurrentOrder;
}

export function CurrentOrderTracker({ order }: CurrentOrderTrackerProps) {
  const statusSteps: OrderStatus[] = ['Preparing', 'Baking', 'Quality Check', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Current Order Tracking</h2>
        <div className="flex items-center mb-4">
          <div className="relative h-24 w-24 mr-4">
            <Image
              src={order.imageUrl}
              alt={order.type}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{order.type}</h3>
            <p className="text-gray-600">Size: {order.size}</p>
            <p className="text-gray-600">Toppings: {order.toppings.join(', ')}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Status: <span className="text-green-600">{order.status}</span></p>
          <p className="text-gray-600">Estimated Delivery: {order.estimatedDeliveryTime}</p>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {Math.round((currentStepIndex + 1) / statusSteps.length * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
            <motion.div
              style={{ width: `${(currentStepIndex + 1) / statusSteps.length * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex + 1) / statusSteps.length * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`rounded-full h-4 w-4 ${index <= currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
