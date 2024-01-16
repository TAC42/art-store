import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from './http.service'

const BASE_URL = 'utility/'

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  private httpService = inject(HttpService)

  sendMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}mail`, formData)
  }

  getRandomMidColor(): string {
    const letters = '3456789ABC'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10)]
    }
    return color
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
