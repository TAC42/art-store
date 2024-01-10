import { Component, HostBinding } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/kbmf486sbcavkhpq6s7r.png'
  loneImg3: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880241/Sculpture/fjq1w6fb8ozzau1mfd6n.png'

  functionImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/gwbdk2xu6zp9grs9acdp.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880470/Artware/ibyk1mbjlblc3hrymhpi.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880469/Artware/au6tanmghe9rzwbp3jnj.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/spwj3lmccf44ke56d53p.png'
  ]

  shopImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/vc8dzka5spwt0jwkfgmy.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/fekcvwmimrtm9wghntnr.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/xgumpzx2inejeyjfhoem.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703510700/Shop/sr7vuhhliiq6mnwnbdqv.png'
  ]

  constructor(private router: Router) { }

  navigateTo(url: string) {
    this.router.navigate([url])
  }
}