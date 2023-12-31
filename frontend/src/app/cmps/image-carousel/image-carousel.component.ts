import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core'
import { interval, Subscription } from 'rxjs'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
})

export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() imageUrls: string[] = []
  @Input() autoSwitch: boolean = false
  rightArrowIcon: string = 'rightArrowIcon'
  leftArrowIcon: string = 'leftArrowIcon'
  currentIndex: number = 0
  private autoSwitchSubscription: Subscription | null = null

  currentIndexSignal = signal(this.currentIndex)

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
    this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length
    this.currentIndexSignal.set(this.currentIndex)
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.imageUrls.length - 1
    } else this.currentIndex--

    this.currentIndexSignal.set(this.currentIndex)
  }

  goToSlide(index: number): void {
    this.currentIndex = index
    this.currentIndexSignal.set(this.currentIndex)
  }

  getSlideStyle(index: number): object {
    let offset = (index - this.currentIndex) * 100

    if (this.currentIndex === 0 && index === this.imageUrls.length - 1) {
      offset = -100
    } else if (this.currentIndex === this.imageUrls.length - 1 && index === 0) {
      offset = 100
    }

    const opacity = index === this.currentIndex ? 1 : 0
    return { 'transform': `translateX(${offset}%)`, 'opacity': opacity }
  }
}