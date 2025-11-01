import express from "express";
import { ControllerProvider } from "../../../ControllerProvider.js";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware.js";
import { fileUploader } from "../../../common/middlewares/uploads.middleware.js";
import { cleanupUploads } from "../../../common/middlewares/cleanupUploads.middleware.js";

const router = express.Router();
const authController = ControllerProvider.authController;

router.route("/register").post(
  fileUploader.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  asyncHandler(asyncHandler(authController.register.bind(authController))),
  cleanupUploads
);
router
  .route("/login")
  .post(asyncHandler(authController.login.bind(authController)));
router
  .route("/refresh-token")
  .post(asyncHandler(authController.refreshAccessToken.bind(authController)));

//secured routes
router
  .route("/logout")
  .post(
    authenticateJWT,
    asyncHandler(authController.logout.bind(authController))
  );

export const authRouter = router;
