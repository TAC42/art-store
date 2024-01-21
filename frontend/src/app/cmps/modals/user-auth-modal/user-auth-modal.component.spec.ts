import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthModalComponent } from './user-auth-modal.component';

describe('UserAuthModalComponent', () => {
  let component: UserAuthModalComponent;
  let fixture: ComponentFixture<UserAuthModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAuthModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
