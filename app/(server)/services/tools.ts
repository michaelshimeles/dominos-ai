"server-only";
import { tool as createTool } from "ai";
import { z } from "zod";
import { orderDetails } from "./pizza/order-details";
import selectLocation from "./pizza/select-location";
import { selectPizza } from "./pizza/select-pizza";
import TrackOrder from "./pizza/track-order";

// State interface
interface OrderState {
  selectedFood?: any;
  address?: any;
  payment?: any;
  customerInfo?: any;
  orderObject?: any;
}

let orderState: OrderState = {};

const displayFood = createTool({
  description:
    "Share what available pizza's exist using PizzaCard, please do not render the images of pizza in the chat messages, make sure you get what pizza and how many the user wants",
  parameters: z.object({
    items: z.array(
      z.object({
        name: z.enum([
          "basicCheese",
          "pepperoniExtraCheese",
          "hawaiian",
          "supreme",
          "mikeSpecial",
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
  description: `Find the 2 nearest pizza location to order from
    and let user select the store they are going to order from`,
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
      const stores = await selectLocation({ customerInfo });

      orderState.address = stores?.[0]?.["StoreID"];
      orderState.customerInfo = customerInfo;
      return {
        success: true,
        result: {
          address: customerInfo.address,
          storeInfo: stores,
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

const renderOrderDetailsAndPaymentCard = createTool({
  description: "Share the order details and the payment card component",
  parameters: z.object({}),
  execute: async () => {
    console.log("orderState.customerInfo", orderState.customerInfo);
    console.log("orderState.selectedFood", orderState.selectedFood);
    console.log("orderState.address", orderState.address);
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

const trackOrder = createTool({
  description: "Track the status of the users order",
  parameters: z.object({
    phoneNumber: z.string(),
  }),
  execute: async ({ phoneNumber }) => {
    console.log("phoneNumber", phoneNumber);
    try {
      const response = await TrackOrder(phoneNumber!);

      console.log("response", response);
      return {
        response,
        success: true,
      };
    } catch (error) {
      return {
        error,
        success: false,
      };
    }
  },
});

export const tools = {
  displayFood,
  selectNearbyStore,
  renderOrderDetailsAndPaymentCard,
  trackOrder,
};
