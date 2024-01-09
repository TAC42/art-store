import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Observable, Subject, Subscription, map, tap } from 'rxjs'

import { ActivatedRoute, Router } from '@angular/router'
import { Product } from '../../models/shop'

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private cd = inject(ChangeDetectorRef)

    destroySubject$ = new Subject<void>()

    subscription!: Subscription
    ans!: string
    product: Product | null = null
    product$!: Observable<Product>
    msg = ''

    async ngOnInit(): Promise<void> {
        this.product$ = this.route.data.pipe(
            map(data => {
                return data['product']
            }))

        this.product$.subscribe((product) => {
            this.product = product
            this.msg = 'Welcome to Product Details!'
            this.cd.markForCheck()
        })

        setTimeout(() => {
            this.msg = 'Welcome to Product Details!'
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
