import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { Product } from '../../../models/shop'

@Component({
  selector: 'random-product-carousel',
  templateUrl: './random-product-carousel.component.html'
})

export class RandomProductCarouselComponent {
  @Input() randomProducts$!: Observable<Product[]>

}
