import BadRequestError from "../domain/errors/bad-request-error.js";
import ConflictError from "../domain/errors/conflict-error.js";
import ForbiddenError from "../domain/errors/forbidden-error.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import UnauthorizedError from "../domain/errors/unauthorized-error.js";
import ValidationError from "../domain/errors/validation-error.js";

// Centralized error handling middleware
const globalErrorHandlingMiddleware = (error, req, res, next) => {
  console.log(error); // Log error for debugging
  if (error instanceof NotFoundError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof UnauthorizedError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof BadRequestError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof ForbiddenError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof ConflictError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    // Handle unexpected errors
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default globalErrorHandlingMiddleware;
