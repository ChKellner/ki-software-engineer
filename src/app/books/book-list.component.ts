import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, merge, of, Subject, startWith, switchMap, timer } from 'rxjs';
import { ErrorReportingService } from '../shared/error-reporting.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { BookItemComponent } from './book-item.component';

type BookListState = { status: 'loading' } | { status: 'loaded'; books: Book[] } | { status: 'error' };
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BookItemComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  @Input() pageSize = 10;
  state: BookListState = { status: 'loading' };
  searchTerm = '';
  private readonly destroyRef = inject(DestroyRef);
  private readonly searches = new Subject<string>();
  private readonly retries = new Subject<void>();
  constructor(
    private bookApiClient: BookApiClient,
    private errors: ErrorReportingService
  ) {}
  ngOnInit(): void {
    const terms = this.searches.pipe(startWith(''), distinctUntilChanged());
    merge(terms, this.retries.pipe(map(() => this.searchTerm)))
      .pipe(
        switchMap(term =>
          (term ? timer(300) : of(0)).pipe(
            switchMap(() =>
              this.bookApiClient.getBooks(this.pageSize, term).pipe(
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
      .subscribe(state => (this.state = state));
  }
  onSearchChange(): void {
    this.searches.next(this.searchTerm);
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.searches.next('');
  }
  retry(): void {
    this.retries.next();
  }
  trackById(index: number, book: Book): string {
    return book.id;
  }
}
