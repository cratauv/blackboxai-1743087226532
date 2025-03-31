import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-listing',
  template: `
    <div *ngIf="listing" class="max-w-md mx-auto mt-10">
      <h2 class="text-2xl font-bold mb-4">{{ listing.title }}</h2>
      <img [src]="listing.images[0]" alt="{{ listing.title }}" class="w-full h-64 object-cover mb-4">
      <p class="text-gray-700">{{ listing.description }}</p>
      <p class="text-lg font-bold mt-4">Price: ${{ listing.price }} per night</p>
      <button class="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">Book Now</button>
    </div>
  `
})
export class ListingComponent implements OnInit {
  listing: Listing | null = null;

  constructor(private route: ActivatedRoute, private listingService: ListingService) {}

  ngOnInit() {
    const listingId = this.route.snapshot.paramMap.get('id');
    if (listingId) {
      this.listingService.getListing(listingId).subscribe(listing => {
        this.listing = listing;
      });
    }
  }
}