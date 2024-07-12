import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatExpansionModule } from '@angular/material/expansion'
import { AppRoutingModule } from './app-routing.module'
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'
import { AppComponent } from './app-root/app.component'

import { ProductEffects } from './store/product/product.effects'
import { UserEffects } from './store/user/user.effects'
import { OrderEffects } from './store/order/order.effects'
import { reducers } from './store/app.state'

import { ClickOutsideDirective } from './directives/click-outside.directive'
import { CustomValidatorDirective } from './directives/custom-validator.directive'
import { SwipeDirective } from './directives/swipe.directive'
import { AutofocusDirective } from './directives/auto-focus.directive'
import { DragDropDirective } from './directives/drag-drop.directive'

import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { ContactComponent } from './pages/about/contact/contact.component'
import { IntroductionComponent } from './pages/about/introduction/introduction.component'
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component'
import { ShopComponent } from './pages/shop/shop.component'
import { ShopIndexComponent } from './pages/shop/index/shop-index.component'
import { SculptureIndexComponent } from './pages/sculpture/index/sculpture-index.component'
import { SculptureComponent } from './pages/sculpture/sculpture.component'
import { ArtwareComponent } from './pages/artware/artware.component'
import { ArtwareIndexComponent } from './pages/artware/index/artware-index.component'
import { ProductDetailsComponent } from './pages/details/product/product-details.component'
import { ShowcaseDetailsComponent } from './pages/details/showcase/showcase-details.component'
import { ProductEditComponent } from './pages/product-edit/product-edit.component'
import { ProfileComponent } from './pages/profile/profile.component'
import { PaymentComponent } from './pages/payment/payment.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { SignupComponent } from './pages/signup/signup.component'
import { ServiceTermsComponent } from './pages/service-terms/service-terms.component'

import { LoaderComponent } from './cmps/loader/loader.component'
import { HeaderComponent } from './cmps/header/header.component'
import { HeaderDropdownComponent } from './cmps/header/header-dropdown/header-dropdown.component'
import { FooterComponent } from './cmps/footer/footer.component'
import { SvgRenderComponent } from './cmps/svg-render-component/svg-render-component'
import { ProductListComponent } from './cmps/product-list/product-list.component'
import { ProductFilterComponent } from './cmps/product-filter/product-filter.component'
import { ProductPreviewComponent } from './cmps/product-preview/product-preview.component'
import { ImageUploaderComponent } from './cmps/image-uploader/image-uploader.component'
import { EditPreviewComponent } from './cmps/edit-preview/edit-preview.component'
import { ProductCarouselComponent } from './cmps/carousels/product-carousel/product-carousel.component'
import { RandomProductCarouselComponent } from './cmps/carousels/random-product-carousel/random-product-carousel.component'
import { UserOrdersComponent } from './cmps/user-orders/user-orders.component'

import { UserMsgComponent } from './cmps/modals/user-msg/user-msg.component'
import { AsideMenuComponent } from './cmps/modals/aside-menu/aside-menu.component'
import { LoginModalComponent } from './cmps/modals/login-modal/login-modal.component'
import { ConfirmModalComponent } from './cmps/modals/confirm-modal/confirm-modal.component'
import { CartComponent } from './cmps/modals/cart/cart.component'
import { UserAuthModalComponent } from './cmps/modals/user-auth-modal/user-auth-modal.component'
import { ImageDisplayComponent } from './cmps/modals/image-display/image-display.component'
import { UserEditComponent } from './cmps/modals/user-edit/user-edit.component'
import { ImageContainerComponent } from './cmps/image-container/image-container.component'
import { ResetPasswordComponent } from './cmps/modals/reset-password/reset-password.component'
import { ResetEmailComponent } from './cmps/modals/reset-email/reset-email.component'

@NgModule({
  declarations: [
    AppComponent,
    SwipeDirective,
    AutofocusDirective,
    ClickOutsideDirective,
    CustomValidatorDirective,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    IntroductionComponent,
    ShopComponent,
    ShopIndexComponent,
    SculptureComponent,
    SculptureIndexComponent,
    ArtwareComponent,
    ArtwareIndexComponent,
    ProductDetailsComponent,
    ShowcaseDetailsComponent,
    ProductEditComponent,
    ProfileComponent,
    PaymentComponent,
    DashboardComponent,
    HeaderComponent,
    SvgRenderComponent,
    ProductListComponent,
    AsideMenuComponent,
    ProductFilterComponent,
    ProductPreviewComponent,
    ProductCarouselComponent,
    LoaderComponent,
    FooterComponent,
    LoginModalComponent,
    UserMsgComponent,
    ConfirmModalComponent,
    ImageUploaderComponent,
    CartComponent,
    UserAuthModalComponent,
    HeaderDropdownComponent,
    ImageDisplayComponent,
    RandomProductCarouselComponent,
    EditPreviewComponent,
    UserEditComponent,
    PrivacyPolicyComponent,
    ImageContainerComponent,
    SignupComponent,
    ServiceTermsComponent,
    ResetPasswordComponent,
    UserOrdersComponent,
    ResetEmailComponent,
    DragDropDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ProductEffects, UserEffects, OrderEffects]),
    RecaptchaFormsModule,
    RecaptchaModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
