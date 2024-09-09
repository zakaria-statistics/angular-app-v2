import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStateService } from "../services/app-state.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard {
  constructor(private appState: AppStateService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is authenticated
    if (!this.appState.authState.isAuthenticated) {
      this.router.navigateByUrl("/unauthorized");
      return false;
    }

    // Ensure roles are provided in the route data
    const requiredRoles: Array<string> = route.data['roles'];
    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified, allow access by default
      return true;
    }

    // Check if any of the user's roles match the required roles
    const userRoles = this.appState.authState.roles;
    const authorized = userRoles.some((role:any) => requiredRoles.includes(role));

    // If authorized, allow access
    if (authorized) {
      return true;
    }

    // If not authorized, redirect to unauthorized page
    this.router.navigateByUrl("/unauthorized");
    return false;
  }
}
