import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app-root/app.component'
import { HomeComponent } from './pages/home/home.component'
import { HeaderComponent } from './cmps/header/header.component'
import { AboutComponent } from './pages/about/about.component'
import { ContactComponent } from './pages/contact/contact.component'
import { IntroductionComponent } from './pages/introduction/introduction.component'
import { SvgRenderComponent } from './cmps/svg-render-component/svg-render-component'
import { ShopComponent } from './pages/shop/shop.component'
import { ShopListComponent } from './cmps/shop-list/shop-list.component'
import { AsideMenuComponent } from './cmps/aside-menu/aside-menu.component'
import { ClickOutsideDirective } from './directives/click-outside.directive'
import { ShopFilterComponent } from './cmps/shop-filter/shop-filter.component'
import { ProductPreviewComponent } from './cmps/product-preview/product-preview.component'
import { ImageCarouselComponent } from './cmps/image-carousel/image-carousel.component'
import { ProductDetailsComponent } from './pages/product-details/product-details.component'
import { ProductEditComponent } from './pages/product-edit/product-edit.component'
import { reducers } from './store/app.state'
import { LoaderComponent } from './cmps/loader/loader.component'
import { ShopEffects } from './store/shop.effects'
import { UserEffects } from './store/user.effects'
import { ShopIndexComponent } from './pages/shop-index/shop-index.component'
import { FooterComponent } from './cmps/footer/footer.component'
import { LoginModalComponent } from './cmps/login-modal/login-modal.component';
import { UserMsgComponent } from './cmps/user-msg/user-msg.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    SvgRenderComponent,
    ShopComponent,
    ShopListComponent,
    AsideMenuComponent,
    ClickOutsideDirective,
    ShopFilterComponent,
    ProductPreviewComponent,
    ImageCarouselComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    LoaderComponent,
    ContactComponent,
    IntroductionComponent,
    ShopIndexComponent,
    FooterComponent,
    LoginModalComponent,
    UserMsgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ShopEffects, UserEffects]),
    RecaptchaFormsModule,
    RecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
