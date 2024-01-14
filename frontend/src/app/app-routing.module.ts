import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { IntroductionComponent } from './pages/introduction/introduction.component'
import { ContactComponent } from './pages/contact/contact.component'
import { ShopComponent } from './pages/shop/shop.component'
import { ProductEditComponent } from './pages/product-edit/product-edit.component'
import { ProductDetailsComponent } from './pages/product-details/product-details.component'
import { ProductResolver } from './resolvers/product.resolver'
import { ShopIndexComponent } from './pages/shop-index/shop-index.component'
import { SculptureComponent } from './pages/sculpture/sculpture.component'
import { SculptureIndexComponent } from './pages/sculpture-index/sculpture-index.component'
import { ArtwareComponent } from './pages/artware/artware.component'
import { ArtwareIndexComponent } from './pages/artware-index/artware-index.component'

const routes: Routes = [
  {
    path: 'shop', component: ShopComponent, children: [
      { path: '', component: ShopIndexComponent },
      { path: 'edit/:name', component: ProductEditComponent, resolve: { product: ProductResolver } },
      { path: 'edit', component: ProductEditComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ProductDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  {
    path: 'sculpture', component: SculptureComponent, children: [
      { path: '', component: SculptureIndexComponent },
      { path: 'edit/:name', component: ProductEditComponent, resolve: { product: ProductResolver } },
      { path: 'edit', component: ProductEditComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ProductDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  {
    path: 'artware', component: ArtwareComponent, children: [
      { path: '', component: ArtwareIndexComponent },
      { path: 'edit/:name', component: ProductEditComponent, resolve: { product: ProductResolver } },
      { path: 'edit', component: ProductEditComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ProductDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  {
    path: 'about', component: AboutComponent, children: [
      { path: '', redirectTo: 'introduction', pathMatch: 'full' },
      { path: 'introduction', component: IntroductionComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
