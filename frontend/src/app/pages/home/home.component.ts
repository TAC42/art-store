import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { CarouselItem } from '../../models/shop'
import { DeviceTypeService } from '../../services/device-type.service'
import { ImageLoadService } from '../../services/image-load.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private router = inject(Router)
  private dTypeService = inject(DeviceTypeService)
  private imgLoadService = inject(ImageLoadService)

  deviceType$: Observable<string> = this.dTypeService.deviceType$

  public loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  public loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/kbmf486sbcavkhpq6s7r.png'
  public loneImg1LowRes: string = ''
  public loneImg2LowRes: string = ''

  public artwareProducts: CarouselItem[] = [
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/gwbdk2xu6zp9grs9acdp.png',
      name: 'tower plate',
      url: '/artware/details/tower plate'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/ibyk1mbjlblc3hrymhpi.png',
      name: 'ancient cup',
      url: '/artware/details/ancient cup'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/nlejntudcw8gsdfw1owo.png',
      name: 'casual brew',
      url: '/artware/details/casual brew'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/spwj3lmccf44ke56d53p.png',
      name: 'elegant vase',
      url: '/artware/details/elegant vase'
    },
  ]
  public shopProducts: CarouselItem[] = [
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704917781/shop/v0hzwqgk0idasguqdiue.png',
      name: 'dark green mug',
      url: '/shop/details/dark green mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/fekcvwmimrtm9wghntnr.png',
      name: 'black mug',
      url: '/shop/details/black mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/vc8dzka5spwt0jwkfgmy.png',
      name: 'blue mug',
      url: '/shop/details/blue mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/sr7vuhhliiq6mnwnbdqv.png',
      name: 'makara mug',
      url: '/shop/details/makara mug'
    },
  ]

  ngOnInit(): void {
    this.loneImg1LowRes = this.imgLoadService.getLowResImageUrl(this.loneImg1)
    this.loneImg2LowRes = this.imgLoadService.getLowResImageUrl(this.loneImg2)

    this.imgLoadService.preloadSingleImage(this.loneImg1)
    this.imgLoadService.preloadSingleImage(this.loneImg2)

    this.imgLoadService.preloadCarouselItems(this.artwareProducts)
    this.imgLoadService.preloadCarouselItems(this.shopProducts)
  }

  onTeaserImageLoad(event: Event, lowResImage: HTMLElement): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.style.display = 'block'
    lowResImage.style.display = 'none'
  }

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}