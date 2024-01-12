// scroll-to-top-resolver.service.ts
import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ScrollToTopResolver implements Resolve<void> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> | Promise<void> | void {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return
  }
}
