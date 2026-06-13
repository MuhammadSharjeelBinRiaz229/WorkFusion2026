import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Review } from "../models/Review.js";
import { UserRole, ServiceType, WorkType, JobStatus, ApplicationStatus } from "shared";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/workfusion";

const addReviewsForSeeker21 = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // 1. Find seeker21@workfusion.com
    const seeker = await User.findOne({ email: "seeker21@workfusion.com" });
    if (!seeker) {
      console.error("Could not find seeker21@workfusion.com user. Make sure you seeded the DB first.");
      process.exit(1);
    }
    console.log(`Found Seeker: ${seeker.fullName} (${seeker._id})`);

    // 2. Find three different employers
    const employers = await User.find({ role: UserRole.EMPLOYER }).limit(3);
    if (employers.length < 3) {
      console.error("Could not find at least 3 employers. Please check database seeding.");
      process.exit(1);
    }
    console.log(`Found Employers: ${employers.map(e => e.fullName).join(", ")}`);

    // Clean up any existing reviews/applications for seeker21 to avoid duplicates on rerun
    const existingApps = await Application.find({ seekerId: seeker._id });
    const jobIdsToDelete = existingApps.map(app => app.jobId);
    
    // We only delete applications and reviews that we generated for these specific jobs
    await Review.deleteMany({ receiver: seeker._id });
    await Application.deleteMany({ seekerId: seeker._id, status: ApplicationStatus.COMPLETED });
    
    console.log("Cleared old completed apps and reviews for seeker21.");

    // 3. Define project details
    const projects = [
      {
        title: "Senior React Developer for E-Commerce Dashboard",
        description: "Need a skilled React developer to build an interactive administrative control dashboard with charts, stats, and real-time sockets.",
        category: "Web Development",
        skills: ["React", "JavaScript", "TailwindCSS"],
        budget: 120000,
        rating: 5,
        comment: "Outstanding developer! Handled complex state management and responsive design challenges with ease. A highly motivated professional who communicates well.",
        employer: employers[0]
      },
      {
        title: "MERN Stack SaaS Platform Development",
        description: "Looking for an expert developer to configure Node.js/Express REST APIs and secure JWT authentications, integrating with a frontend dashboard.",
        category: "Web Development",
        skills: ["Node.js", "Express.js", "MongoDB", "React"],
        budget: 240000,
        rating: 5,
        comment: "Excellent MERN stack execution. The API clean architecture was exactly what we needed. Delivered on time and exceeded expectations in all areas.",
        employer: employers[1]
      },
      {
        title: "Figma UI/UX Specialist for Employment Platform",
        description: "Looking for a designer to create wireframes, UI kits, design tokens, and clickable prototypes on Figma.",
        category: "UI/UX & Web Design",
        skills: ["Figma", "UI/UX Design"],
        budget: 50000,
        rating: 4,
        comment: "Very detailed Figma designs and prototyping. Highly professional communicator and eager to iterate. Made some excellent UX recommendations.",
        employer: employers[2]
      }
    ];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];

      // Create Completed Job
      const job = await Job.create({
        title: p.title,
        description: p.description,
        category: p.category,
        serviceType: ServiceType.ONLINE,
        workType: WorkType.PROJECT,
        requiredSkills: p.skills,
        experienceRequired: 2,
        experienceLevel: "Intermediate",
        budget: p.budget,
        location: "Islamabad",
        deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: JobStatus.CLOSED,
        employerId: p.employer._id
      });

      // Create Completed Application
      await Application.create({
        jobId: job._id,
        seekerId: seeker._id,
        proposal: `Hi, I am interested in applying for "${p.title}". I have extensive experience in ${p.skills.join(", ")} and can deliver high-quality code.`,
        expectedSalary: p.budget,
        availability: "Immediate Start",
        estimatedTime: "2 weeks",
        status: ApplicationStatus.COMPLETED,
        matchScore: 95
      });

      // Create Review
      await Review.create({
        jobId: job._id,
        reviewer: p.employer._id,
        receiver: seeker._id,
        rating: p.rating,
        comment: p.comment
      });
      
      console.log(`Seeded Job & Review: "${p.title}"`);
    }

    // 4. Update Seeker rating stats
    const stats = await Review.aggregate([
      { $match: { receiver: seeker._id } },
      {
        $group: {
          _id: "$receiver",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      const avg = Math.round(stats[0].avgRating * 10) / 10;
      const count = stats[0].count;
      
      await User.findByIdAndUpdate(seeker._id, {
        rating: avg,
        reviewCount: count
      });
      console.log(`Updated seeker21 profile ratings stats: rating = ${avg}, reviewCount = ${count}`);
    }

    console.log("Successfully completed seeding reviews for seeker21.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding reviews failed:", error);
    process.exit(1);
  }
};

addReviewsForSeeker21();
