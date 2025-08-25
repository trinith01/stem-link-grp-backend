import UnauthorizedError from "../domain/errors/unauthorized-error.js";

// Custom authentication middleware using Clerk
const isAuthenticated = (req, res, next) => {
  console.log("IS_AUTHENTICATED", req.auth().isAuthenticated);
  if (!req.auth().isAuthenticated) {
    // Throw error if user is not authenticated
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

// Helper to get user's Clerk userId from request
const getCurrentUserId = (req) => {
  return req.auth().userId;
};

export { isAuthenticated, getCurrentUserId };