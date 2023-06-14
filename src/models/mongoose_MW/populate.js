const populateMongoose = (schema, path, select) => {
  // Mongoose Middleware
  schema.pre(/^find/, function (next) {
    this.populate({
      path,
      select,
    });
    next();
  });
};

module.exports = populateMongoose;
