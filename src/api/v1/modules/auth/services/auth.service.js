import { RepositoryProvider } from "../../../RepositoryProvider.js";
import { ApiError } from "../../../common/utils/ApiError.js";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.util.js";
import { REFRESH_TOKEN_SECRET } from "../../../../../app/config/env.js";

export class AuthService {
  // Register user
  async registerUser(data, files) {
    const { fullName, email, username, password } = data;

    if ([fullName, email, username, password].some((f) => !f?.trim())) {
      throw new ApiError("All fields are required", 400);
    }

    const existingUser =
      await RepositoryProvider.userRepository.findByEmailUsername({
        email,
        username,
      });
    if (existingUser) {
      throw new ApiError(
        "User with this email or username already exists",
        409
      );
    }

    const avatarLocalPath = files?.avatar?.[0]?.path;
    const coverImageLocalPath = files?.coverImage?.[0]?.path || null;

    if (!avatarLocalPath) throw new ApiError("Avatar file is required", 400);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
      ? await uploadOnCloudinary(coverImageLocalPath)
      : null;

    if (!avatar?.url) throw new ApiError("Failed to upload avatar", 400);

    const hashedPassword = await hashPassword(password);

    const user = await RepositoryProvider.userRepository.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    return RepositoryProvider.userRepository.findByIdExcludeFields(
      user.id,
      "-password -refreshToken"
    );
  }

  // Generate tokens
  async generateAccessAndRefreshTokens(userId) {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 401);

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    });

    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await RepositoryProvider.userRepository.save(user, {
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  }

  // Login user
  async loginUser({ email, password }) {
    if (!email?.trim() || !password?.trim()) {
      throw new ApiError("Email and password are required", 400);
    }

    const user = await RepositoryProvider.userRepository.findByEmail(email);
    if (!user) throw new ApiError("User not found", 404);

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new ApiError("Invalid credentials", 401);

    const tokens = await this.generateAccessAndRefreshTokens(user._id);

    const safeUser =
      await RepositoryProvider.userRepository.findByIdExcludeFields(
        user._id,
        "-password -refreshToken"
      );

    return { user: safeUser, ...tokens };
  }

  // Logout user
  async logoutUser(userId) {
    if (!userId) throw new ApiError("User ID is required", 400);
    return await RepositoryProvider.userRepository.removeRefreshTokenById(
      userId
    );
  }

  // Refresh access token
  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError("Unauthorized request", 401);
    }

    const decoded = verifyToken(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    const user = await RepositoryProvider.userRepository.findById(decoded?.id);

    if (!user) throw new ApiError("Invalid refresh token", 401);
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError("Refresh token expired or already used", 401);
    }

    const tokens = await this.generateAccessAndRefreshTokens(user._id);
    return tokens;
  }

  // Change user password
  async changeUserPassword({ oldPassword, newPassword, userId }) {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found!", 404);

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) throw new ApiError("Invalid credentials", 401);

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await RepositoryProvider.userRepository.save(user, {
      validateBeforeSave: false,
    });
  }
}
