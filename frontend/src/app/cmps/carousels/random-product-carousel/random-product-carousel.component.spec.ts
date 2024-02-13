import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomProductCarouselComponent } from './random-product-carousel.component';

describe('RandomProductsCarouselComponent', () => {
  let component: RandomProductCarouselComponent;
  let fixture: ComponentFixture<RandomProductCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RandomProductCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RandomProductCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
