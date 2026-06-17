import { ApplicationService } from "../services/application.service.js";
import { ActivityLog } from "../models/ActivityLog.js";
import mongoose from "mongoose";

export class ApplicationController {
  appService = new ApplicationService();

  apply = async (req, res, next) => {
    try {
      const seekerId = req.user?.id;
      if (!seekerId) throw new Error("Unauthorized");
      const app = await this.appService.apply(seekerId, req.body);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(seekerId),
        action: "Apply Job",
        entity: "Application",
        entityId: app._id,
      });

      return res.status(211).json({
        success: true,
        message: "Application submitted successfully",
        data: app,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId || !role) throw new Error("Unauthorized");

      const { status, interviewDate, interviewNote, offerNote, note } = req.body;
      const meta = { interviewDate, interviewNote, offerNote, note };

      const app = await this.appService.updateStatus(req.params.id, userId, role, status, meta);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        action: `Update Application Status to ${status}`,
        entity: "Application",
        entityId: app._id,
      });

      return res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        data: app,
      });
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req, res, next) => {
    try {
      const seekerId = req.user?.id;
      if (!seekerId) throw new Error("Unauthorized");

      const app = await this.appService.withdrawApplication(req.params.id, seekerId);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(seekerId),
        action: "Withdraw Application",
        entity: "Application",
        entityId: app._id,
      });

      return res.status(200).json({
        success: true,
        message: "Application withdrawn successfully",
        data: app,
      });
    } catch (error) {
      next(error);
    }
  };

  offerResponse = async (req, res, next) => {
    try {
      const seekerId = req.user?.id;
      if (!seekerId) throw new Error("Unauthorized");

      const { accept } = req.body;
      if (typeof accept !== "boolean") {
        return res.status(400).json({ success: false, message: '"accept" must be a boolean' });
      }

      const app = await this.appService.respondToOffer(req.params.id, seekerId, accept);

      await ActivityLog.create({
        userId: new mongoose.Types.ObjectId(seekerId),
        action: accept ? "Accept Job Offer" : "Decline Job Offer",
        entity: "Application",
        entityId: app._id,
      });

      return res.status(200).json({
        success: true,
        message: accept ? "Offer accepted. Your contract is now active!" : "Offer declined.",
        data: app,
      });
    } catch (error) {
      next(error);
    }
  };

  getApplications = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId || !role) throw new Error("Unauthorized");

      const { jobId, status, page = 1, limit = 10 } = req.query;

      const filters = {
        page: Number(page),
        limit: Number(limit),
      };

      if (status) filters.status = status;

      if (role === "Service Seeker") {
        filters.seekerId = userId;
      } else if (role === "Employer") {
        if (!jobId) {
          return res.status(400).json({
            success: false,
            message: "jobId is required for employers to retrieve applicants",
          });
        }
        filters.jobId = String(jobId);
      }

      const result = await this.appService.getApplications(filters);
      return res.status(200).json({
        success: true,
        message: "Applications retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
