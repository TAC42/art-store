import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SculptureIndexComponent } from './sculpture-index.component';

describe('SculptureIndexComponent', () => {
  let component: SculptureIndexComponent;
  let fixture: ComponentFixture<SculptureIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SculptureIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SculptureIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
