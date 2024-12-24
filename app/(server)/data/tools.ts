"server-only";
import { tool as createTool } from "ai";
import { z } from "zod";
import { orderPizza } from "./pizza";

export const order = createTool({
  description: "Order a pizza",
  parameters: z.object({
    action: z.enum(["initiate", "complete"]),
    customerInfo: z.object({
      address: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      email: z.string(),
      unitNumber: z.string(),
      unitType: z.string(),
    }),
    cardInfo: z.object({
      number: z.string(),
      expiration: z.string(),
      securityCode: z.string(),
      postalCode: z.string(),
    }),
  }),
  execute: async ({ action, customerInfo, cardInfo }) => {
    if (action === "initiate") {
      return {
        status: "awaiting_payment",
        message: "Payment form displayed",
      };
    } else {
      const info = orderPizza(customerInfo, cardInfo);
      return {
        status: "success",
        message: "Order processed",
        info,
      };
    }
  },
});

// export const order = createTool({
//   description: "Display payment form for pizza order. Use this when ready to collect payment.",
//   parameters: z.object({}), // Empty object since we'll collect parameters via form
//   execute: async () => {
//     return {
//       displayForm: true,
//       message: "Payment form displayed"
//     };
//   },
// });

export const tools = {
  order,
};
