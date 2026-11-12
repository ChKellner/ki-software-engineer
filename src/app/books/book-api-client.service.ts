import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
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
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BOOK_API_BASE_URL).replace(/\/$/, '');
  private readonly apiUrl = `${this.baseUrl}/books`;
  private readonly suggestionsUrl = `${this.baseUrl}/book-suggestions`;

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
