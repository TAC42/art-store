import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, inject } from '@angular/core'
import { interval, Subscription } from 'rxjs'
import { CarouselItem } from '../../../models/utility'
import { Router } from '@angular/router'

@Component({
  selector: 'product-carousel',
  templateUrl: './product-carousel.component.html',
})

export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() carouselItems: CarouselItem[] = []
  @Input() autoSwitch: boolean = false
  @Output() imageClick = new EventEmitter<{ event: Event, imageUrl: string }>()

  private router = inject(Router)

  private autoSwitchSubscription: Subscription | null = null
  public currentIndex: number = 0

  ngOnInit(): void {
    if (this.autoSwitch) this.autoSwitchSubscription = interval(
      10000).subscribe(() => this.nextImage())
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.carouselItems.length - 1
    } else this.currentIndex--
  }

  goToSlide(index: number): void {
    this.currentIndex = index
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