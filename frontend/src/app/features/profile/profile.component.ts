import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  template: `
    <div class="max-w-md mx-auto mt-10">
      <h2 class="text-2xl font-bold mb-4">Profile</h2>
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input id="name" type="text" formControlName="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" formControlName="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
        </div>
        <button type="submit" class="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Update Profile</button>
      </form>
    </div>
  `
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['']
    });

    this.loadUserProfile(); // Load user profile on initialization
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.profileForm.patchValue(profile);
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.authService.updateProfile(userId, this.profileForm.value).subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => console.error(err)
        });
      } else {
        console.error('User ID is null. Cannot update profile.');
      }
    }
  }
}