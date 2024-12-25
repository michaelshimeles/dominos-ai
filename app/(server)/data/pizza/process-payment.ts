const {
  Payment,
} = require("dominos");

export async function processPayment(order: any, paymentDetails: any) {
  try {
    const myCard = new Payment(paymentDetails); // Use actual payment details from the user
    order.payments.push(myCard);

    // Attempt to place the order
    await order.place();

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
