"server-only";

const { Customer, Order, Item, Menu } = require("dominos");
const { useInternational, canada } = require("dominos/utils/urls.js");

export async function orderDetails(
  customerInfo: any,
  pizzaOrder: any,
  storeId: any
) {
  useInternational(canada);

  const customer = new Customer({
    address: customerInfo.address,
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    phone: customerInfo.phone,
    email: customerInfo.email,
    unitNumber: customerInfo.unitNumber,
    unitType: customerInfo.unitType,
  });

  const orderItem = new Item(pizzaOrder);

  try {
    const order = new Order(customer);
    order.addItem(orderItem);
    const menu = await new Menu(storeId);

    order.storeID = storeId;

    try {
      await order.validate();
      await order.price();

      // Return the amount due to the user
      const totalAmountDue = order.amountsBreakdown.customer; // Adjust key as per API response
      return {
        success: true,
        amountDue: totalAmountDue,
        order,
      };
    } catch (error) {
      console.error("Order validation failed:", error);
      return {
        success: false,
        error: "Order validation failed. Please check your order details.",
      };
    }
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    return {
      success: false,
      error: "Error fetching nearby stores.",
    };
  }
}
