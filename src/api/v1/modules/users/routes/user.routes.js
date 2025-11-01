import express from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { authenticateJWT } from "../../../common/middlewares/auth.middleware.js";
import { ControllerProvider } from "../../../ControllerProvider.js";

const router = express.Router();
const userController = ControllerProvider.userController;

router
  .route("/")
  .get(
    authenticateJWT,
    asyncHandler(userController.getAll.bind(userController))
  );

router
  .route("/:id")
  .get(asyncHandler(userController.getById.bind(userController)))
  .patch(asyncHandler(userController.update.bind(userController)))
  .delete(asyncHandler(userController.delete.bind(userController)));

export const userRouter = router;
