import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core'
import { Observable, map } from 'rxjs'
import { MiniProduct, Product } from '../../../models/shop'
import { ImageLoadService } from '../../../services/image-load.service'

@Component({
  selector: 'random-product-carousel',
  templateUrl: './random-product-carousel.component.html'
})

export class RandomProductCarouselComponent implements OnInit {
  @Input() randomProducts$!: Observable<Product[]>
  @ViewChild('carouselRef', { static: false }) carousel!: ElementRef<HTMLDivElement>

  CarouselItems$!: Observable<MiniProduct[]>

  private imgLoadService = inject(ImageLoadService)

  ngOnInit(): void {
    this.CarouselItems$ = this.randomProducts$.pipe(
      map(products => products.map(product => ({
        lowResImgUrl: this.imgLoadService.getLowResImageUrl(product.imgUrls[0]),
        imgUrl: product.imgUrls[0],
        name: product.name,
        url: `/shop/details/${product.name}`
      }))),
    )
    this.preloadCarouselItems()
  }

  preloadCarouselItems(): void {
    this.CarouselItems$.subscribe(carouselItems => {
      const imgUrls = carouselItems.map(item => item.imgUrl)
      this.imgLoadService.preloadImagesArray(imgUrls)
    })
  }

  onImageLoad(event: Event, lowResImageElement: HTMLElement): void {
    const highResImgElement = event.target as HTMLImageElement
    lowResImageElement.style.display = 'none'
    highResImgElement.style.display = 'block'
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