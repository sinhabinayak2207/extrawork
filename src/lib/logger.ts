/**
 * Simple logging utility for system messages
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error';

/**
 * Log a message to the console and optionally to a system log
 * @param message The message to log
 * @param level The log level (info, success, warning, error)
 */
export const logToSystem = (message: string, level: LogLevel = 'info'): void => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  // Console logging with colors
  switch (level) {
    case 'success':
      console.log(`%c${formattedMessage}`, 'color: green');
      break;
    case 'warning':
      console.warn(formattedMessage);
      break;
    case 'error':
      console.error(formattedMessage);
      break;
    case 'info':
    default:
      console.log(formattedMessage);
      break;
  }
  
  // Dispatch event for any listeners (like admin panels)
  try {
    window.dispatchEvent(new CustomEvent('systemLog', {
      detail: {
        message,
        level,
        timestamp
      }
    }));
  } catch (error) {
    // Silently fail if we're in a non-browser environment
  }
};

/**
 * Log an error with its stack trace
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  const contextPrefix = context ? `[${context}] ` : '';
  logToSystem(`${contextPrefix}${errorMessage}`, 'error');
  
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
};
