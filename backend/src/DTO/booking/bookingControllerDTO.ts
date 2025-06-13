export interface CreateBookingDTO {
  amount: number;
}

export interface VerifyPaymentDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId: string;
}
export interface CancelBookingDTO {
  reason: string;
}
export interface ListBookingsByOwnerDTO {
  ownerId: string;
}
export interface PaginationDTO {
  page: number;
  limit: number;
}

