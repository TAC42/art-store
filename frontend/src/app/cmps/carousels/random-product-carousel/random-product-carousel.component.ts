import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { Observable } from 'rxjs'
import { Product } from '../../../models/shop'

@Component({
  selector: 'random-product-carousel',
  templateUrl: './random-product-carousel.component.html'
})

export class RandomProductCarouselComponent {
  @Input() randomProducts$!: Observable<Product[]>
  @ViewChild('carouselRef', { static: false }) carousel!: ElementRef<HTMLDivElement>

  scrollLeft(event: Event): void {
    event.stopPropagation()
    this.carousel.nativeElement.scrollBy({ left: -200, behavior: 'smooth' })
  }

  scrollRight(event: Event): void {
    event.stopPropagation()
    this.carousel.nativeElement.scrollBy({ left: 200, behavior: 'smooth' })
  }
}
