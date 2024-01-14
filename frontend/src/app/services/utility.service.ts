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
}
