import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { AboutComponent } from './pages/about/about.component'
import { ShopComponent } from './pages/shop/shop.component'

const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
