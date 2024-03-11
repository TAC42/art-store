import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core'
import { CarouselItem } from '../../models/shop'
import { UtilityService } from '../../services/utility.service'

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
  @Input() dateMade: string = ''
  @Input() description: string = ''
  @Input() materials: string = ''
  @Input() dimensions: string = ''

  private utilService = inject(UtilityService)

  public regularUtils = this.utilService
  public carouselItems: CarouselItem[] = []

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
}