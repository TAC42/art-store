import { Component, OnInit, inject } from '@angular/core'
import { CarouselItem } from '../../../models/utility'
import { UtilityService } from '../../../services/utils/utility.service'

@Component({
  selector: 'introduction-page',
  templateUrl: './introduction.component.html',
  host: { 'class': 'layout-row w-h-100' }
})

export class IntroductionComponent implements OnInit {
  private utilService = inject(UtilityService)

  public regularUtils = this.utilService
  public carouselItems: CarouselItem[] = []

  aboutImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716238441/Artware/sutxzsqlom0u9xkbnbu3.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716239384/Artware/ebhjjmdmasox7xwslsks.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716239100/Artware/nyu8783gdrlkdyxx74tv.avif',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716239656/Artware/ysfq44vnd8xula8qy9pw.avif'
  ]

  ngOnInit(): void {
    this.carouselItems = this.utilService.convertToCarouselItem(this.aboutImageUrls)
  }
}