export interface CreateCalendarDto {
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  isAllDay?: boolean;
}

export interface UpdateCalendarDto {
  title?: string;
  description?: string | null;
  date?: string;
  endDate?: string | null;
  isAllDay?: boolean;
}

export interface CalendarResponseDto {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  endDate: Date | null;
  isAllDay: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
