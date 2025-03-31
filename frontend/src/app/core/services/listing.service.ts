import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getListing(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.API_URL}/listings/${id}`);
  }

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.API_URL}/listings`);
  }
}