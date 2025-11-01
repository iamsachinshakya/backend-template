import { ApiError } from "../../../common/utils/ApiError.js";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.js";
import { RepositoryProvider } from "../../../RepositoryProvider.js";

export class UserService {
  async getAllUsers() {
    return await RepositoryProvider.userRepository.findAll();
  }

  async getUserById(userId) {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async updateAccountDetails(userId, body) {
    const allowedFields = ["fullName", "email", "username"];
    const updates = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined && body[key] !== "") {
        updates[key] = body[key].trim();
      }
    }

    if (Object.keys(updates).length === 0)
      throw new ApiError("At least one valid field is required to update", 400);

    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email))
      throw new ApiError("Invalid email format", 400);

    if (updates.username) {
      const existingUser =
        await RepositoryProvider.userRepository.isUsernameTaken(
          updates.username?.toLowerCase()
        );
      if (existingUser) throw new ApiError("Username already taken", 409);
    }

    return await RepositoryProvider.userRepository.updateAccountDetails(
      userId,
      updates
    );
  }

  async updateAvatar(userId, file) {
    const avatarLocalPath = file?.path;
    if (!avatarLocalPath) throw new ApiError("Avatar file is missing", 400);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) throw new ApiError("Failed to upload avatar", 400);

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      $set: { avatar: avatar.url },
    });
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async updateCoverImage(userId, file) {
    const coverImageLocalPath = file?.path;
    if (!coverImageLocalPath)
      throw new ApiError("Cover image file is missing", 400);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage?.url)
      throw new ApiError("Failed to upload cover image", 400);

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      $set: { coverImage: coverImage.url },
    });
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async deleteUser(userId) {
    const user = await RepositoryProvider.userRepository.deleteById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return true;
  }

  async getUserChannelProfile(username, currentUserId) {
    if (!username?.trim()) throw new ApiError("Username is missing", 400);

    const pipeline = [
      { $match: { username: username.toLowerCase() } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          channelsSubscribedToCount: { $size: "$subscribedTo" },
          isSubscribed: {
            $in: [currentUserId, "$subscribers.subscriber"],
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ];

    const channel = await RepositoryProvider.userRepository.aggregate(pipeline);
    if (!channel?.length) throw new ApiError("Channel does not exist", 404);
    return channel[0];
  }

  async getWatchHistory(userId) {
    const pipeline = [
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  { $project: { fullName: 1, username: 1, avatar: 1 } },
                ],
              },
            },
            { $addFields: { owner: { $first: "$owner" } } },
          ],
        },
      },
    ];

    const user = await RepositoryProvider.userRepository.aggregate(pipeline);
    return user[0]?.watchHistory || [];
  }
}
