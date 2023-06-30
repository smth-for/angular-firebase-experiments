import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptUserPasswordComponent } from './prompt-user-password.component';

describe('PromptUserPasswordComponent', () => {
  let component: PromptUserPasswordComponent;
  let fixture: ComponentFixture<PromptUserPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptUserPasswordComponent]
    });
    fixture = TestBed.createComponent(PromptUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
