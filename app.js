const app = require("./config/server");

const allRouter = require("./src/routes/all_R");
const globalErrorMiddleware = require("./src/middleware/globalError_MW");
const mountRouters = require("./src/routes");

mountRouters(app);

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
