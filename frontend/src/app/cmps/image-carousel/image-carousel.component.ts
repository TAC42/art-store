import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { interval, Subscription, BehaviorSubject } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
})

export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() imageUrls: string[] = []
  @Input() autoSwitch: boolean = false
  arrowIcon: string = 'arrowIcon'
  currentIndex: number = 0
  private autoSwitchSubscription: Subscription | null = null

  private currentIndexSubject = new BehaviorSubject<number>(this.currentIndex)
  currentIndexSignal = toSignal(this.currentIndexSubject.asObservable())

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
    this.currentIndexSubject.next(this.currentIndex)
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.imageUrls.length - 1
    } else this.currentIndex--

    this.currentIndexSubject.next(this.currentIndex)
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