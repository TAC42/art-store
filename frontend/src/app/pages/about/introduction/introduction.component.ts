import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html'
})

export class IntroductionComponent {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.w-h-100') fullWidthHeightClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

  aboutImageUrls: string[] = [
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880473/Artware/qminrkpf5nftfmnredx5.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880471/Artware/zion4h33enmpgxvz0yqa.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880472/Artware/yfpb9qax5r3qvqz2kc6c.png',
    'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704880476/Artware/jloyblpg0ith2jnudq9z.png'
  ]
}
