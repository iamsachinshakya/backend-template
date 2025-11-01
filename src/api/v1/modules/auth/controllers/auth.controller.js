import { ApiError } from "../../../common/utils/ApiError.js";
import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { ServiceProvider } from "../../../ServiceProvider.js";
import { secureCookieOptions } from "../utils/auth.util.js";

export class AuthController {
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

  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    await ServiceProvider.authService.changeUserPassword({
      oldPassword,
      newPassword,
      userId: req.user?._id,
    });

    return ApiResponse.success(res, "Password changed successfully");
  }

  // const getCurrentUser = asyncHandler(async(req, res) => {
  //     return res
  //     .status(200)
  //     .json(new ApiResponse(
  //         200,
  //         req.user,
  //         "User fetched successfully"
  //     ))
  // })
}
