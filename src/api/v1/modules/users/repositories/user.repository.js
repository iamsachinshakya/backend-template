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

  async findByIdExcludeSensitiveData(id) {
    return await User.findById(id).select("-password -refreshToken");
  }

  async findAll() {
    return await User.find().sort({ createdAt: -1 });
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
}
