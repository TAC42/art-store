import { Injectable } from '@angular/core'
import { BehaviorSubject, fromEvent } from 'rxjs'
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class DeviceTypeService {
  private deviceTypeSubject = new BehaviorSubject<string>(this.getDeviceType(window.innerWidth))
  deviceType$ = this.deviceTypeSubject.asObservable()

  constructor() {
    fromEvent(window, 'resize')
      .pipe(map(() => this.getDeviceType(window.innerWidth)))
      .subscribe(this.deviceTypeSubject)
  }

  private getDeviceType(width: number): string {
    if (width <= 480) return 'mobile'
    else if (width <= 600) return 'mini-tablet'
    else if (width <= 900) return 'tablet'
    return 'desktop'
  }
}