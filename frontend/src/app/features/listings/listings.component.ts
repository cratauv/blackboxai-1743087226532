import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../core/services/listing.service';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-listings',
  template: `
    <div class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold mb-4">Available Listings</h2>
      <div *ngFor="let listing of listings" class="mb-4 border p-4 rounded-md">
        <h3 class="text-xl font-semibold">{{ listing.title }}</h3>
        <p class="text-gray-700">{{ listing.description }}</p>
        <p class="text-lg font-bold">Price: ${{ listing.price }} per night</p>
        <a [routerLink]="['/listings', listing.id]" class="text-red-600 hover:underline">View Details</a>
      </div>
    </div>
  `
})
export class ListingsComponent implements OnInit {
  listings: Listing[] = []; // Initialize listings array

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.listingService.getListings().subscribe(listings => {
      this.listings = listings;
    });
  }
}