import { prisma } from '../../libs/shared/db/index.js';
import { NotFoundError } from '../../libs/shared/errors/index.js';
import { logger } from '../../libs/shared/logger/index.js';
import type { CreateNoteDto, UpdateNoteDto, NoteResponseDto, NoteListQueryDto } from './dto.js';
import type { PaginationMeta } from '../../libs/shared/response/index.js';

export class NotesService {
  async create(userId: string, data: CreateNoteDto): Promise<NoteResponseDto> {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        laneId: data.laneId,
        userId,
      },
    });

    logger.info({ noteId: note.id, userId }, 'Note created');
    return note;
  }

  async findAll(
    userId: string,
    query: NoteListQueryDto,
  ): Promise<{ data: NoteResponseDto[]; pagination: PaginationMeta }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.laneId && { laneId: query.laneId }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { content: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.note.count({ where }),
    ]);

    return {
      data: notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, id: string): Promise<NoteResponseDto> {
    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundError('Note not found');
    }

    return note;
  }

  async update(userId: string, id: string, data: UpdateNoteDto): Promise<NoteResponseDto> {
    await this.findById(userId, id);

    const updated = await prisma.note.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.laneId !== undefined && { laneId: data.laneId }),
      },
    });

    logger.info({ noteId: id, userId }, 'Note updated');
    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);

    await prisma.note.delete({ where: { id } });
    logger.info({ noteId: id, userId }, 'Note deleted');
  }
}

export const notesService = new NotesService();
