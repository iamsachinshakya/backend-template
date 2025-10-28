/**
 * A standard API response helper for consistent response structure.
 */

export class ApiResponse {
  constructor(success, message, data = null, statusCode = 200, meta = null) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  static success(
    res,
    message = "Success",
    data = null,
    statusCode = 200,
    meta = null
  ) {
    const response = new ApiResponse(true, message, data, statusCode, meta);
    return res.status(statusCode).json(response);
  }

  static error(res, message = "Error", statusCode = 500, errors = null) {
    const response = new ApiResponse(false, message, null, statusCode);
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }
}
