/**
 * Wraps an async route handler and forwards errors to Express error middleware.
 * @param {Function} fn - The async function (req, res, next) to handle.
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
