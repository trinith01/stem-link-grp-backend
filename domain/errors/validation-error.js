// Custom error for validation failures
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400; // HTTP status code for Bad Request
    this.errors = errors;
  }
}
export default ValidationError;
