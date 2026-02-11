import type { Request, Response } from 'express';
import { notesService } from './service.js';
import { ApiResponse } from '../../libs/shared/response/index.js';
import type { CreateNoteDto, UpdateNoteDto, NoteListQueryDto } from './dto.js';

export class NotesHandler {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const data = req.body as CreateNoteDto;
    const note = await notesService.create(userId, data);
    ApiResponse.created(res, note, 'Note created successfully');
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const query = req.query as unknown as NoteListQueryDto;
    const { data, pagination } = await notesService.findAll(userId, query);
    ApiResponse.paginated(res, data, pagination);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const note = await notesService.findById(userId, id!);
    ApiResponse.success(res, note);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body as UpdateNoteDto;
    const note = await notesService.update(userId, id!, data);
    ApiResponse.success(res, note, 'Note updated successfully');
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const { id } = req.params;
    await notesService.delete(userId, id!);
    ApiResponse.noContent(res);
  }
}

export const notesHandler = new NotesHandler();
