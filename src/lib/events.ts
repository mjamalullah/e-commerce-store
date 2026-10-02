import prisma from "./prisma";

export type EventName =
  | "customer.registered"
  | "product.viewed"
  | "cart.added"
  | "cart.removed"
  | "checkout.started"
  | "order.created"
  | "order.delivered"
  | "review.submitted"
  | "form.submitted";

export interface LogEventParams {
  eventName: EventName;
  entityType?: "Order" | "Product" | "Customer" | "Form" | "Cart";
  entityId?: string;
  payload?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
}

/**
 * Universal Event Dispatcher & Audit Logger
 * Logs system events to EventLog table for analytics, audit trails, and webhooks.
 */
export async function logEvent({
  eventName,
  entityType,
  entityId,
  payload = {},
  userId,
  ipAddress,
}: LogEventParams) {
  try {
    return await prisma.eventLog.create({
      data: {
        eventName,
        entityType,
        entityId,
        payload: JSON.stringify(payload),
        userId,
        ipAddress,
      },
    });
  } catch (error) {
    console.warn("Failed to log event:", error);
    return null;
  }
}
