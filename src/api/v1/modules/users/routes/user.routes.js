import express from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { ControllerProvider } from "../../../controllerProvider.js";
import { fileUploader } from "../../../common/middlewares/multer.middleware.js";

const router = express.Router();
const userController = ControllerProvider.userController;

router
  .route("/")
  .get(asyncHandler(userController.getAll.bind(userController)))
  .post(
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
    asyncHandler(userController.create.bind(userController))
  );

router
  .route("/:id")
  .get(asyncHandler(userController.getById.bind(userController)))
  .patch(asyncHandler(userController.update.bind(userController)))
  .delete(asyncHandler(userController.delete.bind(userController)));

export const userRouter = router;
