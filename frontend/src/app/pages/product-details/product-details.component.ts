import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable, Subscription, map, take } from 'rxjs'
import { DeviceTypeService } from '../../services/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'
import { AppState } from '../../store/app.state'
import { Store } from '@ngrx/store'
import { LOAD_RANDOM_PRODUCTS } from '../../store/shop.actions'
import { selectRandomProducts } from '../../store/shop.selectors'
import { User } from '../../models/user'
import { selectLoggedinUser } from '../../store/user.selectors'
import { UPDATE_USER } from '../../store/user.actions'
import { ModalService } from '../../services/modal.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

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
    private modService = inject(ModalService)
    private eBusService = inject(EventBusService)

    deviceType: string = 'mini-tablet'
    private dTypesubscription!: Subscription

    loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
    loggedinUser: User | null = null
    randomProducts: Product[] = []
    private productSubscription!: Subscription
    product: Product | null = null

    ngOnInit(): void {
        this.dTypesubscription = this.dTypeService.deviceType$.subscribe(
            (type) => this.deviceType = type
        )
        this.fetchProductData()

        this.loggedinUser$.subscribe((user) => {
            this.loggedinUser = user
        })
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
        this.router.navigateByUrl(`/${encodeURIComponent(
            this.product?.type || 'shop')}`)
    }

    onOpenCart(event: Event): void {
        event.stopPropagation()
        if (this.loggedinUser) this.modService.openModal('cart')
        else this.modService.openModal('login')
    }

    onAddToCart(product: Product | null) {
        if (!product) {
            console.error('Cannot add null product to cart.')
            return
        }
        this.loggedinUser$.pipe(take(1)).subscribe(
            updatedUser => {
                if (updatedUser._id) {
                    const newProduct: Product = { ...product, amount: 1 }

                    const isProductAlreadyInCart = updatedUser.cart.some(
                        cartProduct => cartProduct.name === newProduct.name)

                    if (!isProductAlreadyInCart) {
                        const newUser: User = {
                            ...updatedUser,
                            cart: [...updatedUser.cart, newProduct]
                        }
                        this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
                        showSuccessMsg('Product Added!',
                            'Product has been added to the cart', this.eBusService)
                    } else showErrorMsg('Cannot Add!',
                        'Product already included in the cart', this.eBusService)
                } else this.modService.openModal('login')
            })
    }

    ngOnDestroy(): void {
        if (this.productSubscription) this.productSubscription.unsubscribe()
        if (this.dTypesubscription) this.dTypesubscription.unsubscribe()
    }
}
