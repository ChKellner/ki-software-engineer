import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list.component';
import { BookDetailComponent } from './books/book-detail.component';
import { BookSuggestionComponent } from './books/book-suggestion.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'book-suggestions', component: BookSuggestionComponent },
  { path: '**', redirectTo: '' }
];
