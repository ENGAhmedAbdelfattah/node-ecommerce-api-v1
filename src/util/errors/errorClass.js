/**
 * @desc The class ApiError is responsible about operation errors (errors that I can pretict)
 *  */
class ApiError extends Error {
  #statusCode;

  #isOperation;

  constructor(message, statusCode) {
    super(message);
    this.#statusCode = statusCode;
    this.#isOperation = true;
  }

  get getStatusCode() {
    return this.#statusCode;
  }

  get getStatus() {
    return this.#statusCode.toString().startsWith(4) ? "fail" : "error";
  }

  get getIsOperation() {
    return this.#isOperation;
  }
}

module.exports = ApiError;



// getErrInfo;
// const ApiError = require("./errorClass");

// const getErrInfo = (message, statusCode) => {
//   const err = new ApiError(message, statusCode);
//   const errInfo = {
//     message: err.message,
//     statusCode: err.getStatusCode,
//     status: err.getStatus,
//     isOperation: err.getIsOperation,
//     stack: err.stack,
//   };
//   return errInfo;
// };

// module.exports = getErrInfo;
