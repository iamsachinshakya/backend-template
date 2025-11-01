import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { ServiceProvider } from "../../../ServiceProvider.js";

export class UserController {
  async getAll(req, res) {
    const users = await ServiceProvider.userService.getAllUsers();
    return ApiResponse.success(res, "Users fetched successfully", users);
  }

  async getById(req, res) {
    const user = await ServiceProvider.userService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched successfully", user);
  }

  async getCurrentUser(req, res) {
    return ApiResponse.success(res, "User fetched successfully", req.user);
  }

  async updateAccountDetails(req, res) {
    const user = await ServiceProvider.userService.updateAccountDetails(
      req.user.id,
      req.body
    );
    return ApiResponse.success(
      res,
      "Account details updated successfully",
      user
    );
  }

  async updateAvatar(req, res) {
    const user = await ServiceProvider.userService.updateAvatar(
      req.user.id,
      req.file
    );
    return ApiResponse.success(res, "Avatar updated successfully", user);
  }

  async updateCoverImage(req, res) {
    const user = await ServiceProvider.userService.updateCoverImage(
      req.user.id,
      req.file
    );
    return ApiResponse.success(res, "Cover image updated successfully", user);
  }

  async delete(req, res) {
    await ServiceProvider.userService.deleteUser(req.params.id);
    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }

  async getUserChannelProfile(req, res) {
    const channel = await ServiceProvider.userService.getUserChannelProfile(
      req.params.username,
      req.user?.id
    );
    return ApiResponse.success(
      res,
      "User channel data fetched successfully",
      channel
    );
  }

  async getWatchHistory(req, res) {
    const history = await ServiceProvider.userService.getWatchHistory(
      req.user._id
    );
    return ApiResponse.success(
      res,
      "Watch history data fetched successfully",
      history
    );
  }
}
