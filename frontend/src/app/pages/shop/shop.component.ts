import { Component, OnDestroy, OnInit, HostBinding, inject } from '@angular/core'
import { Observable, Subscription, of } from 'rxjs'
import { selectProducts } from '../../store/shop.selectors'
import { Product } from '../../models/shop'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { Router } from '@angular/router'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})

export class ShopComponent  {
  @HostBinding('class.full') fullClass = true
  @HostBinding('class.layout-row') layoutRowClass = true

}