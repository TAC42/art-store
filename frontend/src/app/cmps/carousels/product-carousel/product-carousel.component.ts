import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core'
import { Subscription, interval } from 'rxjs'
import { MiniProduct } from '../../../models/shop'

@Component({
  selector: 'product-carousel',
  templateUrl: './product-carousel.component.html'
})

export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() products: MiniProduct[] = []
  @Input() autoSwitch: boolean = false

  currentIndex: number = 0

  private autoSwitchSubscription: Subscription | null = null
  public currentIndexSignal = signal(this.currentIndex)

  ngOnInit() {
    if (this.autoSwitch) {
      this.autoSwitchSubscription = interval(10000).subscribe(() => {
        this.nextImage()
      })
    }
  }

  ngOnDestroy() {
    if (this.autoSwitchSubscription) {
      this.autoSwitchSubscription.unsubscribe()
    }
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.products.length
    this.currentIndexSignal.set(this.currentIndex)
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.products.length - 1
    } else this.currentIndex--

    this.currentIndexSignal.set(this.currentIndex)
  }

  goToSlide(index: number): void {
    this.currentIndex = index
    this.currentIndexSignal.set(this.currentIndex)
  }

  getSlideStyle(index: number): object {
    let offset = (index - this.currentIndex) * 100

    if (this.currentIndex === 0 && index === this.products.length - 1) {
      offset = -100
    } else if (this.currentIndex === this.products.length - 1 && index === 0) {
      offset = 100
    }

    const opacity = index === this.currentIndex ? 1 : 0
    return { 'transform': `translateX(${offset}%)`, 'opacity': opacity }
  }
}
