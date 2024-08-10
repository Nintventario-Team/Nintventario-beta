import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccountComponent } from './user-account.component';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    component.userInfo = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    };
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#first-name').value).toBe('John');
    expect(compiled.querySelector('#last-name').value).toBe('Doe');
    expect(compiled.querySelector('#email').value).toBe('john.doe@example.com');
  });

  it('should call logout when logout button is clicked', () => {
    spyOn(component, 'logout');
    const button = fixture.debugElement.nativeElement.querySelector('.button-container button');
    button.click();
    expect(component.logout).toHaveBeenCalled();
  });
});
