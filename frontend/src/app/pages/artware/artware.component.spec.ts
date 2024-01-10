import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtwareComponent } from './artware.component';

describe('ArtwareComponent', () => {
  let component: ArtwareComponent;
  let fixture: ComponentFixture<ArtwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtwareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
