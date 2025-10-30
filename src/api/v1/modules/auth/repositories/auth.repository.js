import { RepositoryProvider } from "../../../RepositoryProvider.js";
import { ApiResponse } from "../../../common/utils/apiResponse.js";
import { ApiError } from "../../../common/utils/apiError.js";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.js";

export class AuthRepository {
  // ✅ Register user
  async register(req, res) {
    const { fullName, email, username, password } = req.body;

    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError("All fields are required", 400);
    }

    const existedUser =
      await RepositoryProvider.userRepository.findUserByEmailUsername({
        email,
        username,
      });

    if (existedUser) {
      throw new ApiError("User with email or username already exists", 409);
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      throw new ApiError("Avatar file is required", 400);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError("Avatar file is required", 400);
    }

    const user = await RepositoryProvider.userRepository.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser =
      await RepositoryProvider.userRepository.findByIdExcludeSensitiveData(
        user.id
      );

    if (!createdUser) {
      throw new ApiError(
        "Something went wrong while registering the user",
        500
      );
    }

    return ApiResponse.success(
      res,
      "User created successfully",
      createdUser,
      201
    );
  }
}
