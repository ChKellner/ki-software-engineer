import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'app-book-cover',
  standalone: true,
  imports: [CommonModule],
  template: `<img
      *ngIf="src && !failed; else fallback"
      [src]="src"
      [alt]="alt"
      [class]="imageClass"
      (error)="failed = true"
    /><ng-template #fallback
      ><div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-500 text-sm font-medium">No cover available</span>
      </div></ng-template
    >`
})
export class BookCoverComponent implements OnChanges {
  @Input() src = '';
  @Input() alt = '';
  @Input() imageClass = '';
  failed = false;
  ngOnChanges(): void {
    this.failed = false;
  }
}
