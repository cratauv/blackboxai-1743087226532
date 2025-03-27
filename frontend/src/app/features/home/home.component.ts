import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50">
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto">
          <div class="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div class="sm:text-center lg:text-left">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span class="block">Find your next</span>
                  <span class="block text-red-600">perfect stay</span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Discover and book unique accommodations around the world. Whether you're looking for a cozy apartment or a luxury villa, we've got you covered.
                </p>
                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div class="rounded-md shadow">
                    <a routerLink="/listings" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10">
                      Browse Listings
                    </a>
                  </div>
                  <div class="mt-3 sm:mt-0 sm:ml-3">
                    <a routerLink="/auth/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      List Your Property
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" alt="Beautiful home interior">
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-base text-red-600 font-semibold tracking-wide uppercase">Features</h2>
            <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to find your stay
            </p>
            <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to find and book your perfect accommodation, all in one place.
            </p>
          </div>

          <div class="mt-10">
            <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <i class="fas fa-search text-xl"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Easy Search</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Find exactly what you're looking for with our powerful search filters.
                </p>
              </div>

              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <i class="fas fa-calendar text-xl"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Booking</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Book your stay instantly with our secure booking system.
                </p>
              </div>

              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <i class="fas fa-star text-xl"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Verified Reviews</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Read authentic reviews from real guests.
                </p>
              </div>

              <div class="relative">
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <i class="fas fa-shield-alt text-xl"></i>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Payments</p>
                <p class="mt-2 ml-16 text-base text-gray-500">
                  Your payments are always protected with our secure payment system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-red-50">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span class="block">Ready to find your next stay?</span>
            <span class="block text-red-600">Start browsing today.</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a routerLink="/listings" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                Get started
              </a>
            </div>
            <div class="ml-3 inline-flex rounded-md shadow">
              <a routerLink="/about" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}