import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

export const BOOK_API_BASE_URL = new InjectionToken<string>('Book API base URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:4730'
});

export interface BookSuggestion {
  title: string;
  author: string;
}

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly apiUrl: string;
  private readonly suggestionsUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BOOK_API_BASE_URL) baseUrl: string
  ) {
    this.apiUrl = `${baseUrl.replace(/\/$/, '')}/books`;
    this.suggestionsUrl = `${baseUrl.replace(/\/$/, '')}/book-suggestions`;
  }

  getBooks(pageSize: number = 10, searchTerm?: string): Observable<Book[]> {
    let params = new HttpParams().set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }

  submitSuggestion(suggestion: BookSuggestion): Observable<void> {
    return this.http.post<void>(this.suggestionsUrl, suggestion);
  }
}
