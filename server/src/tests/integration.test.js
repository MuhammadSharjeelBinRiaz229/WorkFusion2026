import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { UserRole, ApplicationStatus, ServiceType, WorkType } from "shared";

const TEST_DB_URI = "mongodb://localhost:27017/workfusion_test";

beforeAll(async () => {
  // Override database connection to testing database
  await mongoose.disconnect();
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  // Clean up and close connection
  await User.deleteMany({});
  await Job.deleteMany({});
  await Application.deleteMany({});
  await Chat.deleteMany({});
  await Message.deleteMany({});
  await mongoose.disconnect();
});

describe("WorkFusion Integration Test Suite", () => {
  let seekerToken;
  let employerToken;
  let seekerId;
  let employerId;
  let jobId;
  let applicationId;
  let chatId;

  // 1. AUTHENTICATION TESTS
  it("should successfully register an Employer", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test Employer Company",
        email: "employer_test@workfusion.com",
        password: "password123",
        role: UserRole.EMPLOYER,
        city: "Islamabad",
      });

    expect(res.status).toBe(211);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe(UserRole.EMPLOYER);
    employerToken = res.body.data.accessToken;
    employerId = res.body.data.user.id;
  });

  it("should successfully register a Service Seeker", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test Seeker Candidate",
        email: "seeker_test@workfusion.com",
        password: "password123",
        role: UserRole.SEEKER,
        city: "Rawalpindi",
        skills: ["React", "Node.js"],
      });

    expect(res.status).toBe(211);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe(UserRole.SEEKER);
    seekerToken = res.body.data.accessToken;
    seekerId = res.body.data.user.id;
  });

  // 2. JOB BOARD POSTING TESTS
  it("should block a Seeker from posting a Job", async () => {
    const res = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${seekerToken}`)
      .send({
        title: "Forbidden Seeker Job Post",
        description: "Should fail authorization checks",
        category: "Web Development",
        requiredSkills: ["React"],
        experienceRequired: 2,
        budget: 50000,
        location: "Islamabad",
        serviceType: ServiceType.ONLINE,
        workType: WorkType.PROJECT,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should allow an Employer to post a Job", async () => {
    const res = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${employerToken}`)
      .send({
        title: "Integration Test Web Developer",
        description: "Full-stack role for building custom MERN dashboards.",
        category: "Web Development",
        requiredSkills: ["React", "Node.js"],
        experienceRequired: 2,
        experienceLevel: "Intermediate",
        timeline: "1 - 3 months",
        budget: 120000,
        location: "Islamabad",
        serviceType: ServiceType.ONLINE,
        workType: WorkType.PROJECT,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      });

    expect(res.status).toBe(211);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toContain("Integration Test Web Developer");
    jobId = res.body.data._id;
  });

  // 3. APPLICATION WORKFLOW
  it("should allow a Seeker to apply for the Job", async () => {
    const res = await request(app)
      .post("/api/v1/applications")
      .set("Authorization", `Bearer ${seekerToken}`)
      .send({
        jobId,
        proposal: "Hi, I have solid experience in React and Node and want to apply.",
        expectedSalary: 115000,
        availability: "Immediate",
        estimatedTime: "2 weeks",
      });

    expect(res.status).toBe(211);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(ApplicationStatus.APPLIED);
    applicationId = res.body.data._id;
  });

  // 4. MESSAGING STATUS CHECKS (CRITICAL DIRECTIVE VERIFICATION)
  it("should BLOCK messaging because application is not in Interview status", async () => {
    const mockChat = new Chat({
      jobId: new mongoose.Types.ObjectId(jobId),
      employerId: new mongoose.Types.ObjectId(employerId),
      seekerId: new mongoose.Types.ObjectId(seekerId),
      status: "Active",
    });
    await mockChat.save();
    chatId = mockChat._id.toString();

    const res = await request(app)
      .post("/api/v1/chats/message")
      .set("Authorization", `Bearer ${seekerToken}`)
      .send({
        chatId,
        message: "Hello employer! Can we chat?",
        type: "Text",
      });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Messaging is disabled");
  });

  it("should ALLOW messaging after Employer transitions Application to Interview status", async () => {
    const statusRes = await request(app)
      .patch(`/api/v1/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${employerToken}`)
      .send({ status: ApplicationStatus.INTERVIEW });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.success).toBe(true);
    expect(statusRes.body.data.status).toBe(ApplicationStatus.INTERVIEW);

    const msgRes = await request(app)
      .post("/api/v1/chats/message")
      .set("Authorization", `Bearer ${seekerToken}`)
      .send({
        chatId,
        message: "Hello employer! Direct messaging works now.",
        type: "Text",
      });

    expect(msgRes.status).toBe(211);
    expect(msgRes.body.success).toBe(true);
    expect(msgRes.body.data.message).toBe("Hello employer! Direct messaging works now.");
  });
});
