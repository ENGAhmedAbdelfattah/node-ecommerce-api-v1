const app = require("./config/server");
const categoriesRouter = require("./src/routes/categories_R");
const subCategoriesRouter = require("./src/routes/subCategories_R");
const subBrandsRouter = require("./src/routes/brands_R");
const productsRouter = require("./src/routes/products_R");
const usersRouter = require("./src/routes/users_R");
const authRouter = require("./src/routes/auth_R");

const allRouter = require("./src/routes/all_R");
const globalErrorMiddleware = require("./src/middleware/globalError_MW");

app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/subcategories", subCategoriesRouter);
app.use("/api/v1/brands", subBrandsRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);

app.use("*", allRouter);
app.use(globalErrorMiddleware);

const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Server is up and running on port : ${port}`)
);

process.on("uncaughtException", (err) => {
  console.log(`uncaught Exception Error ${err.name} ${err.message}`);
  server.close(() => {
    console.error(`shutting down....`);
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(
    `unhandledRejection Promise Error -- ${err.name} -- ${err.message}`
  );
  server.close(() => {
    console.error(`shutting down....`);
    process.exit(1);
  });
});
