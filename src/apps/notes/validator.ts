import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  laneId: z.string().uuid('Invalid lane ID').optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).trim().optional(),
  content: z.string().min(1).trim().optional(),
  laneId: z.string().uuid('Invalid lane ID').nullable().optional(),
});

export const noteParamsSchema = z.object({
  id: z.string().uuid('Invalid note ID'),
});

export const noteListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  laneId: z.string().uuid().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteListQuery = z.infer<typeof noteListQuerySchema>;
