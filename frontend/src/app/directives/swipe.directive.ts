import { Directive, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({
  selector: '[customSwipe]'
})

export class SwipeDirective {
  touchStartX = 0
  touchEndX = 0

  @Output() swipeLeft = new EventEmitter<void>()
  @Output() swipeRight = new EventEmitter<void>()

  @HostListener('touchstart', ['$event']) onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX
  }

  @HostListener('touchmove', ['$event']) onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX
  }

  @HostListener('touchend') onTouchEnd() {
    if (this.touchStartX - this.touchEndX > 100) {
      this.swipeRight.emit()
    } else if (this.touchEndX - this.touchStartX > 100) {
      this.swipeLeft.emit()
    }
  }
}
