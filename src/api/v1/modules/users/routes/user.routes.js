import express from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware.js";
import { ControllerProvider } from "../../../ControllerProvider.js";
import { fileUploader } from "../../../common/middlewares/uploads.middleware.js";
import {
  updateAccountSchema,
  updateAvatarSchema,
  updateCoverImageSchema,
} from "../validations/user.validation.js";
import { validate } from "../../../common/middlewares/validate.middleware.js";

const router = express.Router();
const { userController } = ControllerProvider;

// Base URL: /api/v1/users

// Get all users
router.get(
  "/",
  authenticateJWT,
  asyncHandler(userController.getAll.bind(userController))
);

// Get logged-in user
router.get(
  "/current-user",
  authenticateJWT,
  asyncHandler(userController.getCurrentUser.bind(userController))
);

// Update account details (PATCH)
router.patch(
  "/update-account",
  authenticateJWT,
  validate(updateAccountSchema),
  asyncHandler(userController.updateAccountDetails.bind(userController))
);

// Update avatar
router.patch(
  "/avatar",
  authenticateJWT,
  fileUploader.single("avatar"),
  validate(updateAvatarSchema),
  asyncHandler(userController.updateAvatar.bind(userController))
);

// Update cover image
router.patch(
  "/cover-image",
  authenticateJWT,
  fileUploader.single("coverImage"),
  validate(updateCoverImageSchema),
  asyncHandler(userController.updateCoverImage.bind(userController))
);

// Get user by ID / Delete user
router
  .route("/:id")
  .get(
    authenticateJWT,
    asyncHandler(userController.getById.bind(userController))
  )
  .delete(
    authenticateJWT,
    asyncHandler(userController.delete.bind(userController))
  );

// Get user channel profile by username
router.get(
  "/c/:username",
  authenticateJWT,
  asyncHandler(userController.getUserChannelProfile.bind(userController))
);

// Get watch history
router.get(
  "/history",
  authenticateJWT,
  asyncHandler(userController.getWatchHistory.bind(userController))
);

export const userRouter = router;
