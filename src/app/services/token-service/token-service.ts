// token-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/app/environments/environment';

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
    userToken: string; // access token (JWT)
    newRefreshToken: string | null; // cookie is set server-side; body may be null
    userName: string;
    userRole: string[]; // roles array
  } | null;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly apiUrl = environment.apiUrl; // e.g. https://localhost:5001/api

  // In-memory access token + helpers
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null; // from JWT exp when available
  private refreshTimer: any = null;
  private isRefreshing = false;

  // App-wide state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitializedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient) {
    // APP_INITIALIZER will call initializeAuth(); don't run it here.
  }

  /** Called at app bootstrap via APP_INITIALIZER. Exchanges cookie -> access token. */
  async initializeAuth(): Promise<void> {
    try {
      await this.tryRefreshToken(); // sends cookie with withCredentials
      console.log('[Auth] Session restored from cookie');
    } catch {
      console.log('[Auth] No valid refresh token — starting unauthenticated');
      this.clearAuthData();
    } finally {
      this.isInitializedSubject.next(true);
    }
  }

  /** Getter used by interceptors */
  getAccessToken(): string | null {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Optional direct login (you use NSwag in your component; this is here for completeness) */
  async login(userName: string, password: string): Promise<LoginResponse> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${this.apiUrl}/user/login`,
        { userName, password },
        { withCredentials: true } // receive/set refresh cookie from API origin
      )
    );

    if (res?.isSuccess && res.data) {
      this.setAuthData(res.data);
    }
    return res!;
  }

  /** Called by initializer / interceptor to rotate access token using refresh cookie */
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false; // prevent parallel refreshes
    this.isRefreshing = true;

    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${this.apiUrl}/api/User/refresh-token`,
          {},
          { withCredentials: true } // send HttpOnly refresh cookie
        )
      );

      if (res?.isSuccess && res.data) {
        this.setAuthData(res.data);
        return true;
      }

      this.clearAuthData();
      return false;
    } catch {
      this.clearAuthData();
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
    }
  }

  /** Store new access token + user details in memory and schedule auto-refresh */
  public setAuthData(data: NonNullable<LoginResponse['data']>): void {
    this.accessToken = data.userToken;

    // Prefer JWT exp if present; fallback to 8h to match your server
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

  // ---- helpers ----
  /** Extract 'exp' (epoch seconds) from a JWT without verifying it */
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
}
