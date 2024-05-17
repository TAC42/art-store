import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Observable, map } from 'rxjs'
import { MiniProduct, Product } from '../../../models/product'

@Component({
  selector: 'random-product-carousel',
  templateUrl: './random-product-carousel.component.html'
})

export class RandomProductCarouselComponent implements OnInit {
  @Input() randomProducts$!: Observable<Product[]>
  @ViewChild('carouselRef', { static: false }) carousel!: ElementRef<HTMLDivElement>

  CarouselItems$!: Observable<MiniProduct[]>

  ngOnInit(): void {
    this.CarouselItems$ = this.randomProducts$.pipe(
      map(products => products.map(product => ({
        imgUrl: product.imgUrls[0],
        name: product.name,
        url: `/shop/details/${product.name}`
      }))),
    )
  }

  scrollLeft(event: Event): void {
    event.stopPropagation()
    this.carousel.nativeElement.scrollBy({ left: -200, behavior: 'smooth' })
  }

  scrollRight(event: Event): void {
    event.stopPropagation()
    this.carousel.nativeElement.scrollBy({ left: 200, behavior: 'smooth' })
  }
}