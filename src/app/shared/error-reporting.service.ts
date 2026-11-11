import { ErrorHandler, Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ErrorReportingService {
  report(error: unknown): void {
    console.error('Application error:', error);
  }
}
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errors: ErrorReportingService) {}
  handleError(error: unknown): void {
    this.errors.report(error);
  }
}
