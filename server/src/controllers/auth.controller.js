import { AuthService } from "../services/auth.service.js";
import { ActivityLog } from "../models/ActivityLog.js";
import mongoose from "mongoose";

export class AuthController {
  authService = new AuthService();

  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);
      
      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(result.user.id),
        action: "Register",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(result.user.id),
      });

      return res.status(211).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(result.user.id),
        action: "Login",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(result.user.id),
      });

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }
      const result = await this.authService.refresh(refreshToken);
      return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const profile = await this.authService.getProfile(userId);
      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const updatedProfile = await this.authService.updateProfile(userId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: "Update Profile",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(userId),
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  addProfile = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const result = await this.authService.addProfile(userId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: "Add Profile",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(userId),
      });

      return res.status(211).json({
        success: true,
        message: "Profile added successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  switchRole = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const { role } = req.body;
      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required to switch profiles",
        });
      }

      const result = await this.authService.switchRole(userId, role);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: "Switch Role",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(userId),
      });

      return res.status(200).json({
        success: true,
        message: "Active profile switched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const { currentPassword, newPassword } = req.body;

      await this.authService.changePassword(userId, currentPassword, newPassword);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: "Change Password",
        entity: "User",
        entityId: new mongoose.Types.ObjectId(userId),
      });

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getTalents = async (req, res, next) => {
    try {
      const { query, city, skills, page = 1, limit = 10 } = req.query;
      const filters = {};
      if (query) filters.query = String(query);
      if (city) filters.city = String(city);
      if (skills) {
        filters.skills = String(skills).split(",").map(s => s.trim()).filter(s => s.length > 0);
      }

      const options = {
        page: Number(page),
        limit: Number(limit),
      };

      const result = await this.authService.searchTalents(filters, options);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
