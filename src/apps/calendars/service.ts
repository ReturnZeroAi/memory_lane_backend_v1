import { prisma } from '../../libs/shared/db/index.js';
import { NotFoundError } from '../../libs/shared/errors/index.js';
import { logger } from '../../libs/shared/logger/index.js';
import type { CreateCalendarDto, UpdateCalendarDto, CalendarResponseDto } from './dto.js';

export class CalendarsService {
  async create(userId: string, data: CreateCalendarDto): Promise<CalendarResponseDto> {
    const calendar = await prisma.calendar.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isAllDay: data.isAllDay,
        userId,
      },
    });

    logger.info({ calendarId: calendar.id, userId }, 'Calendar event created');
    return calendar;
  }

  async findAll(userId: string): Promise<CalendarResponseDto[]> {
    return prisma.calendar.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async findById(userId: string, id: string): Promise<CalendarResponseDto> {
    const calendar = await prisma.calendar.findFirst({
      where: { id, userId },
    });

    if (!calendar) {
      throw new NotFoundError('Calendar event not found');
    }

    return calendar;
  }

  async update(userId: string, id: string, data: UpdateCalendarDto): Promise<CalendarResponseDto> {
    await this.findById(userId, id);

    const updated = await prisma.calendar.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.isAllDay !== undefined && { isAllDay: data.isAllDay }),
      },
    });

    logger.info({ calendarId: id, userId }, 'Calendar event updated');
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);
    await prisma.calendar.delete({ where: { id } });
    logger.info({ calendarId: id, userId }, 'Calendar event deleted');
  }
}

export const calendarsService = new CalendarsService();
