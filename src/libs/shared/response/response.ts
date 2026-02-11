import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponseMeta {
  success: boolean;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ApiResponseBody<T = unknown> {
  meta: ApiResponseMeta;
  data: T;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = StatusCodes.OK,
  ): Response {
    const body: ApiResponseBody<T> = {
      meta: {
        success: true,
        ...(message && { message }),
      },
      data,
    };
    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return ApiResponse.success(res, data, message, StatusCodes.CREATED);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message?: string,
  ): Response {
    const body: ApiResponseBody<T[]> = {
      meta: {
        success: true,
        ...(message && { message }),
        pagination,
      },
      data,
    };
    return res.status(StatusCodes.OK).json(body);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errors?: unknown,
  ): Response {
    const body: ApiResponseBody<null> = {
      meta: {
        success: false,
        message,
      },
      data: errors ?? null,
    };
    return res.status(statusCode).json(body);
  }

  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
