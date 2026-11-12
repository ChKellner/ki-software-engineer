import { ErrorHandler, Injectable, inject } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ErrorReportingService {
  report(error: unknown): void {
    console.error('Application error:', error);
  }
}
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errors = inject(ErrorReportingService);
  handleError(error: unknown): void {
    this.errors.report(error);
  }
}
