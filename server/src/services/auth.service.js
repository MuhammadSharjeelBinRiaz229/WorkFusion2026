import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const ACCESS_SECRET = process.env.JWT_SECRET || "super_secret_access_token_key";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super_secret_refresh_token_key";

export class AuthService {
  userRepo = new UserRepository();

  calculateProfileCompletion(user) {
    let score = 0;
    if (user.bio && user.bio.trim().length > 0) score += 10;
    if (user.profilePicture && user.profilePicture.trim().length > 0) score += 10;
    if (user.city && user.city.trim().length > 0) score += 10;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.experience && user.experience > 0) score += 10;
    if (user.education && user.education.length > 0) score += 10;
    if (user.portfolio && user.portfolio.length > 0) score += 20;
    if (user.resume && user.resume.trim().length > 0) score += 10;
    return score;
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
    return { accessToken, refreshToken };
  }

  async register(input) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error("Email address already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userData = {
      ...input,
      password: hashedPassword,
      rating: 5,
      reviewCount: 0,
      isVerified: false,
    };

    userData.profileCompletion = this.calculateProfileCompletion(userData);

    const user = await this.userRepo.create(userData);
    logger.info(`User registered successfully: ${user.email} (${user.role})`);

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        city: user.city,
        profileCompletion: user.profileCompletion,
      },
      ...tokens,
    };
  }

  async login(input) {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status === "Suspended") {
      throw new Error("Your account has been suspended. Please contact support.");
    }

    const isMatch = await bcrypt.compare(input.password, user.password || "");
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    logger.info(`User logged in: ${user.email}`);
    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        city: user.city,
        profileCompletion: user.profileCompletion,
      },
      ...tokens,
    };
  }

  async refresh(token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET);
      const user = await this.userRepo.findById(decoded.id);
      if (!user || user.status === "Suspended") {
        throw new Error("Invalid session");
      }

      const accessToken = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
      );
      return { accessToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const profile = user.toObject();
    delete profile.password;
    return profile;
  }

  async updateProfile(userId, input) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const mergedUserObj = { ...user.toObject(), ...input };
    const newCompletion = this.calculateProfileCompletion(mergedUserObj);

    const updatedData = {
      ...input,
      profileCompletion: newCompletion,
    };

    const updatedUser = await this.userRepo.update(userId, updatedData);
    if (!updatedUser) {
      throw new Error("Failed to update profile");
    }

    logger.info(`Profile updated for user: ${updatedUser.email}`);
    const result = updatedUser.toObject();
    delete result.password;
    return result;
  }
}
