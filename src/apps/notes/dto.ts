export interface CreateNoteDto {
  title: string;
  content: string;
  laneId?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  laneId?: string | null;
}

export interface NoteResponseDto {
  id: string;
  title: string;
  content: string;
  laneId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  laneId?: string;
}
