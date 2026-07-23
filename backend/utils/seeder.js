// BACKEND/utils/seeder.js

const path = require("path");
const Fooditem = require("../models/foodItem");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const fooditems = require("../data/foodItem.json");
const restaurantsData = require("../data/restaurants.json");

// Setting dotenv file
dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const seedDatabase = async () => {
  try {
    await connectDatabase();
    await Fooditem.deleteMany();
    await Restaurant.deleteMany();
    await Menu.deleteMany();

    console.log("Old food items, restaurants, and menus removed.");

    const createdRestaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`${createdRestaurants.length} restaurants added.`);

    const createdFoodItems = await Fooditem.insertMany(
      fooditems.map((item, index) => ({
        ...item,
        restaurant: createdRestaurants[index % createdRestaurants.length]._id,
      }))
    );
    console.log(`${createdFoodItems.length} food items added.`);

    const menuBuckets = createdRestaurants.map((restaurant) => {
      const restaurantItems = createdFoodItems.filter(
        (item) => item.restaurant.toString() === restaurant._id.toString()
      );

      return {
        restaurant: restaurant._id,
        menu: [
          {
            category: "Featured",
            items: restaurantItems.slice(0, 4).map((item) => item._id),
          },
          {
            category: "Bestsellers",
            items: restaurantItems.slice(4, 8).map((item) => item._id),
          },
          {
            category: "Desserts",
            items: restaurantItems.slice(8, 10).map((item) => item._id),
          },
        ],
      };
    });

    await Menu.insertMany(menuBuckets);
    console.log("Menus created for each restaurant.");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedDatabase();
