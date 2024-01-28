import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Subscription, map } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { LOAD_RANDOM_PRODUCTS } from '../../store/shop.actions'
import { selectRandomProducts } from '../../store/shop.selectors'

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html',
})

export class ProductDetailsComponent implements OnInit, OnDestroy {
    @HostBinding('class.full') fullClass = true
    @HostBinding('class.w-h-100') fullWidthHeightClass = true
    @HostBinding('class.layout-row') layoutRowClass = true

    private store = inject(Store<AppState>)
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private dTypeService = inject(DeviceTypeService)

    deviceType: string = 'mini-tablet'
    private dTypesubscription!: Subscription

    randomProducts: Product[] = []
    private productSubscription!: Subscription
    product: Product | null = null

    ngOnInit(): void {
        this.dTypesubscription = this.dTypeService.deviceType$.subscribe(
            (type) => this.deviceType = type
        )
        this.fetchProductData()
    }

    fetchProductData(): void {
        this.productSubscription = this.route.data
            .pipe(map(data => data['product']))
            .subscribe({
                next: (product: Product) => {
                    this.product = product

                    if (product && product._id) {
                        this.store.dispatch(LOAD_RANDOM_PRODUCTS({
                            productType: product.type,
                            excludeProductId: product._id
                        }))
                    }
                },
                error: (error) => console.error('Error fetching product:', error)
            })
        this.store.select(selectRandomProducts).subscribe(randomProducts => {
            this.randomProducts = randomProducts
        })
    }

    onBack(): void {
        this.router.navigateByUrl(`/${encodeURIComponent(this.product?.type || 'shop')}`)
    }

    ngOnDestroy(): void {
        if (this.productSubscription) this.productSubscription.unsubscribe()
        if (this.dTypesubscription) this.dTypesubscription.unsubscribe()
    }
}
