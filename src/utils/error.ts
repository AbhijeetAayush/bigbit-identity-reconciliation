import { logger } from './logger';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheError';
  }
}

export function formatError(error: unknown): { statusCode: number; body: string } {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const statusCode = error instanceof ValidationError ? 400 : 500;

  logger.error('Formatted error', { message, statusCode });
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
}