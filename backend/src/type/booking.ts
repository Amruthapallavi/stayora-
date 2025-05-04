export interface IBookingReport {
    id: string;
    userName: string;
    ownerName: string;
    propertyName: string;
    ownerEmail: string;
    userEmail: string;
    moveInDate: Date;
    endDate: Date;
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    totalCost: number;
    createdAt: Date;
  }
  