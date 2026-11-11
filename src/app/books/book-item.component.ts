import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from './book';
import { BookCoverComponent } from './book-cover.component';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCoverComponent],
  templateUrl: './book-item.component.html'
})
export class BookItemComponent {
  @Input() book!: Book;
}
