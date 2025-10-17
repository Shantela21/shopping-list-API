import { ServerResponse } from "http";

// Response interfaces for consistency
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Reusable response handlers
export class ResponseHandler {
  private static sendResponse(res: ServerResponse, statusCode: number, body: ApiResponse) {
    res.writeHead(statusCode, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }

  // Success responses
  static success<T>(res: ServerResponse, data: T, message?: string, statusCode: number = 200) {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      ...(message && { message })
    };
    this.sendResponse(res, statusCode, response);
  }

  static created<T>(res: ServerResponse, data: T, message?: string) {
    this.success(res, data, message, 201);
  }

  static noContent(res: ServerResponse) {
    res.writeHead(204);
    res.end();
  }

  // Error responses
  static badRequest(res: ServerResponse, error: string) {
    const response: ErrorResponse = {
      success: false,
      error
    };
    this.sendResponse(res, 400, response);
  }

  static notFound(res: ServerResponse, error: string = "Resource not found") {
    const response: ErrorResponse = {
      success: false,
      error
    };
    this.sendResponse(res, 404, response);
  }

  static methodNotAllowed(res: ServerResponse, error: string = "Method not allowed") {
    const response: ErrorResponse = {
      success: false,
      error
    };
    this.sendResponse(res, 405, response);
  }

  static internalServerError(res: ServerResponse, error: string = "Internal server error") {
    const response: ErrorResponse = {
      success: false,
      error
    };
    this.sendResponse(res, 500, response);
  }
}

// Validation helpers
export class ValidationHelper {
  static isValidId(id: any): boolean {
    return !isNaN(id) && Number.isInteger(Number(id)) && Number(id) >= 0;
  }

  static isValidString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && value >= 0;
  }

  static isValidBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }
}
