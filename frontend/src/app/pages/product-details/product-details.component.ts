import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Subscription, map } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { ShopDbService } from '../../services/shop-db.service'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { SET_LOADING_STATE } from '../../store/shop.actions'
import { LoaderService } from '../../services/loader.service'

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
    private shopDbService = inject(ShopDbService)
    private loaderService = inject(LoaderService)

    deviceType: string = 'mini-tablet'
    private dTypesubscription!: Subscription

    randomProducts: Product[] = []
    private productSubscription!: Subscription
    product: Product | null = null

    ngOnInit(): void {
        this.dTypesubscription = this.dTypeService.deviceType$.subscribe(
            (type) => this.deviceType = type
        )

        this.store.dispatch(SET_LOADING_STATE({ isLoading: true }))
        this.loaderService.setIsLoading(true)

        this.productSubscription = this.route.data
            .pipe(map(data => data['product']))
            .subscribe({
                next: (product: Product) => {
                    this.product = product;

                    if (product && product._id) {
                        this.shopDbService.getRandomProducts(product.type, product._id)
                            .subscribe({
                                next: (products: Product[]) => {
                                    this.randomProducts = products
                                },
                                error: (error) => {
                                    console.error('Error fetching random products:', error)
                                },
                                complete: () => {
                                    this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
                                    this.loaderService.setIsLoading(false)
                                }
                            })
                    } else {
                        this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
                        this.loaderService.setIsLoading(false)
                    }
                },
                error: (error) => {
                    console.error('Error fetching product:', error)
                    this.store.dispatch(SET_LOADING_STATE({ isLoading: false }))
                    this.loaderService.setIsLoading(false);
                }
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
