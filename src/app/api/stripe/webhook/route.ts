import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import {
  createSubscription,
  deleteSubscription,
} from "@/app/actions/userSubscriptions";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.created",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webHookSecret =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

  if (!webHookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET was not set");
  }
  if (!signature) return;

  const stripeEvent = stripe.webhooks.constructEvent(
    body,
    signature,
    webHookSecret
  );
  const data = stripeEvent.data.object as Stripe.Subscription;

  if (relevantEvents.has(stripeEvent.type)) {
    switch (stripeEvent.type) {
      case "customer.subscription.created": {
        await createSubscription({
          stripeCustomerId: `${data.customer}`,
        });
        break;
      }
      case "customer.subscription.deleted": {
        await deleteSubscription({
          stripeCustomerId: `${data.customer}`,
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
