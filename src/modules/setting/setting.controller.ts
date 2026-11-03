import type { Request, Response } from "express";
import { ok } from "../../utils/api";
import { SETTING_MESSAGES } from "./setting.constant";
import { settingService } from "./setting.service";
import type { UpdateSystemSettingsInput } from "./setting.type";

export const settingController = {
  getSettings(_req: Request, res: Response): Response {
    const data = settingService.getSettings();
    return ok(res, data, SETTING_MESSAGES.FETCH_SUCCESS);
  },

  async updateSettings(req: Request, res: Response): Promise<Response> {
    const input = req.body as UpdateSystemSettingsInput;
    const userId = req.user?.id;
    const data = await settingService.updateSettings(input, userId);
    return ok(res, data, SETTING_MESSAGES.UPDATE_SUCCESS);
  },

  async exportBackup(_req: Request, res: Response): Promise<Response> {
    const data = await settingService.generateDatabaseBackup();
    return ok(res, data, SETTING_MESSAGES.BACKUP_SUCCESS);
  },
};

