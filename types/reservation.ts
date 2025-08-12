export interface Reservation {
  cabin: any;
  id: string;
  cabinName: string;
  userId: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  specialRequests?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}