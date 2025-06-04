// mappers/booking.mapper.ts

import { IBooking } from "../models/booking.model";
import { BookingDTO } from "../DTO/BookingResponseDTO";

export const mapBookingToDTO = (booking: IBooking): BookingDTO => ({
  bookingId: booking.bookingId,
  userId: booking.userId.toString(),
  ownerId: booking.ownerId.toString(),
  propertyId: booking.propertyId.toString(),
  propertyName: booking.propertyName,
  propertyImages: booking.propertyImages,
  moveInDate: booking.moveInDate.toISOString(),
  rentalPeriod: booking.rentalPeriod,
  endDate: booking.endDate.toISOString(),
  rentPerMonth: booking.rentPerMonth,
  addOn: booking.addOn.map(addOn => ({
    serviceId: addOn.serviceId.toString(),
    serviceName: addOn.serviceName,
    serviceCost: addOn.serviceCost,
    contactNumber: addOn.contactNumber,
    contactMail: addOn.contactMail,
  })),
  addOnCost: booking.addOnCost,
  totalCost: booking.totalCost,
  paymentMethod: booking.paymentMethod,
  paymentId: booking.paymentId,
  paymentStatus: booking.paymentStatus,
  bookingStatus: booking.bookingStatus,
  isCancelled: booking.isCancelled,
  cancellationReason: booking.cancellationReason,
  refundAmount: booking.refundAmount,
  createdAt: booking.createdAt.toISOString(),
  updatedAt: booking.updatedAt.toISOString(),
});
