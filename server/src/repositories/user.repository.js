import { User } from "../models/User.js";

export class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findAll(filter = {}, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(options.limit);
    return { users, total };
  }

  async search(query, city, role) {
    const filter = {};
    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
      ];
    }
    if (city) {
      filter.city = city;
    }
    if (role) {
      filter.role = role;
    }
    return await User.find(filter).limit(20);
  }
}
