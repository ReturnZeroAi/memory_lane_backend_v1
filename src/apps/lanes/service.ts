import { prisma } from '../../libs/shared/db/index.js';
import { NotFoundError } from '../../libs/shared/errors/index.js';
import { logger } from '../../libs/shared/logger/index.js';
import type { CreateLaneDto, UpdateLaneDto, LaneResponseDto } from './dto.js';

export class LanesService {
  async create(userId: string, data: CreateLaneDto): Promise<LaneResponseDto> {
    const lane = await prisma.lane.create({
      data: {
        title: data.title,
        description: data.description,
        color: data.color,
        userId,
      },
    });

    logger.info({ laneId: lane.id, userId }, 'Lane created');
    return lane;
  }

  async findAll(userId: string): Promise<LaneResponseDto[]> {
    return prisma.lane.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(userId: string, id: string): Promise<LaneResponseDto> {
    const lane = await prisma.lane.findFirst({
      where: { id, userId },
    });

    if (!lane) {
      throw new NotFoundError('Lane not found');
    }

    return lane;
  }

  async update(userId: string, id: string, data: UpdateLaneDto): Promise<LaneResponseDto> {
    await this.findById(userId, id);

    const updated = await prisma.lane.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
      },
    });

    logger.info({ laneId: id, userId }, 'Lane updated');
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);
    await prisma.lane.delete({ where: { id } });
    logger.info({ laneId: id, userId }, 'Lane deleted');
  }
}

export const lanesService = new LanesService();
