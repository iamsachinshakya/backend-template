import { User } from "../models/user.model.js";

export class UserRepository {
  // Create new user
  async create(data) {
    const user = await User.create(data);
    return this.formatUser(user);
  }

  async findById(id, projection = "-password -refreshToken") {
    return await User.findById(id).select(projection);
  }

  async findByEmail(email, projection = "-password -refreshToken") {
    return await User.findOne({ email }).select(projection);
  }

  async findByUsername(username) {
    return await User.findOne({ username: username.toLowerCase() });
  }

  async findByEmailOrUsername({ email, username }) {
    return await User.findOne({
      $or: [{ username: username?.toLowerCase() }, { email }],
    });
  }

  async findAll(sort = { createdAt: -1 }) {
    return await User.find().sort(sort);
  }

  async updateById(id, data, projection = "-password -refreshToken") {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select(projection);
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  // Token & account utilities
  async removeRefreshTokenById(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  async updateAccountDetails(userId, updates) {
    return await this.updateById(userId, { $set: updates });
  }

  async save(user, options = {}) {
    return await user.save(options);
  }

  async aggregate(pipeline = []) {
    return await User.aggregate(pipeline);
  }

  async isUsernameTaken(username) {
    const user = await this.findByUsername(username);
    return !!user;
  }

  formatUser(userDoc) {
    if (!userDoc) return null;
    const user = userDoc.toObject();
    user.id = user._id;
    delete user._id;
    return user;
  }
}
