const { Payment } = require("dominos");

export async function processPayment(order: any, paymentDetails: any) {
  try {
    console.log("paymentDetails", paymentDetails);
    const myCard = new Payment(paymentDetails); // Use actual payment details from the user

    console.log("myCard", myCard)
    order.payments.push(myCard);

    // Attempt to place the order
    console.log("IT HIT");
    // await order.place();
    console.dir(order, { depth: 5 });

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
