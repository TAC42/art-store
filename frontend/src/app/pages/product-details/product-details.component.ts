import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Observable, Subject, Subscription, concatMap, lastValueFrom, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs';
import { ShopDbService } from '../../services/shop-db.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/shop';

@Component({
    selector: 'product-details',
    templateUrl: './product-details.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

    // constructor(
    //     private petService: PetService,
    //     private router: Router,
    // ) { }
    // THE SAME
    private shopService = inject(ShopDbService)
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private cd = inject(ChangeDetectorRef)
    private zone = inject(NgZone)


    destroySubject$ = new Subject<void>()

    subscription!: Subscription
    ans!: string
    product: Product | null = null
    product$!: Observable<Product>
    msg = ''


    async ngOnInit(): Promise<void> {
        this.product$ = this.route.data.pipe(
            map(data => data['product']),
            tap((product) => console.log('product in details: ', product))
        );

        this.product$.subscribe((product) => {
            this.product = product;
            // Do anything else with the product here
            // For example, you might want to update the UI after getting the product details
            this.msg = 'Welcome to Product Details!';
            this.cd.markForCheck();
        });

        setTimeout(() => {
            // Avoid using setTimeout to simulate loading data,
            // Instead, handle the message and UI updates based on the subscription
            this.msg = 'Welcome to Product Details!';
            this.cd.markForCheck();
        }, 1500);
    }

    // onShouldAdoptPet() {
    //     this.shopService.shouldAdoptPet()
    //         .pipe(takeUntil(this.destroySubject$))
    //         .subscribe((ans: string) => {
    //             this.ans = ans
    //             this.cd.markForCheck()
    //             setTimeout(() => {
    //                 this.ans = ''
    //                 this.cd.markForCheck()
    //             }, 1500);
    //         })
    // }

    onBack() {
        this.router.navigateByUrl('/')
        // this.router.navigate(['/'], { queryParams: { name: 'JJojo', age: 30 } })
    }

    ngOnDestroy(): void {
        // this.subscription?.unsubscribe()
        this.destroySubject$.next()
        this.destroySubject$.complete()

    }


}
