const {
  Customer,
  NearbyStores,
  Order,
  Item,
  Payment,
  Tracking,
} = require("dominos");

interface PizzaOptions {
  code: string;
  options?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  imageUrl: string;
  description: string;
}

export async function selectPizza(items: any) {
  const basicCheese: PizzaOptions = {
    code: "14SCREEN",
    options: {
      X: { "1/1": "1" }, // Normal sauce
      C: { "1/1": "1" }, // Normal cheese
    },
    imageUrl:
      "https://utfs.io/f/MD2AM9SEY8GuBux3XEakxMSiqFhG9jDJ1pTnAyrs7dLzNfbR",
    description:
      "Classic and simple, just cheese on a delicious crust. Perfect for cheese lovers!",
  };

  // Pepperoni pizza with extra cheese
  const pepperoniExtraCheese: PizzaOptions = {
    code: "14SCREEN",
    options: {
      X: { "1/1": "1" }, // Normal sauce
      C: { "1/1": "1.5" }, // Extra cheese
      P: { "1/1": "1" }, // Normal pepperoni
    },
    imageUrl:
      "https://utfs.io/f/MD2AM9SEY8GuiIVGtAZhtDiOImje5H1afukBxNP97Sg8yhGZ",
    description:
      "A step up from the basic, with loads of pepperoni and extra cheese. It's a fan favorite!",
  };

  // Hawaiian pizza
  const hawaiian: PizzaOptions = {
    code: "14SCREEN",
    options: {
      X: { "1/1": "1" }, // Normal sauce
      C: { "1/1": "1" }, // Normal cheese
      H: { "1/1": "1" }, // Ham
      N: { "1/1": "1" }, // Pineapple
    },
    imageUrl:
      "https://utfs.io/f/MD2AM9SEY8Gunz9Y87OEckiM8Fp203uOvNCTDytGXS1aJZod",
    description:
      "If you're into the sweet and savory combo, this one's for you. It's got ham and pineapple on it.",
  };

  // Supreme pizza
  const supreme: PizzaOptions = {
    code: "14SCREEN",
    options: {
      X: { "1/1": "1" }, // Normal sauce
      C: { "1/1": "1" }, // Normal cheese
      P: { "1/1": "1" }, // Pepperoni
      S: { "1/1": "1" }, // Sausage
      M: { "1/1": "1" }, // Mushrooms
      O: { "1/1": "1" }, // Onions
      G: { "1/1": "1" }, // Green Peppers
    },
    imageUrl:
      "https://utfs.io/f/MD2AM9SEY8GuUb9wzscy1EAvBgi8ZhTnmtPFsYIb4cQ2SuRH",
    description:
      "This one's got it all! Pepperoni, sausage, veggies, and more. It's a full-on flavor explosion.",
  };

  const itemsOrder = items.map((item: any) => {
    console.log("item", item);
    return {
      code: item?.size,
      options:
        item?.name === "supreme"
          ? supreme.options
          : item?.name === "hawaiian"
          ? hawaiian.options
          : item?.name === "basicCheese"
          ? basicCheese.options
          : pepperoniExtraCheese.options,
      name:
        item?.name === "supreme"
          ? "Supreme"
          : item?.name === "hawaiian"
          ? "Hawaiian"
          : item?.name === "basicCheese"
          ? "Classic Cheese"
          : "Pepperoni Extra Cheese",
      imageUrl:
        item?.name === "supreme"
          ? supreme.imageUrl
          : item?.name === "hawaiian"
          ? hawaiian.imageUrl
          : item?.name === "basicCheese"
          ? basicCheese.imageUrl
          : pepperoniExtraCheese.imageUrl,
      description:
        item?.name === "supreme"
          ? supreme.description
          : item?.name === "hawaiian"
          ? hawaiian.description
          : item?.name === "basicCheese"
          ? basicCheese.description
          : pepperoniExtraCheese.description,
    };
  });

  return itemsOrder;

  // // return new Item(
  // pizza === "supreme"
  //   ? supreme
  //   : pizza === "hawaiian"
  //   ? hawaiian
  //   : pizza === "basicCheese"
  //   ? basicCheese
  //   : pepperoniExtraCheese;
  // // );
}

/**
 * DOMINOS MENU STRUCTURE GUIDE
 *
 * The menu.json file contains several key sections:
 *
 * 1. Categories
 *    - food
 *      - pizza
 *        - subCategories (BuildYourOwn, Artisan, etc.)
 *        - products (lists available pizza codes)
 *
 * 2. Products
 *    Contains detailed info about each menu item including:
 *    - variants (different sizes)
 *    - availableToppings
 *    - defaultToppings
 *    - pricing
 *    Example: "14SCREEN" is a 14" Hand Tossed Pizza
 *
 * 3. Toppings/Options Reference:
 *    X: Sauce           C: Cheese          P: Pepperoni
 *    M: Mushroom        O: Onion          G: Green Peppers
 *    B: Beef           K: Bacon           H: Ham
 *    S: Sausage        N: Pineapple       J: Jalapeños
 *
 * 4. Portion Quantities:
 *    "1/1": "1"    = Normal portion on whole pizza
 *    "1/1": "1.5"  = 1.5x portion (extra)
 *    "1/1": "2"    = Double portion
 *
 * EXAMPLE PIZZA SELECTIONS:
 */

/**
 * AVAILABLE SIZES (change the code):
 * - "10SCREEN": 10" Hand Tossed
 * - "12SCREEN": 12" Hand Tossed
 * - "14SCREEN": 14" Hand Tossed
 * - "16SCREEN": 16" Hand Tossed
 *
 * CRUST OPTIONS:
 * - "SCREEN": Hand Tossed
 * - "THIN": Thin Crust
 * - "P12IPAZA": 12" Pan Pizza
 * - "GLUTENF": Gluten Free (10" only)
 *
 * To find available products and options:
 * 1. Check menuData.menu.categories.food.pizza for available products
 * 2. Look up the product in menuData.menu.products for detailed info
 * 3. Check availableToppings in the product details
 */

/**
 * To enhance this function, you could:
 * 1. Add parameter validation against the menu
 * 2. Create enums/constants for toppings
 * 3. Add size selection
 * 4. Add crust type selection
 * 5. Add topping validation
 * 6. Add specialty pizza selection
 *
 * Example enhanced function signature:
 * selectPizza({
 *   size: "14",
 *   crust: "SCREEN",
 *   toppings: [
 *     { code: "P", portion: 1 },
 *     { code: "C", portion: 1.5 }
 *   ]
 * })
 */
