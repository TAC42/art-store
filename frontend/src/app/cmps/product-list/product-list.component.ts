import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Product } from '../../models/shop'
import { User } from '../../models/user'
import { ImageLoadService } from '../../services/image-load.service'

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnChanges {
  @Input() isShopPage!: boolean
  @Input() products!: Product[] | null
  @Input() user$!: Observable<User>
  @Input() isLoading!: boolean
  @Output() remove = new EventEmitter<string>()
  @Output() add = new EventEmitter<Product>()

  private imgLoadService = inject(ImageLoadService)
  public imageUtils = this.imgLoadService

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) this._preloadProductImages()
  }

  private _preloadProductImages(): void {
    this.products?.forEach(product => {
      if (product.imgUrls && product.imgUrls.length > 0) {
        const firstImageUrl = product.imgUrls[0]
        this.imgLoadService.preloadSingleImage(firstImageUrl)
      }
    })
  }
}