import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { UtilityService } from '../../../services/utility.service'
import { CarouselItem } from '../../../models/shop'

@Component({
  selector: 'introduction-page',
  templateUrl: './introduction.component.html'
})

export class IntroductionComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private utilService = inject(UtilityService)

  public regularUtils = this.utilService
  public carouselItems: CarouselItem[] = []
  aboutImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1707577522/artware/ecwol6n9wyog6jryjxis.jpg',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/zion4h33enmpgxvz0yqa.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880472/Artware/yfpb9qax5r3qvqz2kc6c.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880476/Artware/jloyblpg0ith2jnudq9z.png'
  ]

  ngOnInit() {
    this.carouselItems = this.utilService.convertToCarouselItem(this.aboutImageUrls)
  }
}