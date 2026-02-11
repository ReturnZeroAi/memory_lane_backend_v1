import type { Request, Response } from 'express';
import { calendarsService } from './service.js';
import { ApiResponse } from '../../libs/shared/response/index.js';
import type { CreateCalendarDto, UpdateCalendarDto } from './dto.js';

export class CalendarsHandler {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const data = req.body as CreateCalendarDto;
    const calendar = await calendarsService.create(userId, data);
    ApiResponse.created(res, calendar, 'Calendar event created successfully');
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const calendars = await calendarsService.findAll(userId);
    ApiResponse.success(res, calendars);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const calendar = await calendarsService.findById(userId, id!);
    ApiResponse.success(res, calendar);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body as UpdateCalendarDto;
    const calendar = await calendarsService.update(userId, id!, data);
    ApiResponse.success(res, calendar, 'Calendar event updated successfully');
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    await calendarsService.delete(userId, id!);
    ApiResponse.noContent(res);
  }
}

export const calendarsHandler = new CalendarsHandler();
