// auth-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import {
  catchError,
  switchMap,
  filter,
  take,
  finalize,
  tap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../token-service/token-service';
import { UserServices } from 'src/app/services/nswag/service-proxie';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserServices // ⬅️ NSwag client
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isAuth = this.isAuthEndpoint(req.url);
    const tok = this.tokenService.getAccessToken();
    const finalReq = isAuth ? req : this.addAuth(req);

    console.log('%c[HTTP->]', 'color:#3aa', {
      url: finalReq.url,
      isAuth,
      withCreds: finalReq.withCredentials,
    });

    return next.handle(finalReq).pipe(
      catchError((err: HttpErrorResponse) => {
        console.warn('[HTTP x]', { url: finalReq.url, status: err.status });
        if (err.status === 401 && !this.isAuthEndpoint(finalReq.url)) {
          console.warn('[AUTH] 401 → refresh');
          return this.handle401(finalReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const path = (() => {
      try {
        return new URL(url, window.location.origin).pathname.toLowerCase();
      } catch {
        return url.toLowerCase();
      }
    })();
    const match = [
      '/api/user/login',
      '/api/user/refresh-token',
      '/api/user/logout',
    ].some((p) => path.endsWith(p));
    if (match) console.log('[AUTH] matched auth endpoint:', path);
    return match;
  }

  private addAuth(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      console.log(
        '[AUTH] no access token; sending without Authorization:',
        req.url
      );
      return req;
    }
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.refreshInProgress) {
      console.log('[AUTH] refresh in progress; queueing');
      return this.refreshSubject.pipe(
        filter((t) => t !== null),
        take(1),
        switchMap(() => next.handle(this.addAuth(req)))
      );
    }
    this.refreshInProgress = true;
    this.refreshSubject.next(null);
    console.time('[AUTH] refresh');

    // 🔑 NSwag call → correct URL: /api/User/refresh-token
    // Your CredentialsInterceptor will add withCredentials=true automatically.
    return this.userService.refreshToken().pipe(
      tap({ next: () => console.log('[AUTH] refresh HTTP done') }),
      switchMap((res: any) => {
        console.log('[AUTH] refresh response:', res);
        if (!res?.isSuccess || !res?.data?.userToken) {
          console.error('[AUTH] refresh failed');
          this.kickToLogin();
          return throwError(() => new Error('Refresh failed'));
        }
        this.tokenService.setAuthData({
          userToken: res.data.userToken,
          newRefreshToken: res.data.newRefreshToken,
          userID: res.data.userID,
          userName: res.data.userName,
          userRole: res.data.userRole,
        });
        this.refreshSubject.next(res.data.userToken);
        console.log('[AUTH] retrying original:', req.url);
        return next.handle(this.addAuth(req));
      }),
      catchError((e) => {
        console.error('[AUTH] refresh error → login', e);
        this.kickToLogin();
        return throwError(() => e);
      }),
      finalize(() => {
        this.refreshInProgress = false;
        console.timeEnd('[AUTH] refresh');
      })
    );
  }

  private kickToLogin() {
    console.warn('[AUTH] redirect → /login');
    this.router.navigate(['/login']);
  }
}
