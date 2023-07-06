const { join } = require("path");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// can make proplem with app.use(session({})) becuase it have cookie-parser
require("dotenv").config({
  path: join(__dirname, "./../.env"),
});

const connectDB = require("./dataBase");

const app = express();

// Enable other all domains to access your application
// app.use(cors());
// The error message you received indicates that the server is responding with a wildcard (*) value for the Access-Control-Allow-Origin header, which is not allowed when the request's credentials mode is set to 'include'.

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// app.options("*", cors());
// compress all responses
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
connectDB(process.env.DB_URL);

// Parsing
app.use(express.urlencoded({ extended: false }));
// to put form-data in req.body but failt for req.file and images
// expressBusboy.extend(app);
// app.use(express.urlencoded({ extended: true }));
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
// 1- store cookies in collection in db with id
// 2- store this id in cookies in browser automatically
// 3- use for create protect layer (authenticated layer) by session
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "usersessions",
});
app.use(
  session({
    secret: process.env.COOKIES_SECRET,
    // name: "cookieName",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.JWT_EXPIRATION_TIME_MS, 10),
      secure: process.env.NODE_ENV === "production" ? true : false,
      // domain:
      //   process.env.NODE_ENV === "production"
      //     ? "https://e-commerce-v1-885b.onrender.com"
      //     : "http://localhost:3000",
      // path:,
      httpOnly: true,
      // sameSite: true,
    },
    store,
  })
);

// // Generate a CSRF token
// const tokens = new Tokens()

// const clientSecret = tokens.secretSync();
// const token = tokens.create(clientSecret); // send to put in input in html in forntend

// const serverSecret = await tokens.secret(); // in backend
// if (!serverSecret) {
//   //lablablab
// }

// if (!tokens.verify(serverSecret, token)) {
//   throw new Error("invalid token!");
// }

/* End security*/

app.use("/assets", express.static(join(__dirname, "./../src/uploads")));
app.set("views", join(__dirname, "../src/views/"));
// app.set("view engine", "pug");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

module.exports = app;

// Enable other one domain only to access your application
// const corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// // creat webhook-checkout
// app.post(
//   "/webhook-checkout",
//   express.raw({ type: "application/json" }),
//   webhookCheckout
// );
