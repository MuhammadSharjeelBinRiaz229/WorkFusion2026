import { z } from "zod";

// ==========================================
// 1. CONSTANTS & ENUMS
// ==========================================

export const UserRole = {
  EMPLOYER: "Employer",
  SEEKER: "Service Seeker",
  ADMIN: "Admin",
};

export const UserStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

export const ServiceType = {
  ONLINE: "Online",
  PHYSICAL: "Physical",
  HYBRID: "Hybrid",
};

export const WorkType = {
  HOURLY: "Hourly",
  MONTHLY: "Monthly",
  PROJECT: "Project",
  PART_TIME: "Part-Time",
  FULL_TIME: "Full-Time",
};

export const JobStatus = {
  DRAFT: "Draft",
  OPEN: "Open",
  PAUSED: "Paused",
  CLOSED: "Closed",
};

export const ApplicationStatus = {
  APPLIED: "Applied",
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  HIRED: "Hired",
  COMPLETED: "Completed",
};

export const MessageType = {
  TEXT: "Text",
  IMAGE: "Image",
  PDF: "PDF",
  RESUME: "Resume",
  PORTFOLIO: "Portfolio",
};

export const NotificationType = {
  APPLICATION: "Application",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  RECOMMENDATION: "Recommendation",
  MESSAGE: "Message",
  SYSTEM: "System",
};

// ==========================================
// 2. VALIDATION SCHEMAS (ZOD)
// ==========================================

// --- AUTH VALIDATION ---
export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experience: z.number().nonnegative("Experience must be a non-negative number").default(0),
  preferredWorkType: z.nativeEnum(WorkType).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- USER PROFILE VALIDATION ---
export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  city: z.string().min(2).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().nonnegative().optional(),
  preferredWorkType: z.nativeEnum(WorkType).optional(),
  portfolio: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    technologies: z.array(z.string()),
    github: z.string().url().or(z.literal("")).optional(),
    demo: z.string().url().or(z.literal("")).optional(),
  })).optional(),
  resume: z.string().optional(), // URL or rich text summary
  availability: z.string().optional(), // e.g., "Full-time availability", "Weekends only"
});

// --- JOB VALIDATION ---
export const CreateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  subcategory: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType),
  workType: z.nativeEnum(WorkType),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  experienceRequired: z.number().nonnegative("Experience required must be a non-negative number"),
  budget: z.number().positive("Budget must be a positive number"),
  currency: z.string().default("PKR"),
  location: z.string().min(2, "Location is required"),
  remoteAllowed: z.boolean().default(false),
  vacancies: z.number().int().positive().default(1),
  deadline: z.string().transform((str) => new Date(str)),
  status: z.nativeEnum(JobStatus).default(JobStatus.OPEN),
  experienceLevel: z.enum(["Entry Level", "Intermediate", "Expert"]).default("Intermediate"),
  timeline: z.enum(["Less than 1 month", "1 - 3 months", "3 - 6 months", "More than 6 months"]).optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial();

// --- APPLICATION VALIDATION ---
export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  proposal: z.string().min(20, "Proposal must be at least 20 characters"),
  resume: z.string().optional(),
  portfolio: z.array(z.string()).optional(),
  expectedSalary: z.number().positive("Expected salary must be a positive number"),
  availability: z.string().min(2, "Availability description is required"),
  estimatedTime: z.string().min(1, "Estimated time is required"),
});

// --- REVIEW VALIDATION ---
export const CreateReviewSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  receiverId: z.string().min(1, "Receiver ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

// --- CHAT MESSAGE VALIDATION ---
export const CreateMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z.string().min(1, "Message cannot be empty"),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  attachment: z.string().optional(),
});
