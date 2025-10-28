import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { AppError } from "../../../common/utils/AppError.js";
import { User } from "../models/user.model.js";

export class UserController {
  // ✅ Create user
  async create(req, res) {
    const user = await User.create(req.body);
    return ApiResponse.success(res, "User created successfully", user, 201);
  }

  // ✅ Get all users
  async getAll(req, res) {
    const users = await User.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, "Users fetched successfully", users);
  }

  // ✅ Get user by ID
  async getById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    return ApiResponse.success(res, "User fetched successfully", user);
  }

  // ✅ Update user
  async update(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError("User not found", 404);

    return ApiResponse.success(res, "User updated successfully", user);
  }

  // ✅ Delete user
  async delete(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }
}
