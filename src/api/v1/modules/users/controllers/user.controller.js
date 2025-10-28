import { User } from "../models/user.model.js";

export class UserController {
  // ✅ Create user
  async create(req, res) {
    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  }

  // ✅ Get all users
  async getAll(req, res) {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  }

  // ✅ Get user by ID
  async getById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }

  // ✅ Update user
  async update(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }

  // ✅ Delete user
  async delete(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(204).send();
  }
}
