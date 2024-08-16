import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChangeConfirmationComponent } from './email-change-confirmation.component';

describe('EmailChangeConfirmationComponent', () => {
  let component: EmailChangeConfirmationComponent;
  let fixture: ComponentFixture<EmailChangeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailChangeConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailChangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
