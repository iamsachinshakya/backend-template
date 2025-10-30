import { NODE_ENV } from "../../../../app/config/env.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  // Handle custom ApiError
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Fallback for unexpected/unhandled errors
  return ApiResponse.error(
    res,
    "Something went wrong! Please try again later.",
    500,
    NODE_ENV === "development" ? err.stack : undefined
  );
};
