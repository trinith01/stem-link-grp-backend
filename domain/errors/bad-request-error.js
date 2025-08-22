// Custom error for malformed requests
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400; // HTTP status code for Bad Request
  }
}
export default BadRequestError;