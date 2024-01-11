import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Subscription, map } from 'rxjs'

import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'

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

    private productSubscription!: Subscription
    product: Product | null = null

    constructor() { }

    ngOnInit(): void {
        this.productSubscription = this.route.data
            .pipe(
                map(data => data['product'])
            )
            .subscribe((product: Product) => {
                this.product = product
            })
    }

    onBack(): void {
        this.router.navigateByUrl('/shop')
    }

    ngOnDestroy(): void {
        if (this.productSubscription) this.productSubscription.unsubscribe()
    }
}
