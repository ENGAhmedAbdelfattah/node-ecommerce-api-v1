const createErrForDev = (err) => ({
  message: err.message,
  error: err,
  statusCode: err.getStatusCode,
  status: err.getStatus,
  isOperation: err.getIsOperation,
  stack: err.stack,
});

const createErrForProd = (err) => ({
  message: err.message,
  statusCode: err.getStatusCode,
});

const handleJwtInvalidSignature = () => ({
  message: `Invalid token, please login again`,
  statusCode: 401,
});

const handleJwtExpired = () => ({
  message: `Expired token, please login again`,
  statusCode: 401,
});
// _____________________________________________________________________________________
const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.getStatusCode || 500;
  err.status = err.getStatus || "error";

  let errObj = null;
  if (err.name === "JsonWebTokenError") {
    errObj = handleJwtInvalidSignature();
  } else if (err.name === "TokenExpiredError") {
    errObj = handleJwtExpired();
  } else {
    errObj = createErrForProd(err);
  }

  if (process.env.NODE_ENV === "development") {
    errObj = createErrForDev(err);
  }

  res.status(err.statusCode).json(errObj);
};

module.exports = globalErrorMiddleware;