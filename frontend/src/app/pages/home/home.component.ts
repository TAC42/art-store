import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';
// import { Subscription, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  @HostBinding('class.full') fullClass = true
}




