import type { Request, Response } from 'express';
import { lanesService } from './service.js';
import { ApiResponse } from '../../libs/shared/response/index.js';
import type { CreateLaneDto, UpdateLaneDto } from './dto.js';

export class LanesHandler {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const data = req.body as CreateLaneDto;
    const lane = await lanesService.create(userId, data);
    ApiResponse.created(res, lane, 'Lane created successfully');
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const lanes = await lanesService.findAll(userId);
    ApiResponse.success(res, lanes);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const lane = await lanesService.findById(userId, id!);
    ApiResponse.success(res, lane);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body as UpdateLaneDto;
    const lane = await lanesService.update(userId, id!, data);
    ApiResponse.success(res, lane, 'Lane updated successfully');
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    await lanesService.delete(userId, id!);
    ApiResponse.noContent(res);
  }
}

export const lanesHandler = new LanesHandler();
