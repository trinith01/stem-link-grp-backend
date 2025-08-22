// Custom error for duplicate keys or resource state conflicts
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409; // HTTP status code for Conflict Error
  }
}
export default ConflictError;