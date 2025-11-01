import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    // Handle cases: single file (req.file), multiple files (req.files), or plain JSON body
    if (req.file) {
      schema.parse({ file: req.file, body: req.body });
    } else if (req.files) {
      schema.parse({ files: req.files, body: req.body });
    } else {
      schema.parse(req.body);
    }

    next();
  } catch (err) {
    const message =
      err.errors?.[0]?.message || err.message || "Invalid request data";
    next(new ApiError(message, 400));
  }
};
