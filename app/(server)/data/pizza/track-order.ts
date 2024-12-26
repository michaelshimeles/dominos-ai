const { Tracking } = require("dominos");

export default async function trackOrder(customer: any) {
  const tracking = new Tracking();

  const trackingResult = await tracking.byPhone(customer.phone);

  console.dir(trackingResult, { depth: 1 });

  console.log("Order is valid.");
}
