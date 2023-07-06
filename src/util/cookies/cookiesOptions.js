const cookiesOptions = {
  maxAge: parseInt(process.env.JWT_EXPIRATION_TIME_MS, 10),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, //in production to accept https only
  // domain:
  //   process.env.NODE_ENV === "production"
  //     ? "https://e-commerce-v1-885b.onrender.com"
  //     : "http://localhost:3000",
};

module.exports = cookiesOptions;
