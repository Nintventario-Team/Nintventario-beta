import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccountComponent } from './user-account.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AuthService } from '../../../services/auth.service'; // Ensure AuthService is imported
import { User } from '../../../interfaces/user'; // Assuming 'user.ts' defines the User interface

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserAccountComponent,  
        HttpClientTestingModule 
      ],
      providers: [AuthService], 
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
    // Mock data matching the User interface
    component.userInfo = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    } as User;
    
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
