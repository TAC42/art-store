import { Component, Input, OnInit, OnDestroy, signal, EventEmitter, Output, inject } from '@angular/core'
import { interval, Subscription } from 'rxjs'
import { CarouselItem } from '../../../models/shop'
import { Router } from '@angular/router'
import { ImageLoadService } from '../../../services/image-load.service'

@Component({
  selector: 'product-carousel',
  templateUrl: './product-carousel.component.html',
})

export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() carouselItems: CarouselItem[] = []
  @Input() autoSwitch: boolean = false
  @Output() imageClick = new EventEmitter<{ event: Event, imageUrl: string }>()

  private router = inject(Router)
  private imgLoadService = inject(ImageLoadService)
  currentIndex: number = 0

  private autoSwitchSubscription: Subscription | null = null
  public currentIndexSignal = signal(this.currentIndex)

  ngOnInit(): void {
    if (this.autoSwitch) this.autoSwitchSubscription = interval(
      10000).subscribe(() => this.nextImage())
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length
    this.currentIndexSignal.set(this.currentIndex)
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.carouselItems.length - 1
    } else this.currentIndex--

    this.currentIndexSignal.set(this.currentIndex)
  }

  goToSlide(index: number): void {
    this.currentIndex = index
    this.currentIndexSignal.set(this.currentIndex)
  }

  getSlideStyle(index: number): object {
    let offset = (index - this.currentIndex) * 100

    if (this.currentIndex === 0 &&
      index === this.carouselItems.length - 1) offset = -100
    else if (this.currentIndex === this.carouselItems.length - 1 &&
      index === 0) offset = 100

    const opacity = index === this.currentIndex ? 1 : 0
    return { 'transform': `translateX(${offset}%)`, 'opacity': opacity }
  }

  onItemClicked(event: Event, carouselItem: CarouselItem): void {
    if (carouselItem.type === 'image') this.imageClick.emit(
      { event: event, imageUrl: carouselItem.imgUrl })
    else if (carouselItem.url) this.router.navigate([carouselItem.url])
  }

  ngOnDestroy() {
    if (this.autoSwitchSubscription) this.autoSwitchSubscription.unsubscribe()
  }
}