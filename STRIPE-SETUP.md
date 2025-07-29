# Stripe Payment Links Setup Guide

The "Access Denied" error occurs because the payment links in the code are placeholders. Here's how to set up real Stripe Payment Links:

## 🎯 Quick Fix Steps

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Complete your business profile

### 2. Create Products in Stripe
1. Go to **Products** in your Stripe Dashboard
2. Click **+ Add product**
3. For each product, add:
   - Product name (e.g., "Heavy Primal Rope")
   - Price ($49)
   - Description
   - Product images

### 3. Create Payment Links
1. In Stripe Dashboard, go to **Payment Links**
2. Click **+ New link**
3. Select your product
4. Configure options:
   - ✅ Collect customer address
   - ✅ Allow quantity adjustment (optional)
   - ✅ Collect phone numbers (optional)
5. Click **Create link**
6. Copy the payment link URL

### 4. Update Your Products
Edit `src/data/products.json` and replace the placeholder URLs:

```json
{
  "stripe_payment_link": "https://buy.stripe.com/live_YOUR_ACTUAL_LINK_HERE",
  "stripe_price_id": "price_YOUR_ACTUAL_PRICE_ID"
}
```

### 5. Test Mode vs Live Mode
- **Test mode**: URLs start with `https://buy.stripe.com/test_`
- **Live mode**: URLs start with `https://buy.stripe.com/` (no "test")

For testing, you can use Stripe's test credit card:
- Card number: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

## 📝 Example Payment Link Structure

A real Stripe Payment Link looks like:
```
https://buy.stripe.com/14k3dp1Bc5Qw8ow3cc
```

Not:
```
https://buy.stripe.com/test_heavy_rope_123 (placeholder)
```

## 🔧 Environment Variables

Don't forget to update `.env` with your real Stripe keys:
```env
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51... (or pk_live_51...)
STRIPE_SECRET_KEY=sk_test_51... (or sk_live_51...)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Going Live Checklist

- [ ] Switch from test to live keys in Stripe Dashboard
- [ ] Update all payment links from test to live versions
- [ ] Configure webhook endpoint in Stripe Dashboard:
  - URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
  - Events to listen for: `checkout.session.completed`
- [ ] Test a real purchase with a small amount

## 💡 Pro Tips

1. **Multiple Quantities**: Add `?quantity=2` to payment links to preset quantity
2. **Prefilled Email**: Add `?prefilled_email=customer@email.com`
3. **Custom Success URL**: Configure in Payment Link settings
4. **Shipping**: Enable shipping collection in Payment Link settings

---

Need help? Check the [Stripe Payment Links documentation](https://stripe.com/docs/payment-links)