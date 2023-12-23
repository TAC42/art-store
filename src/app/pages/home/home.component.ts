import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { Subscription, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent  {
  // private userService = inject(UserService)
  // private bitcoinService = inject(BitcoinService)
  // subscription!: Subscription
  // firstUser: User | null = null

  // bitCoinRate$ = this.bitcoinService.getBitCoinRate()
  // user = this.userService.getUser()
  // user$ = this.userService.getUserObs(this.user)
  // bitCoinRate2$ = this.user$.pipe(
  //   switchMap(user => this.bitcoinService.getBitCoinRateStream(user.coins))
  // )



  // ngOnInit(): void {
  //   this.subscription = this.userService.query().pipe(take(1)).subscribe({
  //     next: users => {
  //       this.firstUser = users[0];
  //     },
  //     error: err => console.log('err:', err)
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.subscription?.unsubscribe?.()
  // }
}




