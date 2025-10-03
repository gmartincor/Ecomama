import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiError = {
  message: string;
  statusCode: number;
};

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Datos inválidos') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto de recursos') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class ApiResponse {
  static success<T>(data: T, statusCode: number = 200) {
    return NextResponse.json(data, { status: statusCode });
  }

  static created<T>(data: T) {
    return this.success(data, 201);
  }

  static error(message: string, statusCode: number = 500) {
    return NextResponse.json({ error: message }, { status: statusCode });
  }

  static unauthorized(message: string = 'No autorizado') {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Acceso denegado') {
    return this.error(message, 403);
  }

  static notFound(message: string = 'Recurso no encontrado') {
    return this.error(message, 404);
  }

  static badRequest(message: string = 'Solicitud inválida') {
    return this.error(message, 400);
  }

  static conflict(message: string = 'Conflicto de recursos') {
    return this.error(message, 409);
  }

  static internalError(message: string = 'Error interno del servidor') {
    return this.error(message, 500);
  }
}

const formatZodError = (error: ZodError): string => {
  const firstError = error.issues[0];
  return firstError?.message || 'Datos inválidos';
};

export const handleApiError = (error: unknown): NextResponse => {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return ApiResponse.badRequest(formatZodError(error));
  }

  if (error instanceof AppError) {
    return ApiResponse.error(error.message, error.statusCode);
  }

  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    const apiError = error as ApiError;
    return ApiResponse.error(apiError.message, apiError.statusCode);
  }

  if (error instanceof Error) {
    return ApiResponse.internalError(process.env.NODE_ENV === 'development' ? error.message : undefined);
  }

  return ApiResponse.internalError();
};
