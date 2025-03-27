import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Get the auth token from the service
  const token = authService.getToken();

  // Clone the request and add the authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch any errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - clear auth data and redirect to login
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        // Forbidden - redirect to home page
        router.navigate(['/']);
      }
      
      // Propagate the error
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations()
  ]
};
