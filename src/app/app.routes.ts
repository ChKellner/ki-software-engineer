import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./books/book-list.component').then(m => m.BookListComponent) },
  { path: 'books/:id', loadComponent: () => import('./books/book-detail.component').then(m => m.BookDetailComponent) },
  {
    path: 'book-suggestions',
    loadComponent: () => import('./books/book-suggestion.component').then(m => m.BookSuggestionComponent)
  },
  { path: '**', redirectTo: '' }
];
