const { Tracking } = require("dominos");

export default async function TrackOrder(phoneNumber: string) {
  const tracking = new Tracking();

  const trackingResult = await tracking.byPhone(phoneNumber);

  console.dir(trackingResult, { depth: 1 });

  console.log("Order is valid.", trackingResult);

  return trackingResult
}
