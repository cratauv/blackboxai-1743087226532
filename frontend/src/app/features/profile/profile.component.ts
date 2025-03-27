import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-red-500 h-32 relative">
          <div class="absolute -bottom-16 left-8">
            <div class="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <i class="fas fa-user text-4xl text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="pt-20 pb-8 px-8">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ currentUser?.firstName }} {{ currentUser?.lastName }}
              </h1>
              <p class="text-gray-600">{{ currentUser?.email }}</p>
            </div>
            <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
              Edit Profile
            </button>
          </div>

          <!-- Stats -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900">Bookings</h3>
              <p class="text-3xl font-bold text-red-500 mt-2">12</p>
              <p class="text-gray-600 mt-1">Total bookings made</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900">Reviews</h3>
              <p class="text-3xl font-bold text-red-500 mt-2">8</p>
              <p class="text-gray-600 mt-1">Reviews written</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900">Favorites</h3>
              <p class="text-3xl font-bold text-red-500 mt-2">15</p>
              <p class="text-gray-600 mt-1">Places saved</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-home text-red-500 text-xl mr-3"></i>
                  <div>
                    <p class="text-gray-900">Booked a stay at Mountain View Lodge</p>
                    <p class="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-star text-red-500 text-xl mr-3"></i>
                  <div>
                    <p class="text-gray-900">Left a review for Seaside Villa</p>
                    <p class="text-sm text-gray-600">5 days ago</p>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-heart text-red-500 text-xl mr-3"></i>
                  <div>
                    <p class="text-gray-900">Added Lake House to favorites</p>
                    <p class="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}