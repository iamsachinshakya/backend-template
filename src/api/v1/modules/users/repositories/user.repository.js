import { User } from "../models/user.model.js";
export class UserRepository {
  async create(data) {
    const user = await User.create(data);
    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    return userObj;
  }

  async findByEmailUsername(data = {}) {
    const { email, username } = data;
    return await User.findOne({
      $or: [{ username }, { email }],
    });
  }

  async findByIdExcludeFields(id, excludeFields = "") {
    // Ensure excludeFields is a proper string (e.g. "-password -refreshToken")
    return await User.findById(id).select(excludeFields);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findAll() {
    return await User.find().sort({ createdAt: -1 });
  }

  async save(user, options = null) {
    return await user.save(options || {});
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async removeRefreshTokenById(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 }, // removes refreshToken field
      },
      { new: true }
    );
  }
}
