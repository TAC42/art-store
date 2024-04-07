import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Order } from '../models/order'
import { HttpService } from './http.service'

const BASE_URL = 'mail/'

@Injectable({
  providedIn: 'root'
})

export class MailService {
  private httpService = inject(HttpService)

  sendContactUsMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/contact`, formData)
  }

  sendVerificationMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/verify`, formData)
  }

  sendResetCodeMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/reset`, formData)
  }

  sendUserUpdatedMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/user-reset`, formData)
  }

  sendInvoiceMails(orderDetails: Order): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/invoice`, orderDetails)
  }

  sendOrderUpdateMail(orderDetails: Order): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/order-update`, orderDetails)
  }
}
