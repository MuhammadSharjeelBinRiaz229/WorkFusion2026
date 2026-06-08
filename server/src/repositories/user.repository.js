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

  async findByCnic(cnic) {
    return await User.findOne({ cnic });
  }

  async findByDeviceId(deviceId) {
    return await User.findOne({ deviceId });
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

  async searchTalents(filters = {}, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const query = { roles: "Service Seeker" };

    if (filters.query) {
      query.$or = [
        { fullName: { $regex: filters.query, $options: "i" } },
        { bio: { $regex: filters.query, $options: "i" } },
        { skills: { $in: [new RegExp(filters.query, "i")] } }
      ];
    }
    if (filters.city) {
      query.city = filters.city;
    }
    if (filters.skills && filters.skills.length > 0) {
      const regexSkills = filters.skills.map(s => new RegExp(s, "i"));
      query.skills = { $in: regexSkills };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort(options.sort || { rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(options.limit);

    return { talents: users, total };
  }
}
