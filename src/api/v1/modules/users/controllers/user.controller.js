import { ApiError } from "../../../common/utils/ApiError.js";
import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { RepositoryProvider } from "../../../RepositoryProvider.js";
import { ServiceProvider } from "../../../ServiceProvider.js";
import { secureCookieOptions } from "../../auth/utils/auth.util.js";

export class UserController {
  // ✅ Create User
  async register(req, res) {
    const user = await ServiceProvider.authService.registerUser(
      req.body,
      req.files
    );

    return ApiResponse.success(res, "User registered successfully", user, 201);
  }

  async login(req, res) {
    const { user, accessToken, refreshToken } =
      await ServiceProvider.authService.loginUser(req.body);

    res
      .cookie("accessToken", accessToken, secureCookieOptions)
      .cookie("refreshToken", refreshToken, secureCookieOptions);

    return ApiResponse.success(res, "User logged in successfully", {
      user,
      accessToken,
      refreshToken,
    });
  }

  async logout(req, res) {
    await ServiceProvider.authService.logoutUser(req.user.id);

    res
      .clearCookie("accessToken", secureCookieOptions)
      .clearCookie("refreshToken", secureCookieOptions);

    return ApiResponse.success(res, "User logged out successfully");
  }

  async refreshAccessToken(req, res) {
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError("Unauthorized request", 401);
    }

    const { accessToken, refreshToken } =
      await ServiceProvider.authService.refreshAccessToken(
        incomingRefreshToken
      );

    res
      .cookie("accessToken", accessToken, secureCookieOptions)
      .cookie("refreshToken", refreshToken, secureCookieOptions);

    return ApiResponse.success(res, "Access token refreshed successfully", {
      accessToken,
      refreshToken,
    });
  }

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
