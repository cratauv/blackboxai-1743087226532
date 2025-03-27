import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div *ngIf="errorMessage" class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ errorMessage }}
    </div>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <a routerLink="/auth/login" class="font-medium text-red-600 hover:text-red-500">
            Sign in
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div class="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    [(ngModel)]="firstName"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                </div>
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div class="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    [(ngModel)]="lastName"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  >
                </div>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  [(ngModel)]="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  [(ngModel)]="confirmPassword"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                [(ngModel)]="acceptTerms"
                required
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              >
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the
                <a href="#" class="text-red-600 hover:text-red-500">Terms of Service</a>
                and
                <a href="#" class="text-red-600 hover:text-red-500">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                [disabled]="!acceptTerms || isLoading || !registerForm.form.valid"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Create account</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i class="fab fa-google text-lg"></i>
                  <span class="ml-2">Google</span>
                </button>
              </div>

              <div>
                <button
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i class="fab fa-facebook text-lg text-blue-600"></i>
                  <span class="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Please accept the terms and conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred during registration';
      }
    });
  }
}