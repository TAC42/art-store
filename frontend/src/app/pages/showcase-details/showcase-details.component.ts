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

  onImageClick(event: Event, imageUrl: string): void {
      event.stopPropagation()
      this.modService.openModal('image-display', imageUrl)
  }

  onInquire(event: Event): void {
      event.stopPropagation()
      this.router.navigateByUrl('/about/contact')
  }
}
