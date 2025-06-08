export function generateTransactionId() {
  const timestamp = Date.now().toString(36).toUpperCase();  
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); 
  return `TXN-${timestamp}-${random}`;  
}

export function generateWalletPaymentId(): string {
  const timestamp = Date.now(); 
  const randomSegment = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WALLET_${timestamp}_${randomSegment}`;
}
