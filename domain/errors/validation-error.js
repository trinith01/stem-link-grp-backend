// Custom error for validation failures
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400; // HTTP status code for Bad Request
  }
}

export default ValidationError;