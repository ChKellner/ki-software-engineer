import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, merge, of, Subject, startWith, switchMap, timer } from 'rxjs';
import { ErrorReportingService } from '../shared/error-reporting.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { BookItemComponent } from './book-item.component';

type BookListState = { status: 'loading' } | { status: 'loaded'; books: Book[] } | { status: 'error' };
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-book-list',
  imports: [ReactiveFormsModule, RouterLink, BookItemComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  readonly pageSize = input(10);
  readonly state = signal<BookListState>({ status: 'loading' });
  readonly search = new FormControl('', { nonNullable: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly retries = new Subject<void>();
  private readonly bookApiClient = inject(BookApiClient);
  private readonly errors = inject(ErrorReportingService);
  ngOnInit(): void {
    const terms = this.search.valueChanges.pipe(startWith(this.search.value), distinctUntilChanged());
    merge(terms, this.retries.pipe(map(() => this.search.value)))
      .pipe(
        switchMap(term =>
          (term ? timer(300) : of(0)).pipe(
            switchMap(() =>
              this.bookApiClient.getBooks(this.pageSize(), term).pipe(
                map((books): BookListState => ({ status: 'loaded', books })),
                catchError((error: unknown) => {
                  this.errors.report(error);
                  return of<BookListState>({ status: 'error' });
                })
              )
            ),
            startWith<BookListState>({ status: 'loading' })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(state => this.state.set(state));
  }
  clearSearch(): void {
    this.search.setValue('');
  }
  retry(): void {
    this.retries.next();
  }
}
