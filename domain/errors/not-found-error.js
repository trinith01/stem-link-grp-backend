// Custom error for resource not found scenarios
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404; // HTTP status code for Not Found
  }
}

export default NotFoundError;