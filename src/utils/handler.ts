import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from './logger';
import { formatError } from './error';

export function handler(fn: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const result = await fn(event);
      logger.info('Request processed successfully', { statusCode: result.statusCode });
      return result;
    } catch (error) {
      return formatError(error);
    }
  };
}