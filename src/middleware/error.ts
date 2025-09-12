import BaseCustomError from "./../error/base-error";
import { MongoDuplicateKeyError } from "./../error/mongo-error";
import { StatusCode } from "./../utils/status-code";
import { ErrorRequestHandler } from "express";
// import BaseCustomError from "../Error/base-error";
// import { StatusCode } from "../util/consts";
// import { MongoDuplicateKeyError } from "../Error/mongo-error";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseCustomError) {
    res.status(err.getStatusCode()).json(err.serializeErrorOutput());
    return;
  }

  // Handle MongoDB duplicate key error
  if (err.name === "MongoServerError") {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const mongoError = new MongoDuplicateKeyError(field, value);
    res
      .status(mongoError.getStatusCode())
      .json(mongoError.serializeErrorOutput());
    return;
  }

  // Default to internal server error
  res.status(StatusCode.InternalServerError).json({
    errors: [{ message: err.message || `Something went wrong ${err}` }],
  });
};

export default errorHandler;