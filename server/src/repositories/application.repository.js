import { Application } from "../models/Application.js";

export class ApplicationRepository {
  async create(appData) {
    const app = new Application(appData);
    return await app.save();
  }

  async findById(id) {
    return await Application.findById(id)
      .populate("jobId")
      .populate("seekerId", "fullName email city skills experience rating reviewCount profilePicture bio portfolio resume availability preferredWorkType portfolioWebsite preferredJobTypes hourlyRate education certifications");
  }

  async findByJobAndSeeker(jobId, seekerId) {
    return await Application.findOne({ jobId, seekerId });
  }

  async update(id, updateData) {
    return await Application.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async findAll(filter = {}, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate("jobId")
      .populate("seekerId", "fullName email city skills experience rating reviewCount profilePicture bio portfolio resume availability preferredWorkType portfolioWebsite preferredJobTypes hourlyRate education certifications")
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(options.limit);
    return { applications, total };
  }
}
