const fs = require("fs");
require("colors");
require("dotenv").config({ path: "../../../.env" });
const connectDB = require("../../../config/dataBase");
const ProductsModel = require("../../models/products_M");

// connect to DB
connectDB(process.env.DB_URL);
// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));
// Insert data into DB
const insertData = async () => {
  try {
    await ProductsModel.create(products);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductsModel.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i" || process.argv[2] === "--insert") {
  insertData();
} else if (process.argv[2] === "-d" || process.argv[2] === "--delete") {
  destroyData();
}
