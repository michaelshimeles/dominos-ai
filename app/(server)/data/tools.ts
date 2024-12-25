"server-only";
import { tool as createTool } from "ai";
import { z } from "zod";
import { orderDetails } from "./pizza/order-details";
import selectLocation from "./pizza/select-location";
import { selectPizza } from "./pizza/select-pizza";
import { processPayment } from "./pizza/process-payment";

// State interface
interface OrderState {
  selectedFood?: any;
  address?: any;
  payment?: any;
  customerInfo?: any;
  orderObject?: any;
}

let orderState: OrderState = {};

const selectFood = createTool({
  description: "Allow the user to select food items",
  parameters: z.object({
    items: z.array(
      z.object({
        name: z.enum([
          "basicCheese",
          "pepperoniExtraCheese",
          "hawaiian",
          "supreme",
        ]),
        size: z.enum(["10SCREEN", "12SCREEN", "14SCREEN", "16SCREEN"]),
        quantity: z.number().int().positive(),
      })
    ),
  }),
  execute: async ({ items }) => {
    // Logic to process food selection
    const result = await selectPizza(items);
    orderState.selectedFood = result;
    return { success: true, orderItems: result };
  },
});

const selectNearbyStore = createTool({
  description: "Find the nearest pizza location to order from",
  parameters: z.object({
    customerInfo: z.object({
      address: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      email: z.string(),
      unitNumber: z.string(),
      unitType: z.string(),
    }),
  }),
  execute: async ({ customerInfo }) => {
    try {
      const storeId = await selectLocation({ customerInfo });

      orderState.address = storeId;
      orderState.customerInfo = customerInfo;
      return {
        success: true,
        result: {
          address: customerInfo.address,
          storeInfo: storeId,
        },
      };
    } catch (error) {
      return {
        success: false,
        result: error,
      };
    }
  },
});

const getOrderDetails = createTool({
  description: "Get the order details like amount due",
  parameters: z.object({}),
  execute: async () => {
    if (
      !orderState.customerInfo ||
      !orderState.selectedFood ||
      !orderState.address
    ) {
      console.log("Missing order data:", { orderState });
      throw new Error("Missing required order data");
    }

    console.log("orderState.selectedFood", orderState?.selectedFood?.[0]);
    const result = await orderDetails(
      orderState.customerInfo,
      orderState?.selectedFood?.[0],
      orderState.address
    );

    orderState.orderObject = result.order;

    return {
      success: true,
      result: result,
    };
  },
});

const processCardPayments = createTool({
  description: "Process customers payment",
  parameters: z.object({
    cardInfo: z.object({
      amount: z.any(),
      number: z.string(),
      expiration: z.string(),
      securityCode: z.string(),
      postalCode: z.string(),
      tipAmount: z.number(),
    }),
  }),
  execute: async ({ cardInfo }) => {
    const result = await processPayment(orderState.orderObject, cardInfo);

    return result;
  },
});

const trackOrder = createTool({
  description: "Track the status of an order",
  parameters: z.object({
    orderId: z.string().describe("The unique identifier for the order"),
  }),
  execute: async ({ orderId }) => {
    // Mock logic to fetch order status
    const statuses = ["Preparing", "Out for delivery", "Delivered"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      success: true,
      orderId,
      status: randomStatus,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    };
  },
});

export const tools = {
  selectFood,
  selectNearbyStore,
  getOrderDetails,
  processCardPayments,
};
