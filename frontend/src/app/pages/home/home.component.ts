import { Component, HostBinding, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { CarouselItem } from '../../models/shop'
import { DeviceTypeService } from '../../services/device-type.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private dTypeService = inject(DeviceTypeService)
  private router = inject(Router)

  deviceType$: Observable<string> = this.dTypeService.deviceType$

  loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/kbmf486sbcavkhpq6s7r.png'

  artwareProducts: CarouselItem[] = [
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
  shopProducts: CarouselItem[] = [
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
      name: 'green mug',
      url: '/shop/details/green mug'
    },
  ]

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}