import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core'
import { CarouselItem } from '../../models/shop'
import { UtilityService } from '../../services/utility.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'edit-preview',
  templateUrl: './edit-preview.component.html'
})

export class EditPreviewComponent implements OnInit {
  @Input() name: string = ''
  @Input() type: string = ''
  @Input() imgUrls: string[] = []
  @Input() price: string = ''
  @Input() stock: number = 0
  @Input() publishDate: string = ''
  @Input() description: string = ''
  @Input() materials: string = ''
  @Input() dimensions: string = ''

  private modService = inject(ModalService)
  private utilService = inject(UtilityService)

  carouselItems: CarouselItem[] = []

  ngOnInit(): void {
    this.carouselItems = this.utilService.convertToCarouselItem(this.imgUrls)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imgUrls']) {
      const change = changes['imgUrls']
      if (change.currentValue !== change.previousValue) {
        this.carouselItems = this.utilService.convertToCarouselItem(this.imgUrls)
      }
    }
  }

  onImageClick(event: Event, imageUrl: string): void {
    event.stopPropagation()
    this.modService.openModal('image-display', imageUrl)
  }
}
