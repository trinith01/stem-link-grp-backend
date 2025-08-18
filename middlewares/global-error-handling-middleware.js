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
  } else {
    // Handle unexpected errors
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default globalErrorHandlingMiddleware;
