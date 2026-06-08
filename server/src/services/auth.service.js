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
    if (user.role === "Employer") {
      if (user.companyName && user.companyName.trim().length > 0) score += 20;
      if (user.employeesCount && user.employeesCount.trim().length > 0) score += 20;
      if (user.googleMapsLink && user.googleMapsLink.trim().length > 0) score += 10;
      if (user.bio && user.bio.trim().length > 0) score += 10;
      if (user.profilePicture && user.profilePicture.trim().length > 0) score += 10;
      if (user.city && user.city.trim().length > 0) score += 10;
      if (user.address && user.address.trim().length > 0) score += 10;
      if (user.phone && user.phone.trim().length > 0) score += 10;
    } else {
      if (user.bio && user.bio.trim().length > 0) score += 10;
      if (user.profilePicture && user.profilePicture.trim().length > 0) score += 10;
      if (user.city && user.city.trim().length > 0) score += 10;
      if (user.skills && user.skills.length > 0) score += 20;
      if (user.experience && user.experience > 0) score += 10;
      if (user.education && user.education.length > 0) score += 10;
      if (user.portfolio && user.portfolio.length > 0) score += 20;
      if (user.resume && user.resume.trim().length > 0) score += 10;
    }
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

    if (input.cnic) {
      const existingCnic = await this.userRepo.findByCnic(input.cnic);
      if (existingCnic) {
        throw new Error("CNIC is already registered to another account");
      }
    }

    if (input.deviceId) {
      const existingDevice = await this.userRepo.findByDeviceId(input.deviceId);
      if (existingDevice) {
        throw new Error("Multiple accounts detected from this device. Please log in to your existing account.");
      }
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userData = {
      ...input,
      password: hashedPassword,
      roles: [input.role],
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
        roles: user.roles,
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
        roles: user.roles,
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

  async addProfile(userId, input) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.roles.includes(input.role)) {
      throw new Error(`Profile role ${input.role} already exists on this account`);
    }

    user.roles.push(input.role);
    user.role = input.role;

    if (input.bio) user.bio = input.bio;
    if (input.phone) user.phone = input.phone;
    if (input.city) user.city = input.city;
    if (input.address) user.address = input.address;
    if (input.profilePicture) user.profilePicture = input.profilePicture;
    if (input.companyName) user.companyName = input.companyName;
    if (input.employeesCount) user.employeesCount = input.employeesCount;
    if (input.googleMapsLink) user.googleMapsLink = input.googleMapsLink;

    user.profileCompletion = this.calculateProfileCompletion(user);

    await user.save();
    logger.info(`Profile added for user: ${user.email} -> ${input.role}`);

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        roles: user.roles,
        city: user.city,
        profileCompletion: user.profileCompletion,
      },
      ...tokens,
    };
  }

  async switchRole(userId, requestedRole) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.roles.includes(requestedRole)) {
      throw new Error(`User does not have the profile role: ${requestedRole}`);
    }

    user.role = requestedRole;
    await user.save();
    logger.info(`User ${user.email} switched active role to ${requestedRole}`);

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        roles: user.roles,
        city: user.city,
        profileCompletion: user.profileCompletion,
      },
      ...tokens,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    logger.info(`Password updated for user: ${user.email}`);
    return true;
  }

  async searchTalents(filters, options) {
    return await this.userRepo.searchTalents(filters, options);
  }
}
