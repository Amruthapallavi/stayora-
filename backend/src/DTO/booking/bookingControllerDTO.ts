// dtos/booking/CreateBookingDTO.ts
export interface CreateBookingDTO {
  amount: number;
}

// dtos/booking/VerifyPaymentDTO.ts
export interface VerifyPaymentDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}
// dtos/booking/CancelBookingDTO.ts
export interface CancelBookingDTO {
  reason: string;
}
// dtos/booking/ListBookingsByOwnerDTO.ts
export interface ListBookingsByOwnerDTO {
  ownerId: string;
}
// dtos/common/PaginationDTO.ts
export interface PaginationDTO {
  page: number;
  limit: number;
}
