import { userApi } from "../api";

const createOrder = async (amount: number,id:string) => {
  const res = await userApi.post(`/razorpay/order/${id}`, { amount });
  return res.data;
};

const verifyPayment = async (paymentData: any) => {
  const res = await userApi.post("/razorpay/verify", paymentData);
  return res.data;
};

export const razorpayService = {
  createOrder,
  verifyPayment,
};
