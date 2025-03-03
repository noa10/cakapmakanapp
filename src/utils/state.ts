import { BaseMessage } from "@langchain/core/messages";
import { z } from "zod";

// Define the state schema
export const OrderStateSchema = z.object({
  messages: z.array(z.custom<BaseMessage>()),
  current_restaurant: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    menu: z.array(z.any()).optional(),
  }).optional(),
  order_items: z.array(z.object({
    item_id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    options: z.array(z.any()).optional(),
  })).default([]),
  delivery_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  order_id: z.string().optional(),
  order_status: z.enum(['draft', 'confirmed', 'placed', 'processing', 'delivered']).default('draft'),
});

export type OrderState = z.infer<typeof OrderStateSchema>; 