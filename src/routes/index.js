const express = require("express");

const categoriesRouter = require("./categories_R");
const subCategoriesRouter = require("./subCategories_R");
const subBrandsRouter = require("./brands_R");
const productsRouter = require("./products_R");
const usersRouter = require("./users_R");
const authRouter = require("./auth_R");
const reviewsRouter = require("./reviews_R");
const wishlistRouter = require("./wishlist_R");
const addressesRouter = require("./addresses_R");
const couponsRouter = require("./coupons_R");
const cartsRouter = require("./carts_R");
const ordersRouter = require("./orders_R");

const apiRouter = express.Router();

const mountRouters = (app) => {
  apiRouter.use("/categories", categoriesRouter);
  apiRouter.use("/subcategories", subCategoriesRouter);
  apiRouter.use("/brands", subBrandsRouter);
  apiRouter.use("/products", productsRouter);
  apiRouter.use("/users", usersRouter);
  apiRouter.use("/auth", authRouter);
  apiRouter.use("/reviews", reviewsRouter);
  apiRouter.use("/wishlist", wishlistRouter);
  apiRouter.use("/addresses", addressesRouter);
  apiRouter.use("/coupons", couponsRouter);
  apiRouter.use("/cart", cartsRouter);
  apiRouter.use("/orders", ordersRouter);

  app.use("/api/v1", apiRouter);
};

module.exports = mountRouters;
