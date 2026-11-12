import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the profile placeholder', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('p')?.textContent).toContain('user-profile works!');
  });
});
