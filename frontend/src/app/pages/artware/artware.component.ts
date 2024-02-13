import { Component, HostBinding, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'artware-wrapper',
  templateUrl: './artware.component.html'
})

export class ArtwareComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private dTypeService = inject(DeviceTypeService)
  
  deviceType$: Observable<string> = this.dTypeService.deviceType$
}
