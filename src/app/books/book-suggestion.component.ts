import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorReportingService } from '../shared/error-reporting.service';
import { BookApiClient, BookSuggestion } from './book-api-client.service';

type SuggestionState = 'idle' | 'submitting' | 'submitted' | 'error';

@Component({
  selector: 'app-book-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-suggestion.component.html'
})
export class BookSuggestionComponent {
  suggestion: BookSuggestion = { title: '', author: '' };
  state: SuggestionState = 'idle';
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private bookApiClient: BookApiClient,
    private errors: ErrorReportingService
  ) {}

  submit(form: NgForm): void {
    if (!form.valid || this.state === 'submitting' || this.state === 'submitted') return;

    this.state = 'submitting';
    this.bookApiClient
      .submitSuggestion({ ...this.suggestion })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => (this.state = 'submitted'),
        error: (error: unknown) => {
          this.errors.report(error);
          this.state = 'error';
        }
      });
  }
}
