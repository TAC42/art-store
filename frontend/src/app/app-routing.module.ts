import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { ShopComponent } from './pages/shop/shop.component'
import { ProductEditComponent } from './cmps/product-edit/product-edit.component'
import { ProductDetailsComponent } from './cmps/product-details/product-details.component'
import { ProductResolver } from './resolvers/product.resolver'

const routes: Routes = [
  { 
    path: 'shop', component: ShopComponent, children: [
      { path: ':name', component: ProductDetailsComponent, resolve: { product: ProductResolver } },
      { path: 'edit/:name', component: ProductEditComponent, resolve: { product: ProductResolver } },
      { path: 'edit', component: ProductEditComponent },
  ]
},
  { path: 'about', component: AboutComponent },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
