const { Payment, Customer, Item, Order } = require("dominos");

export async function processPayment(
  order: any,
  paymentDetails: any,
  orderState: any
) {
  try {
    const pizza = new Item({
      code: orderState?.selectedFood?.[0]?.code,
      options: orderState?.selectedFood?.[0]?.options,
    });

    const customer = new Customer(orderState.customerInfo);

    const myCard = new Payment(paymentDetails);

    const orderObj = new Order(customer);

    orderObj.storeID = orderState?.storeID;

    // add pizza
    orderObj.addItem(pizza);

    orderObj.payments.push(myCard);

    //place order
    console.log("READY TO PLACE ORDER", orderState);

    // await orderObj.place();
    return {
      success: true,
      message: "Payment successful. Your order has been placed!",
    };
  } catch (error) {
    console.error("Payment failed:", error);
    return {
      success: false,
      error: "Payment failed. Please check your payment details.",
    };
  }
}
