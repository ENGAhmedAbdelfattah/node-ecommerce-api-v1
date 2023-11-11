const { join } = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");

const cookieParser = require("cookie-parser");
require("dotenv").config({
  path: join(__dirname, "./../.env"),
});

const connectDB = require("./dataBase");

const app = express();

// Enable other all domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
connectDB(process.env.DB_URL);

// Parsing
app.use(express.urlencoded({ extended: false }));
// Custom middleware to bypass JSON parsing for specific route
const excludeJsonParsing = (req, res, next) => {
  if (req.path === `/api/v1/orders/webhook-checkout`) {
    // Skip JSON parsing for '/custom-route'
    next();
  } else {
    // Apply JSON parsing for other routes
    express.json({ limit: "20kb" })(req, res, next);
  }
};
// Apply the custom middleware to all routes
app.use(excludeJsonParsing);
app.use(cookieParser());
/* Start security*/
app.use(helmet());
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
app.use(mongoSanitize());
app.use(xss());

/* End security*/

app.use("/assets", express.static(join(__dirname, "./../src/uploads")));
app.set("views", join(__dirname, "../src/views/"));
// app.set("view engine", "pug");

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message:
//     "Too many accounts created from this IP, please try again after an hour",
// });

// Apply the rate limiting middleware to all requests
// app.use("/api", limiter);

module.exports = app;

// Enable other one domain only to access your application
// const corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// // create webhook-checkout
// app.post(
//   "/webhook-checkout",
//   express.raw({ type: "application/json" }),
//   webhookCheckout
// );
