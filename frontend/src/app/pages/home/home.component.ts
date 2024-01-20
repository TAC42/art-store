import { Component, HostBinding, inject } from '@angular/core'
import { Router } from '@angular/router'
import { MiniProduct } from '../../models/shop'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  private router = inject(Router)

  loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/kbmf486sbcavkhpq6s7r.png'
  loneImg3: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/fjq1w6fb8ozzau1mfd6n.png'

  artwareProducts: MiniProduct[] = [
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/gwbdk2xu6zp9grs9acdp.png',
      productName: 'Tower Plate',
      url: '/shop/details/Tower Plate'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/ibyk1mbjlblc3hrymhpi.png',
      productName: 'Ancient Cup',
      url: '/shop/details/Ancient Cup'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/nlejntudcw8gsdfw1owo.png',
      productName: 'Casual Brew',
      url: '/shop/details/Casual Brew'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/spwj3lmccf44ke56d53p.png',
      productName: 'Elegant Vase',
      url: '/shop/details/Elegant Vase'
    },
  ]

  shopProducts: MiniProduct[] = [
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704917781/shop/v0hzwqgk0idasguqdiue.png',
      productName: 'Metallic Green Mug',
      url: '/shop/details/Metallic Green Mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/fekcvwmimrtm9wghntnr.png',
      productName: 'Black Mug',
      url: '/shop/details/Black Mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/vc8dzka5spwt0jwkfgmy.png',
      productName: 'Blue Mug',
      url: '/shop/details/Blue Mug'
    },
    {
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/sr7vuhhliiq6mnwnbdqv.png',
      productName: 'Green Mug',
      url: '/shop/details/Green Mug'
    },
  ]

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}