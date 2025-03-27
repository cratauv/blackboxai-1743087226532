import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UpdateProfileRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-900">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" #editForm="ngForm" class="space-y-6">
            <!-- Profile Picture -->
            <div class="flex justify-center">
              <div class="relative">
                <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-4xl text-gray-400"></i>
                </div>
                <button type="button" class="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
                  <i class="fas fa-camera"></i>
                </button>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="formData.firstName"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="formData.lastName"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                [(ngModel)]="formData.phone"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                name="bio"
                [(ngModel)]="formData.bio"
                rows="4"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {{ successMessage }}
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                (click)="goBack()"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="isLoading || !editForm.form.valid"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Save Changes</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EditProfileComponent implements OnInit {
  formData: UpdateProfileRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.formData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          bio: user.bio || ''
        };
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    this.authService.updateProfile(userId, this.formData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.isLoading = false;
        
        // Navigate back to profile after short delay
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while updating profile';
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}