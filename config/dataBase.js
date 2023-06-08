const mongoose = require("mongoose");

async function connectDB(mongoURL) {
  const connectionDB = await mongoose.connect(mongoURL);
  console.log(`MONGODB_IS_CONNECTED :${connectionDB.connection.host}`);
}
module.exports = connectDB;
