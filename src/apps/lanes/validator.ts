import { z } from 'zod';

export const createLaneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
});

export const updateLaneSchema = z.object({
  title: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(1000).trim().nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').nullable().optional(),
});

export const laneParamsSchema = z.object({
  id: z.string().uuid('Invalid lane ID'),
});

export type CreateLaneInput = z.infer<typeof createLaneSchema>;
export type UpdateLaneInput = z.infer<typeof updateLaneSchema>;
