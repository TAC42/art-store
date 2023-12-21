import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  // {
  //   path: 'contact', component: ContactComponent, children: [
  //     { path: 'edit/:id', component: ContactEditComponent, resolve: { contact: contactResolver } },
  //     { path: 'edit', component: ContactEditComponent }
  //   ]
  // },
  // { path: 'stats', component: StatsComponent },
  // { path: 'contact-details/:id', component: ContactDetailsComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'statistics', component: StatisticsComponent },

  { path: 'store', component: StoreComponent },
  { path: 'about', component: AboutComponent },
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
