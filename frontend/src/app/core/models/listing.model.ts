export interface Listing {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  amenities: string[];
  propertyType: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  rating: number;
}