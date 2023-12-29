import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app-root/app.component'
import { HomeComponent } from './pages/home/home.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { HeaderComponent } from './cmps/header/header.component'
import { AboutComponent } from './pages/about/about.component'
import { ContactComponent } from './pages/contact/contact.component'
import { IntroductionComponent } from './pages/introduction/introduction.component'
import { SvgRenderComponent } from './cmps/svg-render-component/svg-render-component'
import { ShopComponent } from './pages/shop/shop.component'
import { ShopListComponent } from './cmps/shop-list/shop-list.component'
import { ProductComponent } from './pages/product/product.component'
import { AsideMenuComponent } from './cmps/aside-menu/aside-menu.component'
import { ClickOutsideDirective } from './directives/click-outside.directive'
import { ShopFilterComponent } from './cmps/shop-filter/shop-filter.component'
import { ProductPreviewComponent } from './cmps/product-preview/product-preview.component'
import { ImageCarouselComponent } from './cmps/image-carousel/image-carousel.component'
import { ProductDetailsComponent } from './cmps/product-details/product-details.component'
import { ProductEditComponent } from './cmps/product-edit/product-edit.component'
import { reducers } from './store/shop.reducers'
import { StoreModule } from '@ngrx/store';
import { LoaderComponent } from './cmps/loader/loader.component'
import { EffectsModule } from '@ngrx/effects'
import { ShopEffects } from './store/shop.effects'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    SvgRenderComponent,
    ShopComponent,
    ShopListComponent,
    ProductComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers), 
    EffectsModule.forRoot([ShopEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
