import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <a routerLink="/" class="text-red-500 text-2xl font-bold">
                  <i class="fas fa-home mr-2"></i>
                  Airbnb Clone
                </a>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="flex items-center space-x-4">
              <ng-container *ngIf="!(isAuthenticated$ | async); else authenticatedNav">
                <a 
                  routerLink="/auth/login"
                  class="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <a 
                  routerLink="/auth/register"
                  class="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </a>
              </ng-container>

              <ng-template #authenticatedNav>
                <a 
                  routerLink="/profile"
                  class="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <i class="fas fa-user mr-2"></i>
                  Profile
                </a>
                <button 
                  (click)="logout()"
                  class="text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </ng-template>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div class="text-gray-500 text-sm">
              © 2024 Airbnb Clone. All rights reserved.
            </div>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-500 hover:text-red-500">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="text-gray-500 hover:text-red-500">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="text-gray-500 hover:text-red-500">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  isAuthenticated$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}