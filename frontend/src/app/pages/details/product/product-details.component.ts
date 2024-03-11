import { Component, HostBinding, OnInit, inject } from '@angular/core'
import { Observable, filter, map, take } from 'rxjs'
import { DeviceTypeService } from '../../../services/device-type.service'
import { ActivatedRoute, Router } from '@angular/router'
import { CarouselItem, Cart, Product } from '../../../models/shop'
import { AppState } from '../../../store/app.state'
import { Store } from '@ngrx/store'
import { LOAD_RANDOM_PRODUCTS } from '../../../store/shop.actions'
import { selectProductByName, selectRandomProducts } from '../../../store/shop.selectors'
import { User } from '../../../models/user'
import { selectLoggedinUser } from '../../../store/user.selectors'
import { UPDATE_USER } from '../../../store/user.actions'
import { ModalService } from '../../../services/modal.service'
import { EventBusService, showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { UtilityService } from '../../../services/utility.service'

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
    loggedinUser$: Observable<User> = this.store.select(selectLoggedinUser)
  
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
            this.carouselItems = this.utilService.convertToCarouselItem(product.imgUrls)
        })
    }

    onOpenCart(event: Event): void {
        event.stopPropagation()
        this.loggedinUser$.pipe(take(1)).subscribe(
            user => {
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

        this.loggedinUser$.pipe(take(1)).subscribe(
            updatedUser => {
                if (updatedUser._id) {
                    const newCartItem: Cart = { _id: product._id, amount: 1 }

                    const isProductAlreadyInCart = updatedUser.cart.some(
                        cartProduct => cartProduct._id === newCartItem._id)

                    if (!isProductAlreadyInCart) {
                        const newUser: User = {
                            ...updatedUser,
                            cart: [...updatedUser.cart, newCartItem]
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