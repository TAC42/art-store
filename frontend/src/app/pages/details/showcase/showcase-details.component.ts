import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable, map } from 'rxjs'
import { CarouselItem, Product } from '../../../models/shop'
import { DeviceTypeService } from '../../../services/device-type.service'
import { UtilityService } from '../../../services/utility.service'
import { ImageLoadService } from '../../../services/image-load.service'

@Component({
  selector: 'showcase-details',
  templateUrl: './showcase-details.component.html'
})

export class ShowcaseDetailsComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private dTypeService = inject(DeviceTypeService)
  private utilService = inject(UtilityService)
  private imgLoadService = inject(ImageLoadService)

  public regularUtils = this.utilService
  public carouselItems: CarouselItem[] = []
  public loneImgLowRes: string = ''

  deviceType$: Observable<string> = this.dTypeService.deviceType$
  product$: Observable<Product> = this.route.data.pipe(
    map(data => data['product']))

  ngOnInit(): void {
    this.product$.subscribe(product => {
      if (product.imgUrls.length > 1) {
        this.carouselItems = this.utilService.convertToCarouselItem(product.imgUrls)
        this.imgLoadService.preloadCarouselItems(this.carouselItems)
      } else if (product.imgUrls.length === 1) {
        const loneImgUrl = product.imgUrls[0]
        this.loneImgLowRes = this.imgLoadService.getLowResImageUrl(loneImgUrl)
        this.imgLoadService.preloadSingleImage(loneImgUrl)
      }
    })
  }

  onImageLoad(event: Event, lowResImage: HTMLElement): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.style.display = 'block'
    lowResImage.style.display = 'none'
  }

  onInquire(event: Event): void {
    event.stopPropagation()
    this.router.navigateByUrl('/about/contact')
  }
}