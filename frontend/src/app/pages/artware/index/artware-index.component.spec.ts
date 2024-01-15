import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtwareIndexComponent } from './artware-index.component';

describe('ArtwareIndexComponent', () => {
  let component: ArtwareIndexComponent;
  let fixture: ComponentFixture<ArtwareIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtwareIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtwareIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
