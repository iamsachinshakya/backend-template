import express from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler.js";
import { RepoProvider } from "../../../RepoProvider.js";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(RepoProvider.userProvider.getAll))
  .post(asyncHandler(RepoProvider.userProvider.create));
router
  .route("/:id")
  .get(asyncHandler(RepoProvider.userProvider.getById))
  .patch(asyncHandler(RepoProvider.userProvider.update))
  .delete(asyncHandler(RepoProvider.userProvider.delete));

export const userRouter = router;
