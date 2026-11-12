import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorReportingService } from '../shared/error-reporting.service';
import { BookApiClient } from './book-api-client.service';

type SuggestionState = 'idle' | 'submitting' | 'submitted' | 'error';

@Component({
  selector: 'app-book-suggestion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-suggestion.component.html'
})
export class BookSuggestionComponent {
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    author: new FormControl('', { nonNullable: true, validators: Validators.required })
  });
  readonly state = signal<SuggestionState>('idle');
  private readonly destroyRef = inject(DestroyRef);
  private readonly bookApiClient = inject(BookApiClient);
  private readonly errors = inject(ErrorReportingService);

  submit(): void {
    if (this.form.invalid || this.state() === 'submitting' || this.state() === 'submitted') return;

    this.state.set('submitting');
    this.form.disable();
    this.bookApiClient
      .submitSuggestion(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.state.set('submitted'),
        error: (error: unknown) => {
          this.errors.report(error);
          this.form.enable();
          this.state.set('error');
        }
      });
  }
}
