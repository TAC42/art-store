import { Component, HostBinding, inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Observable, map, take } from 'rxjs'
import { Product } from '../../models/shop'
import { DeviceTypeService } from '../../services/device-type.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'showcase-details',
  templateUrl: './showcase-details.component.html'
})

export class ShowcaseDetailsComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private dTypeService = inject(DeviceTypeService)
  private modService = inject(ModalService)

  deviceType$: Observable<string> = this.dTypeService.deviceType$
  product$: Observable<Product> = this.route.data.pipe(
      map(data => data['product'])
  )
  // randomProducts$: Observable<Product[]> = this.store.select(selectRandomProducts)

  // ngOnInit(): void {
  //     this.product$.subscribe(product => {
  //         if (product && product._id) {
  //             this.store.dispatch(LOAD_RANDOM_PRODUCTS({
  //                 productType: product.type,
  //                 excludeProductId: product._id
  //             }))
  //         }
  //     })
  // }

  onBack(event: Event): void {
      event.stopPropagation()
      this.product$.pipe(take(1)).subscribe(
          product => {
              this.router.navigateByUrl(`/${encodeURIComponent(
                  product?.type || 'artware')}`)
          })
  }

  onImageClick(event: Event, imageUrl: string): void {
      event.stopPropagation()
      this.modService.openModal('image-display', imageUrl)
  }

  onInquire(event: Event): void {
      event.stopPropagation()
      this.router.navigateByUrl('/about/contact')
  }
}
