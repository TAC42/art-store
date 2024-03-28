import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class ImageLoadService {
  preloadImage(url: string): Observable<Event> {
    return new Observable(observer => {
      const img = new Image()
      img.onload = (event) => {
        observer.next(event)
        observer.complete()
      }
      img.onerror = (err) => observer.error(err)
      img.src = url
    })
  }

  getLowResImageUrl(imageUrl: string): string {
    const transformation = 'w_50,h_50,c_scale,e_blur:300,q_auto'
    const parts = imageUrl.split('/upload/')
    return `${parts[0]}/upload/${transformation}/${parts[1]}`
  }

  getHighResImageUrl(imageUrl: string): string {
    return imageUrl
  }
}