export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: 'INFO', message, context }));
  },
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(JSON.stringify({ level: 'ERROR', message, context }));
  },
};