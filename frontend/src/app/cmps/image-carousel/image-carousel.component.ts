import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html'
})

export class ImageCarouselComponent {
  @Input() imageUrls: string[] = []
  arrowIcon: string = 'arrowIcon'
  currentIndex: number = 0

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length
  }

  previousImage(): void {
    this.currentIndex = this.currentIndex > 0
      ? this.currentIndex - 1 : this.imageUrls.length - 1
  }
}