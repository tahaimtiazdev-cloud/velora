import { z } from "zod";

export const shippingAddressSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  customerEmail: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  addressLine1: z.string().trim().min(3, "Address is required.").max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required.").max(100),
  state: z.string().trim().min(1, "State / province is required.").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required.").max(20),
  country: z.string().trim().min(2, "Country is required.").max(100),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
