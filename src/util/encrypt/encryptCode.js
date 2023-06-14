const crypto = require("crypto");

const encryptCode = (code) => {
  const hash = crypto
    .createHmac("sha256", process.env.FORGET_PASSWORD_SECRET)
    .update(code)
    .digest("hex");
  return hash;
};

module.exports = encryptCode;
