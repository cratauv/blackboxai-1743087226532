import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { BookingService } from '../../core/services/booking.service';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-booking',
  template: `
    <div *ngIf="listing" class="max-w-md mx-auto mt-10">
      <h2 class="text-2xl font-bold mb-4">Booking for {{ listing.title }}</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="checkIn" class="block text-sm font-medium text-gray-700">Check-in Date</label>
          <input id="checkIn" type="date" [(ngModel)]="checkIn" name="checkIn" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required>
        </div>
        <div class="mb-4">
          <label for="checkOut" class="block text-sm font-medium text-gray-700">Check-out Date</label>
          <input id="checkOut" type="date" [(ngModel)]="checkOut" name="checkOut" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required>
        </div>
        <div class="mb-4">
          <label for="guests" class="block text-sm font-medium text-gray-700">Number of Guests</label>
          <input id="guests" type="number" [(ngModel)]="numberOfGuests" name="guests" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required>
        </div>
        <button type="submit" class="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Book Now</button>
      </form>
    </div>
  `
})
export class BookingComponent implements OnInit {
  listing: Listing | null = null;
  checkIn: string = '';
  checkOut: string = '';
  numberOfGuests: number = 1;

  constructor(private route: ActivatedRoute, private listingService: ListingService, private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    const listingId = this.route.snapshot.paramMap.get('id');
    if (listingId) {
      this.listingService.getListing(listingId).subscribe(listing => {
        this.listing = listing;
      });
    }
  }

  onSubmit() {
    const bookingData = {
      listing: this.listing?.id,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      numberOfGuests: this.numberOfGuests
    };
    this.bookingService.createBooking(bookingData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error(err)
    });
  }
}