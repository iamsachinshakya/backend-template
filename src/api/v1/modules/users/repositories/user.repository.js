import { User } from "../models/user.model.js";
export class UserRepository {
  async create(data) {
    return await User.create(data);
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
