import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { CarouselItem, MiniProduct } from '../../models/shop'
import { DeviceTypeService } from '../../services/device-type.service'
import { Observable } from 'rxjs'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true

  private dTypeService = inject(DeviceTypeService)
  private utilService = inject(UtilityService)
  private router = inject(Router)

  deviceType$: Observable<string> = this.dTypeService.deviceType$

  loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/kbmf486sbcavkhpq6s7r.png'
  loneImg3: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/fjq1w6fb8ozzau1mfd6n.png'
  loneImg4: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1708431099/ContactandAbout/mgkgkobyzk5zg8z4nyb6.jpg'

  artwareCarouselItems: CarouselItem[] = []
  shopCarouselItems: CarouselItem[] = []
  artwareProducts: MiniProduct[] = [
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/gwbdk2xu6zp9grs9acdp.png',
      name: 'tower plate',
      url: '/artware/details/tower plate'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/ibyk1mbjlblc3hrymhpi.png',
      name: 'ancient cup',
      url: '/artware/details/ancient cup'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/nlejntudcw8gsdfw1owo.png',
      name: 'casual brew',
      url: '/artware/details/casual brew'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/spwj3lmccf44ke56d53p.png',
      name: 'elegant vase',
      url: '/artware/details/elegant vase'
    },
  ]
  shopProducts: MiniProduct[] = [
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704917781/shop/v0hzwqgk0idasguqdiue.png',
      name: 'dark green mug',
      url: '/shop/details/dark green mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/fekcvwmimrtm9wghntnr.png',
      name: 'black mug',
      url: '/shop/details/black mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/vc8dzka5spwt0jwkfgmy.png',
      name: 'blue mug',
      url: '/shop/details/blue mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/sr7vuhhliiq6mnwnbdqv.png',
      name: 'green mug',
      url: '/shop/details/green mug'
    },
  ]

  ngOnInit() {
    this.artwareCarouselItems = this.utilService.convertToCarouselItem(this.artwareProducts, 'product')
    this.shopCarouselItems = this.utilService.convertToCarouselItem(this.shopProducts, 'product')
  }

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}