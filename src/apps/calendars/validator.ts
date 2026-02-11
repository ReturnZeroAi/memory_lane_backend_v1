import { z } from 'zod';

export const createCalendarSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).trim(),
  description: z.string().max(2000).trim().optional(),
  date: z.string().datetime({ message: 'Date must be a valid ISO 8601 datetime' }),
  endDate: z.string().datetime({ message: 'End date must be a valid ISO 8601 datetime' }).optional(),
  isAllDay: z.boolean().default(false),
});

export const updateCalendarSchema = z.object({
  title: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(2000).trim().nullable().optional(),
  date: z.string().datetime().optional(),
  endDate: z.string().datetime().nullable().optional(),
  isAllDay: z.boolean().optional(),
});

export const calendarParamsSchema = z.object({
  id: z.string().uuid('Invalid calendar ID'),
});

export type CreateCalendarInput = z.infer<typeof createCalendarSchema>;
export type UpdateCalendarInput = z.infer<typeof updateCalendarSchema>;
