import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'
import { AppRoutingModule } from './app-routing.module'

import { ClickOutsideDirective } from './directives/click-outside.directive'
import { CustomValidatorDirective } from './directives/custom-validator.directive'
import { SwipeDirective } from './directives/swipe.directive'

import { AppComponent } from './app-root/app.component'
import { LoaderComponent } from './cmps/loader/loader.component'
import { UserMsgComponent } from './cmps/modals/user-msg/user-msg.component'
import { ShopEffects } from './store/shop.effects'
import { UserEffects } from './store/user.effects'
import { MatExpansionModule } from '@angular/material/expansion'
import { reducers } from './store/app.state'
import { HeaderComponent } from './cmps/header/header.component'
import { HeaderDropdownComponent } from './cmps/header/header-dropdown/header-dropdown.component'
import { FooterComponent } from './cmps/footer/footer.component'

import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { ContactComponent } from './pages/about/contact/contact.component'
import { IntroductionComponent } from './pages/about/introduction/introduction.component'
import { SvgRenderComponent } from './cmps/svg-render-component/svg-render-component'
import { ShopComponent } from './pages/shop/shop.component'
import { ProductListComponent } from './cmps/product-list/product-list.component'
import { AsideMenuComponent } from './cmps/modals/aside-menu/aside-menu.component'
import { ProductFilterComponent } from './cmps/product-filter/product-filter.component'
import { ProductPreviewComponent } from './cmps/product-preview/product-preview.component'
import { ProductCarouselComponent } from './cmps/carousels/product-carousel/product-carousel.component'
import { ProductDetailsComponent } from './pages/details/product/product-details.component'
import { ProductEditComponent } from './pages/product-edit/product-edit.component'
import { ShopIndexComponent } from './pages/shop/index/shop-index.component'
import { LoginModalComponent } from './cmps/modals/login-modal/login-modal.component'
import { SculptureComponent } from './pages/sculpture/sculpture.component'
import { ArtwareComponent } from './pages/artware/artware.component'
import { ConfirmModalComponent } from './cmps/modals/confirm-modal/confirm-modal.component'
import { ImageUploaderComponent } from './cmps/image-uploader/image-uploader.component'
import { CartComponent } from './cmps/modals/cart/cart.component'
import { SculptureIndexComponent } from './pages/sculpture/index/sculpture-index.component'
import { ArtwareIndexComponent } from './pages/artware/index/artware-index.component'
import { UserAuthModalComponent } from './cmps/modals/user-auth-modal/user-auth-modal.component'
import { PaymentComponent } from './pages/payment/payment.component'
import { ImageDisplayComponent } from './cmps/modals/image-display/image-display.component'
import { ShowcaseDetailsComponent } from './pages/details/showcase/showcase-details.component'
import { RandomProductCarouselComponent } from './cmps/carousels/random-product-carousel/random-product-carousel.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { EditPreviewComponent } from './cmps/edit-preview/edit-preview.component';
import { AutofocusDirective } from './directives/auto-focus.directive'
import { OrderEffects } from './store/order.effects'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    SvgRenderComponent,
    ShopComponent,
    ProductListComponent,
    AsideMenuComponent,
    ClickOutsideDirective,
    ProductFilterComponent,
    ProductPreviewComponent,
    ProductCarouselComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    LoaderComponent,
    ContactComponent,
    IntroductionComponent,
    ShopIndexComponent,
    FooterComponent,
    LoginModalComponent,
    UserMsgComponent,
    CustomValidatorDirective,
    SculptureComponent,
    ArtwareComponent,
    ConfirmModalComponent,
    ImageUploaderComponent,
    CartComponent,
    SwipeDirective,
    SculptureIndexComponent,
    ArtwareIndexComponent,
    UserAuthModalComponent,
    HeaderDropdownComponent,
    PaymentComponent,
    ImageDisplayComponent,
    ShowcaseDetailsComponent,
    RandomProductCarouselComponent,
    ProfileComponent,
    DashboardComponent,
    EditPreviewComponent,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ShopEffects, UserEffects,OrderEffects]),
    RecaptchaFormsModule,
    RecaptchaModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
