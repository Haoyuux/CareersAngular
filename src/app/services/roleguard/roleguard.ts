import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, filter, take, switchMap } from 'rxjs/operators';
import { UserServices } from 'src/app/services/nswag/service-proxie';
import { TokenService } from '../token-service/token-service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserServices,
    private tokenService: TokenService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.length === 0) {
      console.warn('[GUARD] No roles specified for route, allowing access');
      return true;
    }

    // Wait for token service to initialize first
    return this.tokenService.isInitialized$.pipe(
      filter((initialized) => initialized),
      take(1),
      switchMap(() => {
        // Check if user is authenticated
        if (!this.tokenService.isAuthenticated()) {
          console.warn('[GUARD] User not authenticated, redirecting to login');
          return of(
            this.router.parseUrl(
              '/user-authentication/user-login?redirect=' + state.url
            )
          );
        }

        // Get current user from token service
        const currentUser = this.tokenService.getCurrentUser();

        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
          // Check cached roles from token service
          const hasAccess = this.hasRequiredRole(
            currentUser.roles,
            allowedRoles
          );

          if (hasAccess) {
            console.log(
              '[GUARD] Access granted with cached roles:',
              currentUser.roles
            );
            return of(true);
          } else {
            console.warn(
              '[GUARD] Access denied - user roles:',
              currentUser.roles,
              'required:',
              allowedRoles
            );
            return of(
              this.router.parseUrl('/auth/user-login?redirect=' + state.url)
            );
          }
        }

        // If no cached roles, verify with backend (edge case - shouldn't happen after init)
        console.log('[GUARD] No cached roles, verifying with backend...');
        return this.verifyRoleWithBackend(allowedRoles, state.url);
      })
    );
  }

  private verifyRoleWithBackend(
    allowedRoles: string[],
    currentUrl: string
  ): Observable<boolean | UrlTree> {
    // Call backend endpoint - refresh token sent automatically via cookie
    return this.userService.getUserRoleByRefreshToken().pipe(
      map((response: any) => {
        console.log('[GUARD] Backend role response:', response);

        if (!response?.isSuccess || !response?.data) {
          console.warn('[GUARD] Failed to get roles from backend');
          return this.router.parseUrl(
            '/auth/user-login?redirect=' + currentUrl
          );
        }

        const userRoles = response.data.roles || [];
        const isAdmin = response.data.isAdmin;
        const isUser = response.data.isUser;

        // Update token service with fresh user data
        this.tokenService.setAuthData({
          userToken: this.tokenService.getAccessToken() || '',
          newRefreshToken: '', // Not needed, already in cookie
          userID: response.data.userId,
          userName: response.data.userName,
          userRole: userRoles,
        });

        // Check if user has required role
        const hasAccess = this.hasRequiredRole(
          userRoles,
          allowedRoles,
          isAdmin,
          isUser
        );

        if (hasAccess) {
          console.log('[GUARD] Access granted after backend verification');
          return true;
        } else {
          console.warn(
            '[GUARD] Access denied - user roles:',
            userRoles,
            'required:',
            allowedRoles
          );
          return this.router.parseUrl(
            '/auth/user-login?redirect=' + currentUrl
          );
        }
      }),
      catchError((error) => {
        console.error('[GUARD] Error verifying roles:', error);

        // If 401, the auth interceptor will handle token refresh
        // But if we're here, it means refresh already failed
        return of(
          this.router.parseUrl('/auth/user-login?redirect=' + currentUrl)
        );
      })
    );
  }

  private hasRequiredRole(
    userRoles: string[],
    allowedRoles: string[],
    isAdmin?: boolean,
    isUser?: boolean
  ): boolean {
    return allowedRoles.some((role) => {
      // Check by exact role name match
      if (userRoles.includes(role)) return true;

      // Check by boolean flags if provided (from backend response)
      if (isAdmin !== undefined && role === 'Admin' && isAdmin) return true;
      if (isUser !== undefined && role === 'User' && isUser) return true;

      return false;
    });
  }
}

// ============================================================================
// BONUS: Add these helper methods to your TokenService for easier role checks
// ============================================================================
// Already exists in your TokenService:
// - hasRole(role: string): boolean
// - hasAnyRole(roles: string[]): boolean
//
// You can use them in components like:
// if (this.tokenService.hasRole('Admin')) { ... }
// if (this.tokenService.hasAnyRole(['Admin', 'User'])) { ... }
