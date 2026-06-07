import { Job } from "../models/Job.js";

export class JobRepository {
  async create(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  async findById(id) {
    return await Job.findById(id).populate("employerId", "fullName email city rating profilePicture");
  }

  async update(id, updateData) {
    return await Job.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async delete(id) {
    return await Job.findByIdAndDelete(id);
  }

  async findAll(filter = {}, options = { page: 1, limit: 10 }) {
    const skip = (options.page - 1) * options.limit;
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate("employerId", "fullName email city rating profilePicture")
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(options.limit);
    return { jobs, total };
  }

  async count(filter = {}) {
    return await Job.countDocuments(filter);
  }
}
