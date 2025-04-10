import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  bedrooms: z.string().min(1, "Bedrooms is required"),
  bathrooms: z.string().min(1, "Bathrooms is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  country: z.string().min(1, "Country is required"),
  rentPerMonth: z.string().min(1, "Rent is required"),
  securityDeposit: z.string().optional(),
  availableFrom: z.string().optional(),
  minLeasePeriod: z.string().min(1, "Minimum lease is required"),
  maxLeasePeriod: z.string().min(1, "Maximum lease is required"),
  furnishing: z.string().min(1, "Furnishing status is required"),
  petPolicy: z.string().optional(),
  rules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});
