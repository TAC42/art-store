import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseDetailsComponent } from './showcase-details.component';

describe('ShowcaseDetailsComponent', () => {
  let component: ShowcaseDetailsComponent;
  let fixture: ComponentFixture<ShowcaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowcaseDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowcaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
