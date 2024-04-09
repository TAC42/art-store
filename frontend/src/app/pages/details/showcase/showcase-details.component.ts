import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable, map } from 'rxjs'
import { CarouselItem, Product } from '../../../models/product'
import { DeviceTypeService } from '../../../services/utils/device-type.service'
import { UtilityService } from '../../../services/utils/utility.service'

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

  public regularUtils = this.utilService
  public carouselItems: CarouselItem[] = []

  deviceType$: Observable<string> = this.dTypeService.deviceType$
  product$: Observable<Product> = this.route.data.pipe(
    map(data => data['product']))

  ngOnInit(): void {
    this.product$.subscribe(product => {
      if (product.imgUrls.length > 1) {
        this.carouselItems = this.utilService.convertToCarouselItem(product.imgUrls)
      }
    })
  }

  onInquire(event: Event): void {
    event.stopPropagation()
    this.router.navigateByUrl('/about/contact')
  }
}