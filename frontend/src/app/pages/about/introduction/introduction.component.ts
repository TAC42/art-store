import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { ModalService } from '../../../services/modal.service'
import { CarouselItem } from '../../../models/shop'
import { UtilityService } from '../../../services/utility.service'

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html'
})

export class IntroductionComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private modService = inject(ModalService)
  private utilService = inject(UtilityService)

  carouselItems: CarouselItem[] = []
  aboutImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880473/Artware/qminrkpf5nftfmnredx5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/zion4h33enmpgxvz0yqa.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880472/Artware/yfpb9qax5r3qvqz2kc6c.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880476/Artware/jloyblpg0ith2jnudq9z.png'
  ]

  ngOnInit() {
    this.carouselItems = this.utilService.convertToCarouselItem(this.aboutImageUrls)
  }

  onImageClick(event: Event, imageUrl: string): void {
    event.stopPropagation()
    this.modService.openModal('image-display', imageUrl)
  }
}
