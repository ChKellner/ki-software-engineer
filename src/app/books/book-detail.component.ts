import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, distinctUntilChanged, map, of, Subject, startWith, switchMap } from 'rxjs';
import { ErrorReportingService } from '../shared/error-reporting.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { BookCoverComponent } from './book-cover.component';

type BookDetailState =
  | { status: 'loading' }
  | { status: 'loaded'; book: Book }
  | { status: 'not-found' }
  | { status: 'error' };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-book-detail',
  imports: [RouterLink, BookCoverComponent],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  readonly state = signal<BookDetailState>({ status: 'loading' });
  private readonly destroyRef = inject(DestroyRef);
  private readonly retryRequests = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly bookApiClient = inject(BookApiClient);
  private readonly errors = inject(ErrorReportingService);
  ngOnInit(): void {
    combineLatest([
      this.route.paramMap.pipe(
        map(params => params.get('id')),
        distinctUntilChanged()
      ),
      this.retryRequests.pipe(startWith(undefined))
    ])
      .pipe(
        switchMap(([id]) =>
          id
            ? this.bookApiClient.getBook(id).pipe(
                map((book): BookDetailState => ({ status: 'loaded', book })),
                catchError((error: unknown) => {
                  if (error instanceof HttpErrorResponse && error.status === 404)
                    return of<BookDetailState>({ status: 'not-found' });
                  this.errors.report(error);
                  return of<BookDetailState>({ status: 'error' });
                }),
                startWith<BookDetailState>({ status: 'loading' })
              )
            : of<BookDetailState>({ status: 'not-found' })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(state => this.state.set(state));
  }
  retry(): void {
    this.retryRequests.next();
  }
}
