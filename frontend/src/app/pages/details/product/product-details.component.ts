import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Observable, map, take } from 'rxjs'
import { DeviceTypeService } from '../../../services/utils/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { CarouselItem, Cart, Product } from '../../../models/shop'
import { AppState } from '../../../store/app.state'
import { Store } from '@ngrx/store'
import { LOAD_RANDOM_PRODUCTS } from '../../../store/product/shop.actions'
import { selectRandomProducts } from '../../../store/product/shop.selectors'
import { User } from '../../../models/user'
import { selectUser } from '../../../store/user/user.selectors'
import { UPDATE_USER } from '../../../store/user/user.actions'
import { ModalService } from '../../../services/utils/modal.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/utils/event-bus.service'
import { UtilityService } from '../../../services/utils/utility.service'

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html',
})

export class ProductDetailsComponent implements OnInit {
    @HostBinding('class.full') fullClass = true
    @HostBinding('class.w-h-100') fullWidthHeightClass = true

    private store = inject(Store<AppState>)
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private dTypeService = inject(DeviceTypeService)
    private modService = inject(ModalService)
    private eBusService = inject(EventBusService)
    private utilService = inject(UtilityService)

    public regularUtils = this.utilService
    public carouselItems: CarouselItem[] = []

    deviceType$: Observable<string> = this.dTypeService.deviceType$
    user$: Observable<User> = this.store.select(selectUser)
    product$: Observable<Product> = this.route.data.pipe(
        map(data => data['product']))
    randomProducts$: Observable<Product[]> = this.store.select(selectRandomProducts)

    ngOnInit(): void {
        this.product$.subscribe(product => {
            if (product && product._id) {
                this.store.dispatch(LOAD_RANDOM_PRODUCTS({
                    productType: product.type,
                    excludeProductId: product._id
                }))
            }
            if (product.imgUrls.length > 1) this.carouselItems =
                this.utilService.convertToCarouselItem(product.imgUrls)
        })
    }

    onOpenCart(event: Event): void {
        event.stopPropagation()
        this.user$.pipe(take(1)).subscribe(user => {
            if (user?._id) this.modService.openModal('cart')
            else this.modService.openModal('login')
        })
    }

    onInquire(event: Event): void {
        event.stopPropagation()
        this.router.navigateByUrl('/about/contact')
    }

    onAddToCart(event: Event, product: Product): void {
        event.stopPropagation()
        if (!product) return

        this.user$.pipe(take(1)).subscribe(updatedUser => {
            if (updatedUser._id) {
                const newCartItem: Cart = { _id: product._id, amount: 1 }

                const isProductAlreadyInCart = updatedUser.cart.some(
                    cartProduct => cartProduct._id === newCartItem._id)

                if (!isProductAlreadyInCart) {
                    const newUser: User = {
                        ...updatedUser, cart: [...updatedUser.cart, newCartItem]
                    }
                    this.store.dispatch(UPDATE_USER({ updatedUser: newUser }))
                    showSuccessMsg('Product Added!',
                        'Product has been added to the cart', this.eBusService)
                } else showErrorMsg('Cannot Add!',
                    'Product already included in the cart', this.eBusService)
            } else this.modService.openModal('login')
        })
    }
}