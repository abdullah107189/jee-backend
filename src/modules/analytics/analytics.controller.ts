import type { Request, Response } from "express";
import { ok, queryString } from "../../utils/api";
import { ANALYTICS_MESSAGES } from "./analytics.constant";
import { analyticsService } from "./analytics.service";

export const analyticsController = {
  async getAdminAnalytics(req: Request, res: Response): Promise<Response> {
    const period = queryString(req.query.period) || "MONTH";
    const data = await analyticsService.getAdminAnalytics({ period });
    return ok(res, data, ANALYTICS_MESSAGES.FETCH_SUCCESS);
  },
};

