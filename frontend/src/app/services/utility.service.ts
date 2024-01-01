import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from './http.service'

const BASE_URL = 'utility/'

@Injectable({
  providedIn: 'root'
})

export class UtilityService {

  constructor(private httpService: HttpService) { }

  sendMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}mail`, formData)
  }
}
