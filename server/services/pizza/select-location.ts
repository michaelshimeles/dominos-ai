const { Customer, NearbyStores } = require("dominos");
const { useInternational, canada } = require("dominos/utils/urls.js");
const fs = require("node:fs");
const path = require("path");

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

  const nearbyStores = await new NearbyStores(customer.address);

  try {
    // Create a 'stores' directory if it doesn't exist
    const storesDir = path.join(process.cwd(), "stores");
    if (!fs.existsSync(storesDir)) {
      fs.mkdirSync(storesDir, { recursive: true });
    }

    // Write to stores.json inside the stores directory
    const filePath = path.join(storesDir, "stores.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify(nearbyStores?.["stores"], null, 2)
    );
  } catch (error) {
    console.error("Error writing to file:", error);
    // Continue execution even if file write fails
  }

  return nearbyStores?.["stores"];
}
