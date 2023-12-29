import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Observable, Subject, Subscription, concatMap, lastValueFrom, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs';
import { ShopDbService } from '../../services/shop-db.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/shop';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
        this.product$ = this.route.data.pipe(map(data => data['product']))
        setTimeout(() => {
            this.msg = 'Welcome to Product Details!'
            this.cd.markForCheck()
            // this.cd.detectChanges()
        }, 1500)
        // this.zone.runOutsideAngular()
        // this.pet$ = this.route.params.pipe(
        //     switchMap(params => this.petService.getById(params['id']))
        // )

        // Ok'ish solution...
        // this.route.params.subscribe(async params => {
        //     const id = params['id']
        //     const pet = await lastValueFrom(this.petService.getById(id))
        //     console.log('pet:', pet)
        // })

        // VERY BAD, never subscribe inside a subscribe!
        // this.route.params.subscribe(params => {
        //     const id = params['id']
        //     this.petService.getById(id).subscribe(pet => {
        //         console.log('pet:', pet)
        //     })
        // })



        // First Day
        // this.pet$ = this.petService.getById(this.petId)

        // this.petService.getById(this.petId)
        //     .pipe(takeUntil(this.destroySubject$))
        //     .subscribe(pet=>this.pet=pet)

        // this.pet = await lastValueFrom(this.petService.getById(this.petId))
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
