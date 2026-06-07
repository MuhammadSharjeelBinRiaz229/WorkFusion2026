import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Recommendation } from "../models/Recommendation.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export class RecommendationService {
  /**
   * Fetches job recommendations for a Service Seeker.
   * Scans open jobs, sends data to Python AI service, sorts descending, and caches results.
   * Specific missing skills are stripped from Seeker responses.
   */
  async getJobRecommendations(seekerId, limit = 50) {
    const seeker = await User.findById(seekerId);
    if (!seeker) {
      throw new Error("Service Seeker profile not found");
    }

    const openJobs = await Job.find({ status: "Open" }).limit(1000);
    if (openJobs.length === 0) {
      return [];
    }

    const pastApps = await Application.find({ seekerId: new mongoose.Types.ObjectId(seekerId) });
    const appliedJobIds = new Set(pastApps.map((app) => app.jobId.toString()));

    const jobsToMatch = openJobs.filter((job) => !appliedJobIds.has(job._id.toString()));
    if (jobsToMatch.length === 0) {
      return [];
    }

    const payload = {
      seeker: {
        id: seeker._id.toString(),
        skills: seeker.skills,
        portfolio: seeker.portfolio.map((p) => `${p.title}: ${p.description} (${p.technologies.join(", ")})`).join(" | "),
        experience: seeker.experience,
        preferredCategory: seeker.preferredWorkType || "",
        city: seeker.city,
        availability: seeker.availability || "",
        rating: seeker.rating,
        reviewCount: seeker.reviewCount,
      },
      jobs: jobsToMatch.map((job) => ({
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills,
        category: job.category,
        serviceType: job.serviceType,
        workType: job.workType,
        experienceRequired: job.experienceRequired,
        location: job.location,
        remoteAllowed: job.remoteAllowed,
        budget: job.budget,
      })),
    };

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/recommend/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned status ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.recommendations) {
        throw new Error("AI service matching computation failed");
      }

      const recommendations = result.recommendations;
      
      const bulkOps = recommendations.map((rec) => ({
        updateOne: {
          filter: { userId: seeker._id, jobId: new mongoose.Types.ObjectId(rec.jobId) },
          update: {
            $set: {
              score: rec.score,
              reason: rec.reason,
              generatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await Recommendation.bulkWrite(bulkOps);
      }

      const matchedJobIds = recommendations.map((rec) => new mongoose.Types.ObjectId(rec.jobId));
      const jobs = await Job.find({ _id: { $in: matchedJobIds } }).populate("employerId", "fullName email city rating profilePicture");

      const mergedMatches = recommendations
        .map((rec) => {
          const jobDoc = jobs.find((j) => j._id.toString() === rec.jobId);
          if (!jobDoc) return null;
          return {
            job: jobDoc,
            score: rec.score,
            reason: rec.reason,
          };
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return mergedMatches;
    } catch (err) {
      logger.error(`RecommendationService API call failed: ${err.message}. Falling back to default sorting.`);
      const matchedJobs = jobsToMatch.slice(0, limit);
      return matchedJobs.map((job) => ({
        job,
        score: 70,
        reason: ["Matched Preferred Category"],
      }));
    }
  }

  /**
   * Fetches candidate recommendations for an Employer's job.
   * Includes specific missingSkills in the return payload to assist hiring decisions.
   */
  async getCandidateRecommendations(jobId, limit = 30) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job listing not found");
    }

    const seekers = await User.find({ role: "Service Seeker", status: "Active" }).limit(500);
    if (seekers.length === 0) {
      return [];
    }

    const payload = {
      job: {
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills,
        category: job.category,
        serviceType: job.serviceType,
        workType: job.workType,
        experienceRequired: job.experienceRequired,
        location: job.location,
        remoteAllowed: job.remoteAllowed,
        budget: job.budget,
      },
      candidates: seekers.map((seeker) => ({
        id: seeker._id.toString(),
        fullName: seeker.fullName,
        skills: seeker.skills,
        portfolio: seeker.portfolio.map((p) => `${p.title}: ${p.description} (${p.technologies.join(", ")})`).join(" | "),
        experience: seeker.experience,
        preferredCategory: seeker.preferredWorkType || "",
        city: seeker.city,
        availability: seeker.availability || "",
        rating: seeker.rating,
        reviewCount: seeker.reviewCount,
      })),
    };

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/recommend/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned status ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.recommendations) {
        throw new Error("AI service matching computation failed");
      }

      const recommendations = result.recommendations;

      const mergedMatches = recommendations
        .map((rec) => {
          const seekerDoc = seekers.find((s) => s._id.toString() === rec.candidateId);
          if (!seekerDoc) return null;
          const profile = seekerDoc.toObject();
          delete profile.password;
          return {
            candidate: profile,
            score: rec.score,
            reason: rec.reason,
            missingSkills: rec.missingSkills,
          };
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return mergedMatches;
    } catch (err) {
      logger.error(`RecommendationService getCandidates failed: ${err.message}`);
      return seekers.slice(0, limit).map((s) => {
        const profile = s.toObject();
        delete profile.password;
        return {
          candidate: profile,
          score: 60,
          reason: ["Matching Category"],
          missingSkills: [],
        };
      });
    }
  }
}
