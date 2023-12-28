// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { AuthService } from './auth.service'; // replace with your auth service or user service

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree {
//     // Check if user is an admin (assuming your AuthService has a method to check user role)
//     const isAdmin = this.authService.isUserAdmin(); // Adjust this based on your AuthService implementation

//     if (isAdmin) {
//       return true; // Allow access for admin users
//     } else {
//       // Redirect unauthorized users to a different route or show an error
//       return this.router.createUrlTree(['/']); // Redirect to home or another route
//     }
//   }
// }
