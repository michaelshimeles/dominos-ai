"server-only";

const {
  Customer,
  NearbyStores,
  Order,
  Item,
  Payment,
  Tracking,
  Menu,
  Image,
} = require("dominos");
const { useInternational, canada } = require("dominos/utils/urls.js");
const fs = require("fs");

export async function orderPizza(
  customerInfo: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    unitNumber: string;
    unitType: string;
  },
  cardInfo: {
    number: string;
    expiration: string;
    securityCode: string;
    postalCode: string;
  }
  // tipAmount: number
) {
  useInternational(canada);

  // Create a customer instance with a Canadian address
  const customer = new Customer(customerInfo);

  console.log("customer", customer);
  const pizza = new Item({
    code: "14SCREEN",
    options: {
      //sauce, whole pizza : normal
      X: { "1/1": "1" },
      //cheese, whole pizza  : double
      C: { "1/1": "1.5" },
    },
  });

  try {
    // Fetch nearby stores
    const nearbyStores = await new NearbyStores(customer.address);
    console.log("Nearby Stores:", nearbyStores?.["stores"]?.[0]?.["StoreID"]);

    const order = new Order(customer);
    order.addItem(pizza);

    const menu = await new Menu(nearbyStores?.["stores"]?.[0]?.["StoreID"]);

    // console.log("menu", JSON.stringify(menu, null, 2));
    fs.writeFileSync("dominos-menu.json", JSON.stringify(menu, null, 2));

    order.storeID = nearbyStores?.["stores"]?.[0]?.["StoreID"];

    try {
      await order.validate();
      await order.price();

      const myCard = new Payment({
        amount: order.amountsBreakdown.customer,
        number: cardInfo.number,
        expiration: cardInfo.expiration,
        securityCode: cardInfo.securityCode,
        postalCode: cardInfo.postalCode,
        tipAmount: 0,
      });

      return order;

      // order.payments.push(myCard);

      //we used a fake credit card
      // await order.place();

      // console.log("\n\nPlaced Order\n\n");
      // console.dir(order, { depth: 3 });

      // const tracking = new Tracking();

      // const trackingResult = await tracking.byPhone(customer.phone);

      // console.dir(trackingResult, { depth: 1 });

      // console.log("Order is valid.");
    } catch (error) {
      console.error("Order validation failed:", error);
      //inspect Order Response to see more information about the
      //failure, unless you added a real card, then you can inspect
      //the order itself
      console.log(
        "\n\nFailed Order Probably Bad Card, here is order.priceResponse the raw response from Dominos\n\n"
      );
      console.dir(order.placeResponse, { depth: 5 });
    }

    return new Response("Check the console for nearby stores!");
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    throw new Error("Error fetching nearby stores");
  }
}
