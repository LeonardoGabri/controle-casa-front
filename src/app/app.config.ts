import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptorFn } from './auth/intercept/auth-intercept';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
};
