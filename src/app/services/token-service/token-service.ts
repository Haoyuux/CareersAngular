// token-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: string;
  userName: string;
  roles: string[];
}

export interface LoginResponse {
  isSuccess: boolean;
  errorMessage: string | null;
  data: {
    userID: string;
    userToken: string;
    newRefreshToken: string | null;
    userName: string;
    userRole: string[];
  } | null;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly apiUrl = environment.apiUrl;

  // In-memory access token + helpers
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshTimer: any = null;
  private isRefreshing = false;
  private expiryCheckInterval: any = null;

  // App-wide state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitializedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Start periodic expiry check (every 30 seconds)
    this.startExpiryCheck();
  }

  /** Called at app bootstrap via APP_INITIALIZER */
  async initializeAuth(): Promise<void> {
    try {
      // ✅ Check if we have any cookies before attempting refresh
      const hasCookies = document.cookie.length > 0;

      if (!hasCookies) {
        console.log('[Auth] No cookies found, skipping refresh attempt');
        this.clearAuthData();
      } else {
        // Only try to refresh if we have cookies
        await this.tryRefreshToken();
        console.log('[Auth] Session restored from cookie');
      }
    } catch (error) {
      console.log('[Auth] No valid refresh token — starting unauthenticated');
      this.clearAuthData();
    } finally {
      this.isInitializedSubject.next(true);
    }
  }

  /** Getter used by interceptors */
  getAccessToken(): string | null {
    // Check if token is expired before returning
    if (this.accessToken && this.tokenExpiry) {
      if (new Date() >= this.tokenExpiry) {
        console.warn('[Auth] Access token expired, clearing...');
        this.handleTokenExpiration();
        return null;
      }
      return this.accessToken;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Optional direct login */
  async login(userName: string, password: string): Promise<LoginResponse> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${this.apiUrl}/user/login`,
        { userName, password },
        { withCredentials: true }
      )
    );

    if (res?.isSuccess && res.data) {
      this.setAuthData(res.data);
    }
    return res!;
  }

  /** Called by initializer / interceptor to rotate access token */
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;
    this.isRefreshing = true;

    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${this.apiUrl}/api/User/refresh-token`,
          {},
          { withCredentials: true }
        )
      );

      if (res?.isSuccess && res.data) {
        this.setAuthData(res.data);
        return true;
      }

      this.clearAuthData();
      return false;
    } catch (error: any) {
      // Don't log error if it's just "no refresh token" on public pages
      const isPublicPage =
        this.router.url.includes('main-dashboard') ||
        this.router.url.includes('user-login');

      if (
        !isPublicPage ||
        error?.error?.errorMessage !== 'Refresh token is required'
      ) {
        console.error('[Auth] Refresh token failed:', error);
      }

      this.clearAuthData();

      // Don't redirect if on public pages
      if (!isPublicPage) {
        this.router.navigate(['/user-authentication/user-login']);
      }

      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async tryRefreshToken(): Promise<void> {
    const ok = await this.refreshToken();
    if (!ok) throw new Error('Refresh failed');
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${this.apiUrl}/api/User/logout`,
          {},
          { withCredentials: true }
        )
      );
    } catch (e) {
      console.warn(
        '[Auth] Logout call failed, clearing local state anyway.',
        e
      );
    } finally {
      this.clearAuthData();
      this.router.navigate(['/user-authentication/user-login']);
    }
  }

  /** Store new access token + user details in memory and schedule auto-refresh */
  public setAuthData(data: NonNullable<LoginResponse['data']>): void {
    this.accessToken = data.userToken;

    const exp = this.getJwtExp(data.userToken);
    this.tokenExpiry = exp
      ? new Date(exp * 1000)
      : new Date(Date.now() + 8 * 60 * 60 * 1000);

    const user: User = {
      id: data.userID,
      userName: data.userName,
      roles: data.userRole,
    };
    this.currentUserSubject.next(user);

    this.scheduleTokenRefresh();
    console.log('[Auth] Token expires at:', this.tokenExpiry);
  }

  private clearAuthData(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.currentUserSubject.next(null);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /** Proactively refresh 5 minutes before expiry (or 30s if exp is short) */
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (!this.tokenExpiry) return;

    const bufferMs = 5 * 60 * 1000;
    let msUntilRefresh = this.tokenExpiry.getTime() - Date.now() - bufferMs;
    if (msUntilRefresh < 30_000) msUntilRefresh = 30_000; // avoid hammering

    this.refreshTimer = setTimeout(() => {
      if (this.isAuthenticated()) {
        this.tryRefreshToken().catch(() => this.clearAuthData());
      }
    }, msUntilRefresh);
  }

  // Periodic expiry check (runs every 30 seconds)
  private startExpiryCheck(): void {
    // Check every 30 seconds if token is expired
    this.expiryCheckInterval = setInterval(() => {
      if (this.tokenExpiry && new Date() >= this.tokenExpiry) {
        console.warn('[Auth] Token expired during periodic check');
        this.handleTokenExpiration();
      }
    }, 30000); // 30 seconds
  }

  // Handle token expiration
  private handleTokenExpiration(): void {
    console.log('[Auth] Handling token expiration...');
    this.clearAuthData();

    const currentUrl = this.router.url;
    const isPublicPage =
      currentUrl.includes('main-dashboard') ||
      currentUrl.includes('user-login') ||
      currentUrl.includes('user-register');

    if (
      !isPublicPage &&
      !currentUrl.includes('user-authentication/user-login')
    ) {
      this.router.navigate(['/user-authentication/user-login'], {
        queryParams: { expired: 'true' },
      });
    }
  }

  hasRole(role: string): boolean {
    const u = this.getCurrentUser();
    return u?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    const u = this.getCurrentUser();
    return roles.some((r) => u?.roles?.includes(r)) ?? false;
  }

  get isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  public isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return new Date() < this.tokenExpiry;
  }

  public getTokenRemainingTime(): number {
    if (!this.tokenExpiry) return 0;
    return Math.max(0, this.tokenExpiry.getTime() - Date.now());
  }

  private getJwtExp(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      const obj = JSON.parse(json);
      return typeof obj.exp === 'number' ? obj.exp : null;
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    if (this.expiryCheckInterval) {
      clearInterval(this.expiryCheckInterval);
    }
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}
