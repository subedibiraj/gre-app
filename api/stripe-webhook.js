import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Disable Vercel's default body parser so we can access the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('No userId found in checkout session metadata');
          break;
        }

        // Retrieve the subscription to get the current period end
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        const { error } = await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: userId,
              plan: 'pro',
              stripe_customer_id: session.customer,
              plan_expires: new Date(subscription.current_period_end * 1000).toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) {
          console.error('Supabase upsert error (checkout.session.completed):', error);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { error } = await supabase
          .from('user_progress')
          .update({
            plan_expires: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Supabase update error (subscription.updated):', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { error } = await supabase
          .from('user_progress')
          .update({
            plan: 'free',
            plan_expires: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Supabase update error (subscription.deleted):', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error processing webhook event:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
