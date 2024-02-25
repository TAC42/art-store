import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { IntroductionComponent } from './pages/about/introduction/introduction.component'
import { ContactComponent } from './pages/about/contact/contact.component'
import { ShopComponent } from './pages/shop/shop.component'
import { ProductEditComponent } from './pages/product-edit/product-edit.component'
import { ProductDetailsComponent } from './pages/details/product/product-details.component'
import { ShowcaseDetailsComponent } from './pages/details/showcase/showcase-details.component'
import { ProductResolver } from './resolvers/product.resolver'
import { ShopIndexComponent } from './pages/shop/index/shop-index.component'
import { SculptureComponent } from './pages/sculpture/sculpture.component'
import { SculptureIndexComponent } from './pages/sculpture/index/sculpture-index.component'
import { ArtwareComponent } from './pages/artware/artware.component'
import { ArtwareIndexComponent } from './pages/artware/index/artware-index.component'
import { AdminGuard } from './guards/admin.guard'
import { PaymentComponent } from './pages/payment/payment.component'
import { PaymentResolver } from './resolvers/payment.resolver'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { UserGuard } from './guards/user.guard'
import { ProfileComponent } from './pages/profile/profile.component'

const routes: Routes = [
  {
    path: 'shop', component: ShopComponent, children: [
      { path: '', component: ShopIndexComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ProductDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  {
    path: 'sculpture', component: SculptureComponent, children: [
      { path: '', component: SculptureIndexComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ShowcaseDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  {
    path: 'artware', component: ArtwareComponent, children: [
      { path: '', component: ArtwareIndexComponent },
      { path: 'details/:name', runGuardsAndResolvers: 'always', component: ShowcaseDetailsComponent, resolve: { product: ProductResolver } },
    ]
  },
  { path: 'edit/:name', component: ProductEditComponent, canActivate: [AdminGuard], resolve: { product: ProductResolver } },
  { path: 'edit', component: ProductEditComponent, canActivate: [AdminGuard] },
  {
    path: 'about', component: AboutComponent, children: [
      { path: '', redirectTo: 'introduction', pathMatch: 'full' },
      { path: 'introduction', component: IntroductionComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },
  {
    path: 'payment', component: PaymentComponent, resolve: { user: PaymentResolver }
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [UserGuard] 
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard]
  },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
