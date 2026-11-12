import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-profile',
  imports: [],
  template: ` <p>user-profile works!</p> `,
  styles: ``
})
export class UserProfile {}
