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
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513505/Gallery/Sculpture/jyij4j04qy2bq7yeirmi.png'
  loneImg3: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513504/Gallery/Sculpture/qy5s6xe5vjaej7oncsy6.png'

  functionImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513248/Gallery/Function/btmyi6brioqwsbskotjn.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513247/Gallery/Function/im2hkdn3k8zkrl4oidm5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ti9l3ndpiq7cwdmwsckx.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ioctdtajxdsqu25eg3s8.png'
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