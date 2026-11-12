import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-book-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (src() && !failed()) {
      <img [src]="src()" [alt]="alt()" [class]="imageClass()" (error)="failed.set(true)" />
    } @else {
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-500 text-sm font-medium">No cover available</span>
      </div>
    }`
})
export class BookCoverComponent {
  readonly src = input('');
  readonly alt = input('');
  readonly imageClass = input('');
  protected readonly failed = linkedSignal({ source: this.src, computation: () => false });
}
