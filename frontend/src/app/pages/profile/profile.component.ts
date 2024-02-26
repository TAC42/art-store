import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { selectLoggedinUser } from '../../store/user.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { DeviceTypeService } from '../../services/device-type.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private store = inject(Store<AppState>)
  private dTypeService = inject(DeviceTypeService)

  loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  deviceType$: Observable<string> = this.dTypeService.deviceType$
}
