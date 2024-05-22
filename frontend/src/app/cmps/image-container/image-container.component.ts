import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { ImageLoadService } from '../../services/media/image-load.service'

@Component({
  selector: 'image-container',
  templateUrl: './image-container.component.html',
})

export class ImageContainerComponent implements OnInit {
  @Input() highResImageUrl!: string
  @Input() alt: string = 'Loading...'
  @Output() imageClick = new EventEmitter<{ event: Event, imageUrl?: string }>()

  private imgLoadService = inject(ImageLoadService)

  public lowResImgUrl: string = ''

  ngOnInit(): void {
    this.lowResImgUrl = this.imgLoadService.getLowResImageUrl(this.highResImageUrl)
    this.imgLoadService.preloadSingleImage(this.lowResImgUrl)
  }

  onImageLoad(event: Event, lowResImage: HTMLElement): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.style.display = 'block'
    lowResImage.style.display = 'none'
  }

  onImageClick(event: Event, imageUrl?: string): void {
    this.imageClick.emit({ event: event, imageUrl: imageUrl })
  }
}