import usStates from '../jsons/us-states.json'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CarouselItem, MiniProduct } from '../models/shop'
import { ModalService } from './modal.service'

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  private modService = inject(ModalService)

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

  // handling of reset timer for resending a code (user auth / reset password)
  startResendTimer(): Observable<{ timer: number, resendAvailable: boolean }> {
    return new Observable((observer) => {
      let timer = 120
      let resendAvailable = false
      const resendCodeTimer = setInterval(() => {
        if (timer > 0) timer--
        else {
          resendAvailable = true
          clearInterval(resendCodeTimer)
        }
        observer.next({ timer, resendAvailable })
      }, 1000)
      return () => clearInterval(resendCodeTimer)
    })
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

  deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true

    if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) return false

    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

    for (const key of Object.keys(obj1)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false

      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!this.deepEqual(obj1[key], obj2[key])) return false
      } else if (obj1[key] !== obj2[key]) return false
    }
    return true
  }
}