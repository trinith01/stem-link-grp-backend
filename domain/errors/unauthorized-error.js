// Custom error for unauthorized access attempts
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401; // HTTP status code for Unauthorized
  }
}

export default UnauthorizedError;