// Custom error for not allowed cases
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403; // HTTP status code for Forbidden Error
  }
}
export default ForbiddenError;