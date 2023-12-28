import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})

export class AboutComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  functionImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513248/Gallery/Function/btmyi6brioqwsbskotjn.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513247/Gallery/Function/im2hkdn3k8zkrl4oidm5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ti9l3ndpiq7cwdmwsckx.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703512615/Gallery/Function/ioctdtajxdsqu25eg3s8.png'
  ]
}
