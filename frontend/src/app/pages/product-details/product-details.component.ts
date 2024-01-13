import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Subscription, map } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { SET_PRODUCT_BY_NAME } from '../../store/shop.actions'
import { ShopDbService } from '../../services/shop-db.service'

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    @HostBinding('class.full') fullClass = true
    @HostBinding('class.w-h-100') fullWidthHeightClass = true
    @HostBinding('class.layout-row') layoutRowClass = true

    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private store = inject(Store<AppState>)
    private dTypeService = inject(DeviceTypeService)
    private shopDbService = inject(ShopDbService)

    randomProducts: Product[] = []

    deviceType: string = 'mini-tablet'
    private dTypesubscription: Subscription

    private productSubscription!: Subscription
    product: Product | null = null

    constructor() {
        this.dTypesubscription = this.dTypeService.deviceType$.subscribe(
            (type) => this.deviceType = type)
    }

    ngOnInit(): void {
        this.productSubscription = this.route.data
            .pipe(map(data => data['product']))
            .subscribe({
                next: (product: Product) => {
                    this.product = product

                    if (product && product._id) {
                        this.shopDbService.getRandomProducts('shop', product._id)
                            .subscribe({
                                next: (products: Product[]) => this.randomProducts = products,
                                error: (error) => console.error('Error fetching random products:', error)
                            })
                    }
                },
                error: (error) => console.error('Error fetching product:', error)
            })
    }

    onBack(): void {
        this.router.navigateByUrl('/shop')
    }

    ngOnDestroy(): void {
        if (this.productSubscription) this.productSubscription.unsubscribe()
        this.store.dispatch(SET_PRODUCT_BY_NAME({ product: null }))

        this.dTypesubscription.unsubscribe()
    }
}
