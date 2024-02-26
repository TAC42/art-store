import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from './http.service'
import { CarouselItem, MiniProduct } from '../models/shop'

const BASE_URL = 'utility/'

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  private httpService = inject(HttpService)

  usStates = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' }
  ]

  sendContactUsMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}mail/contact`, formData)
  }

  sendVerificationMail(formData: any): Observable<any> {
    return this.httpService.post<any>(`${BASE_URL}mail/verify`, formData)
  }

  generateRandomCode(): string {
    let code = ''
    for (let i = 0; i < 6; i++) {
      const digit = Math.floor(Math.random() * 10)
      code += digit.toString()
    }
    return code
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

  getStates() {
    return this.usStates
  }

  // convertToCarouselItem(imgUrls: string[]): CarouselItem[] {
  //   return imgUrls.map(imgUrl => ({
  //     type: 'image',
  //     imgUrl: imgUrl
  //   }))
  // }
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
}
