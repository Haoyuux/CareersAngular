// token.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

export interface User {
  id: string;
  userName: string;
  roles: string[];
}

export interface LoginResponse {
  isSuccess: boolean;
  errorMessage: string;
  data: {
    userID: string;
    userToken: string;
    newRefreshToken: string | null;
    userName: string;
    userRole: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly apiUrl = environment.apiUrl; // Your API URL

  // Memory storage for access token
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshTimer: any = null;
  private isRefreshing = false;

  // BehaviorSubjects for state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitializedSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  // Initialize authentication on app start
  private async initializeAuth(): Promise<void> {
    try {
      await this.tryRefreshToken();
    } catch (error) {
      console.log('No valid refresh token found');
    } finally {
      this.isInitializedSubject.next(true);
    }
  }

  // Get access token for NSwag
  getAccessToken(): string | null {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Login method (call your NSwag generated client here)
  async login(userName: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.http
        .post<LoginResponse>(
          `${this.apiUrl}/user/login`,
          { userName, password },
          { withCredentials: true }
        )
        .toPromise();

      if (response?.isSuccess && response.data) {
        this.setAuthData(response.data);
      }

      return response!;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token method
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) {
      return false;
    }

    this.isRefreshing = true;

    try {
      const response = await this.http
        .post<LoginResponse>(
          `${this.apiUrl}/user/refresh-token`,
          {},
          { withCredentials: true }
        )
        .toPromise();

      if (response?.isSuccess && response.data) {
        this.setAuthData(response.data);
        return true;
      }

      this.clearAuthData();
      return false;
    } catch (error) {
      this.clearAuthData();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Try refresh token (used internally)
  private async tryRefreshToken(): Promise<void> {
    const success = await this.refreshToken();
    if (!success) {
      throw new Error('Refresh failed');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.http
        .post(`${this.apiUrl}/user/logout`, {}, { withCredentials: true })
        .toPromise();
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Set authentication data
  public setAuthData(data: LoginResponse['data']): void {
    this.accessToken = data.userToken;
    this.tokenExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

    const user: User = {
      id: data.userID,
      userName: data.userName,
      roles: data.userRole,
    };
    this.currentUserSubject.next(user);

    this.scheduleTokenRefresh();
  }

  // Clear authentication data
  private clearAuthData(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.currentUserSubject.next(null);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.tokenExpiry) return;

    const refreshTime = this.tokenExpiry.getTime() - Date.now() - 5 * 60 * 1000;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        if (this.isAuthenticated()) {
          this.tryRefreshToken().catch(() => this.clearAuthData());
        }
      }, refreshTime);
    }
  }

  // Check roles
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return roles.some((role) => user?.roles?.includes(role)) ?? false;
  }

  // Get refreshing status
  get isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }
}
