import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
