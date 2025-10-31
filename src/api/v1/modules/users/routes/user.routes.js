import express from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { ControllerProvider } from "../../../controllerProvider.js";
import { fileUploader } from "../../../common/middlewares/uploads.middleware.js";
import { cleanupUploads } from "../../../common/middlewares/cleanupUploads.middleware.js";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware.js";

const router = express.Router();
const userController = ControllerProvider.userController;

router
  .route("/")
  .get(
    authenticateJWT,
    asyncHandler(userController.getAll.bind(userController))
  );

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
  asyncHandler(asyncHandler(userController.register.bind(userController))),
  cleanupUploads
);
router
  .route("/login")
  .post(asyncHandler(userController.login.bind(userController)));
router
  .route("/refresh-token")
  .post(asyncHandler(userController.refreshAccessToken.bind(userController)));

//secured routes
router
  .route("/logout")
  .post(
    authenticateJWT,
    asyncHandler(userController.logout.bind(userController))
  );

router
  .route("/:id")
  .get(asyncHandler(userController.getById.bind(userController)))
  .patch(asyncHandler(userController.update.bind(userController)))
  .delete(asyncHandler(userController.delete.bind(userController)));

export const userRouter = router;
