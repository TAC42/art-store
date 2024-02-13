import { Component, HostBinding, inject } from '@angular/core'
import { DeviceTypeService } from '../../services/device-type.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'sculpture-wrapper',
  templateUrl: './sculpture.component.html'
})

export class SculptureComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private dTypeService = inject(DeviceTypeService)

  deviceType$: Observable<string> = this.dTypeService.deviceType$
}
