import { Component, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent {
  private dTypeService = inject(DeviceTypeService)

  deviceType$: Observable<string> = this.dTypeService.deviceType$
}
