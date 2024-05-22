import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class ImageLoadService {
  preloadImage(imageUrl: string): Observable<Event> {
    return new Observable(observer => {
      const img = new Image()
      img.onload = (event) => {
        observer.next(event)
        observer.complete()
      }
      img.onerror = (err) => observer.error(err)
      img.src = imageUrl
    })
  }

  getLowResImageUrl(imageUrl: string): string {
    const transformation = 'w_50,h_50,c_scale,e_blur:300,q_auto'
    const parts = imageUrl.split('/upload/')
    return `${parts[0]}/upload/${transformation}/${parts[1]}`
  }

  preloadImagesArray(imageUrls: string[]): void {
    imageUrls.forEach(imageUrl => {
      const lowResUrl = this.getLowResImageUrl(imageUrl)
      this.preloadImage(lowResUrl).subscribe({
        error: (error) => console.error('Error preloading low-res', error),
      })
    })
  }

  preloadSingleImage(imageUrl: string): void {
    const lowResUrl = this.getLowResImageUrl(imageUrl)
    this.preloadImage(lowResUrl).subscribe({
      error: (error) => console.error('Error preloading low-res', error),
    })
  }
}