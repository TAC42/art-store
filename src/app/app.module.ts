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
import { SvgRenderComponent } from './cmps/svg-render-component/svg-render-component'
import { ShopComponent } from './pages/shop/shop.component'
import { ShopListComponent } from './cmps/shop-list/shop-list.component'
import { ProductComponent } from './pages/product/product.component'
import { AsideMenuComponent } from './cmps/aside-menu/aside-menu.component'
import { OutsideClickDirective } from './directives/outside-click.directive'
import { ShopFilterComponent } from './cmps/shop-filter/shop-filter.component'
import { ProductPreviewComponent } from './cmps/product-preview/product-preview.component'

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
    OutsideClickDirective,
    ShopFilterComponent,
    ProductPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
