import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { CarouselItem } from '../../models/utility'
import { DeviceTypeService } from '../../services/utils/device-type.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  host: { 'class': 'full w-h-100' }
})

export class HomeComponent {
  private router = inject(Router)
  private dTypeService = inject(DeviceTypeService)

  deviceType$: Observable<string> = this.dTypeService.deviceType$

  public loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1715962904/ContactandAbout/bboc85okcqi39lx9yhod.avif'
  public loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716233021/Sculpture/rrdjhri4gdnmmcrlwqe7.avif'
  public loneImg1LowRes: string = ''
  public loneImg2LowRes: string = ''

  public artwareProducts: CarouselItem[] = [
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716234411/Artware/m4suwoojmmjbmufwsocj.avif',
      name: 'green vase 01',
      url: '/artware/details/green vase 01'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716235026/Artware/yylgykjcbkpeououzdhy.avif',
      name: 'ancient cup',
      url: '/artware/details/ancient cup'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716237618/Artware/idpbhdaettq8br4jke4m.avif',
      name: 'casual brew',
      url: '/artware/details/casual brew'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716235026/Artware/v45xvcbdpz39dmyxoep1.avif',
      name: 'elegant vase',
      url: '/artware/details/elegant vase'
    },
  ]
  public shopProducts: CarouselItem[] = [
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716232306/Shop/i1atkq6fiwab4b1gmjhe.avif',
      name: 'dark green mug',
      url: '/shop/details/dark green mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716232307/Shop/rnqoxe2t7d7vn7x9dmlr.avif',
      name: 'black mug',
      url: '/shop/details/black mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716232306/Shop/y1vpsb12qo3eekrbrrop.avif',
      name: 'blue mug',
      url: '/shop/details/blue mug'
    },
    {
      type: 'product',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1716232306/Shop/dbrffgy3hpohly7esray.avif',
      name: 'makara mug',
      url: '/shop/details/makara mug'
    },
  ]

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}