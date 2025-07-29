import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) {
    return { statusCode: 400, body: 'Missing stripe signature' };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      endpointSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', failedPayment.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: `Webhook processing error: ${error.message}`,
    };
  }
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  console.log('Processing successful payment for session:', session.id);
  
  // Extract order details from session
  const orderData = {
    id: session.id,
    amount: session.amount_total,
    currency: session.currency,
    customer_email: session.customer_email,
    payment_status: session.payment_status,
    created: new Date(session.created * 1000).toISOString(),
    line_items: session.line_items,
    metadata: session.metadata,
  };

  // In production, you might want to:
  // 1. Store order in GitHub via API
  // 2. Send confirmation email
  // 3. Update inventory
  // 4. Trigger fulfillment
  
  console.log('Order processed:', orderData);
  
  // Optional: Store in GitHub as a simple JSON file
  if (process.env.GITHUB_TOKEN) {
    await storeOrderInGitHub(orderData);
  }
}

async function storeOrderInGitHub(orderData: any) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
  
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.log('GitHub configuration missing, skipping order storage');
    return;
  }

  const date = new Date();
  const fileName = `orders/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/order-${orderData.id}.json`;
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add order ${orderData.id}`,
          content: Buffer.from(JSON.stringify(orderData, null, 2)).toString('base64'),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    console.log('Order stored in GitHub:', fileName);
  } catch (error) {
    console.error('Failed to store order in GitHub:', error);
  }
}