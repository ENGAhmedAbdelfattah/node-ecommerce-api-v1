const bcrypt = require("bcrypt");

const encryptPass = (schema) => {
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
};
module.exports = encryptPass;
