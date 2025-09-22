// nswag-auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
  HttpBackend,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../token-service/token-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);
  private httpBare: HttpClient;

  constructor(
    httpBackend: HttpBackend,
    private router: Router,
    private TokenStorage: TokenService
  ) {
    this.httpBare = new HttpClient(httpBackend);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    debugger;
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    const authed = this.addAuth(req);

    return next.handle(authed).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.isAuthEndpoint(req.url)) {
          return this.handle401(authed, next);
        }
        return throwError(() => err);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const u = url.toLowerCase();
    return (
      u.includes('/auth/login') ||
      u.includes('/auth/refresh-token') ||
      u.includes('/auth/logout')
    );
  }

  private addAuth(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.TokenStorage.getAccessToken();
    return token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;
  }

  private handle401(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.refreshInProgress) {
      return this.refreshSubject.pipe(
        filter((t) => t !== null),
        take(1),
        switchMap(() => next.handle(this.addAuth(req)))
      );
    }

    this.refreshInProgress = true;
    this.refreshSubject.next(null);

    const rt = this.TokenStorage.refreshToken();
    if (!rt) {
      this.kickToLogin();
      return throwError(() => new Error('No refresh token'));
    }

    return this.httpBare
      .post<any>(
        '/api/auth/refresh-token',
        { refreshToken: rt },
        { headers: new HttpHeaders({ 'x-skip-interceptor': 'true' }) }
      )
      .pipe(
        switchMap((res) => {
          if (!res?.isSuccess || !res?.data?.userToken) {
            this.kickToLogin();
            return throwError(() => new Error('Refresh failed'));
          }

          this.TokenStorage.setAuthData({
            userToken: res.data.userToken,
            newRefreshToken: res.data.newRefreshToken,
            userID: res.data.userID,
            userName: res.data.userName,
            userRole: res.data.userRole,
          });

          this.refreshSubject.next(res.data.userToken);
          return next.handle(this.addAuth(req));
        }),
        catchError((e) => {
          this.kickToLogin();
          return throwError(() => e);
        }),
        finalize(() => {
          this.refreshInProgress = false;
        })
      );
  }

  private kickToLogin() {
    // this.TokenStorage.clear();
    this.router.navigate(['/login']);
  }
}
