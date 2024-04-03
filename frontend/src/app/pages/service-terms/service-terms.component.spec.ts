import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTermsComponent } from './service-terms.component';

describe('ServiceTermsComponent', () => {
  let component: ServiceTermsComponent;
  let fixture: ComponentFixture<ServiceTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceTermsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
