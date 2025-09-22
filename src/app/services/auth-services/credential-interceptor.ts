// src/app/services/auth-services/credential-interceptor.ts
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  private apiOrigin = new URL(environment.apiUrl).origin;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const resolved = new URL(req.url, window.location.origin);
    const isApi = resolved.origin === this.apiOrigin;
    const shouldSet = isApi && !req.withCredentials;

    if (shouldSet) {
      const cloned = req.clone({ withCredentials: true });
      console.log('%c[Creds+] withCredentials=true', 'color:#8a2be2', {
        url: cloned.url,
        origin: resolved.origin,
        apiOrigin: this.apiOrigin,
      });
      return next.handle(cloned);
    }

    console.log('%c[Creds=]', 'color:#999', {
      url: req.url,
      withCredentials: req.withCredentials,
      origin: resolved.origin,
      apiOrigin: this.apiOrigin,
    });
    return next.handle(req);
  }
}
