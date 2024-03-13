import usStates from '../jsons/us-states.json'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CarouselItem, MiniProduct } from '../models/shop'
import { Order } from '../models/order'
import { HttpService } from './http.service'
import { ModalService } from './modal.service'

const BASE_URL = 'mail/'

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  private httpService = inject(HttpService)
  private modService = inject(ModalService)

  sendContactUsMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/contact`, formData)
  }

  sendVerificationMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/verify`, formData)
  }

  sendInvoiceMails(orderDetails: Order): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}/invoice`, orderDetails)
  }

  getStates() {
    return usStates // fetch us states from json file
  }

  // user validation code generation
  generateRandomCode(): string {
    let code = ''
    for (let i = 0; i < 6; i++) {
      const digit = Math.floor(Math.random() * 10)
      code += digit.toString()
    }
    return code
  }

  // restricted color generation
  getRandomMidColor(): string {
    const letters = '3456789ABC'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10)]
    }
    return color
  }

  // color generation
  getRandomColor(): string {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  // return a carousel that enables you to click the images inside the carousel, for full display
  convertToCarouselItem(items: (string | MiniProduct)[], type: 'image' | 'product' = 'image'): CarouselItem[] {
    return items.map(item => {
      if (type === 'image' && typeof item === 'string') {
        return { type: 'image', imgUrl: item }
      } else if (type === 'product' && typeof item !== 'string') {
        return {
          type: 'product',
          imgUrl: item.imgUrl,
          name: item.name,
          url: item.url
        }
      }
      throw new Error('Invalid item type or item format')
    })
  }

  // open an an image modal showing the image in its maximum size
  onImageClick(event: Event, imageUrl: string): void {
    event.stopPropagation()
    this.modService.openModal('image-display', imageUrl)
  }

  // seperate a fullName into 2 seperate strings
  splitFullName(fullName: string): { firstName: string, lastName: string } {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length > 1) return {
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1]
    }
    else return { firstName: fullName, lastName: '' }
  }
}