import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable, Subject, Subscription, map } from 'rxjs'

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
    private cd = inject(ChangeDetectorRef)

    destroySubject$ = new Subject<void>()

    subscription!: Subscription
    ans!: string
    product: Product | null = null
    product$!: Observable<Product>

    async ngOnInit(): Promise<void> {
        this.product$ = this.route.data.pipe(
            map(data => {
                return data['product']
            }))

        this.product$.subscribe((product) => {
            this.product = product
            this.cd.markForCheck()
        })

        setTimeout(() => {
            this.cd.markForCheck()
        }, 1500)
    }

    onBack() {
        this.router.navigateByUrl('/shop')
    }

    ngOnDestroy(): void {
        this.destroySubject$.next()
        this.destroySubject$.complete()
    }
}
