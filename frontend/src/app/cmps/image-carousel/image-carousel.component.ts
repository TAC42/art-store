import { Component, Input } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
})

export class ImageCarouselComponent {
  @Input() imageUrls: string[] = []
  arrowIcon: string = 'arrowIcon'
  currentIndex: number = 0

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length
  }

  previousImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.imageUrls.length - 1
    } else this.currentIndex--
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