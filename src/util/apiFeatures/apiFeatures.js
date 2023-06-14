class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  paginate(countDocuments) {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.pagination = pagination;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit); // because frist page be 6 item if use skip only
    return this;
  }

  filter() {
    const queryFilter = { ...this.queryString };
    const DeleteArr = ["page", "limit", "sort", "fields", "keyword"];
    DeleteArr.forEach((el) => delete queryFilter[el]);
    //+apply filteration by [gte| gt| lte| lt| ne]
    const queryValues = Object.values(queryFilter)
      .map((query) => Object.keys(query))
      .flat();
    queryValues.forEach((filter) => {
      Object.keys(queryFilter).forEach((query) => {
        if (Number.isNaN(Number(filter)) && queryFilter[query][filter]) {
          queryFilter[query][`$${filter}`] = queryFilter[query][filter];
          delete queryFilter[query][filter];
        }
      });
    });
    this.mongooseQuery = this.mongooseQuery.find(queryFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(
        this.queryString.sort.split(",").join(" ")
      ); // you can use %20 or + in query URL equal space
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.mongooseQuery = this.mongooseQuery.select(
        this.queryString.fields.split(",").join(" ")
      );
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(...keys) {
    if (this.queryString.keyword) {
      const searchQuery = {};
      searchQuery.$or = [];
      keys.forEach((key) => {
        searchQuery.$or.push({
          [`${key}`]: { $regex: this.queryString.keyword, $options: "i" },
        });
      });
      console.log(searchQuery);
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }
}

module.exports = ApiFeatures;

// const queryFilterClone = JSON.parse(
//   JSON.stringify(queryFilter).replace(
//     /\b(gt|gte|lt|lte|ne)\b/g,
//     (match) => `$${match}`
//   )
// );

// find({ name: new RegExp(x, 'i')}})

// make it in mongosse Middleware
// populate(path, select) {
//   this.mongooseQuery = this.mongooseQuery.populate({ path, select });
//   return this;
// }
// ex: .populate({ path: "category", select: "name -_id" });
