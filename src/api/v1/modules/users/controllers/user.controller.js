import { ApiError } from "../../../common/utils/ApiError.js";
import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { RepositoryProvider } from "../../../RepositoryProvider.js";
export class UserController {
  // ✅ Get all users
  async getAll(req, res) {
    const users = await RepositoryProvider.userRepository.findAll();
    return ApiResponse.success(res, "Users fetched successfully", users);
  }

  // ✅ Get user by ID
  async getById(req, res) {
    const user = await RepositoryProvider.userRepository.findById(
      req.params.id
    );
    if (!user) throw new ApiError("User not found", 404);

    return ApiResponse.success(res, "User fetched successfully", user);
  }

  // ✅ Update user
  async update(req, res) {
    const user = await RepositoryProvider.userRepository.update(
      req.params.id,
      req.body
    );
    if (!user) throw new ApiError("User not found", 404);

    return ApiResponse.success(res, "User updated successfully", user);
  }

  // ✅ Delete user
  async delete(req, res) {
    const user = await RepositoryProvider.userRepository.delete(req.params.id);
    if (!user) throw new ApiError("User not found", 404);

    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }
}
