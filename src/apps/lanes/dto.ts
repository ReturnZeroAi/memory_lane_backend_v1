export interface CreateLaneDto {
  title: string;
  description?: string;
  color?: string;
}

export interface UpdateLaneDto {
  title?: string;
  description?: string | null;
  color?: string | null;
}

export interface LaneResponseDto {
  id: string;
  title: string;
  description: string | null;
  color: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
