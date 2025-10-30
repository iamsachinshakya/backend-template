import fs from "fs";

export const cleanupUploads = (err, req, res, next) => {
  // If Multer saved any files and an error occurred later
  if (req.files) {
    Object.values(req.files).forEach((fileArray) => {
      fileArray.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          console.log("🧹 Deleted temp file:", file.path);
        }
      });
    });
  }

  next(err);
};
