import mongoose, { Schema } from "mongoose";
import { UserRole, UserStatus, WorkType } from "shared";

const PortfolioProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  github: { type: String, default: "" },
  demo: { type: String, default: "" },
});

const EducationSchema = new Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  year: { type: Number, required: true },
});

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    city: { type: String, required: true, index: true },
    address: { type: String, default: "" },
    skills: { type: [String], default: [], index: true },
    experience: { type: Number, default: 0 },
    education: { type: [EducationSchema], default: [] },
    languages: [{ type: String }],
    certifications: [{ type: String }],
    portfolio: { type: [PortfolioProjectSchema], default: [] },
    resume: { type: String, default: "" },
    availability: { type: String, default: "" },
    preferredWorkType: {
      type: String,
      enum: Object.values(WorkType),
    },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    profileCompletion: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
