import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// material + forms
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NSwag services
import {
  API_BASE_URL,
  HrmsServices,
  UserServices,
} from './services/nswag/service-proxie';

// env + toastr
import { environment } from './environments/environment';
import { provideToastr } from 'ngx-toastr';

// your services / interceptors
import { NgxToastrMessageComponent } from './services/ngx-toastr-message/ngx-toastr-message.component';
import { authService } from './services/auth-services/auth-services';
import { AuthInterceptor } from './services/Interceptor/auth-interceptor';
import { CredentialsInterceptor } from './services/auth-services/credential-interceptor';
import { TokenService } from './services/token-service/token-service';

// ---- APP INITIALIZER factory ----
export function initAuth(tokenService: TokenService) {
  // Must return a function that returns a Promise<void>
  return () => tokenService.initializeAuth();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // NSwag and other app services
    HrmsServices,
    UserServices,
    NgxToastrMessageComponent,
    authService,

    // Core providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideToastr(),

    // Module imports
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule
    ),

    // NSwag base URL (should be like http://localhost:5000/api)
    { provide: API_BASE_URL, useValue: environment.apiUrl },

    // 🔑 Run silent refresh BEFORE app renders
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [TokenService],
      multi: true,
    },

    // Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
  ],
};
