import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptor/auth.interceptor';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

export const appConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
  
  importProvidersFrom(CommonModule),
  ]
};
