const { Customer, NearbyStores } = require("dominos");
const { useInternational, canada } = require("dominos/utils/urls.js");

useInternational(canada);

export default async function selectLocation({ customerInfo }: any) {
  const customer = new Customer({
    address: customerInfo.address,
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    phone: customerInfo.phone,
    email: customerInfo.email,
    unitNumber: customerInfo.unitNumber,
    unitType: customerInfo.unitType,
  });

  console.log("customer", customer);

  const nearbyStores = await new NearbyStores(customer.address);
  console.log("Nearby Stores:", nearbyStores?.["stores"]?.[0]?.["StoreID"]);

  return nearbyStores?.["stores"]?.[0]?.["StoreID"];
}
