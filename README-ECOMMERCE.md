# Built Primal E-commerce Setup Guide

This guide explains the zero-cost e-commerce implementation for Built Primal.

## 🚀 Quick Start

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your Stripe keys and optional GitHub token.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Stripe**:
   - Create products in Stripe Dashboard
   - Generate Payment Links for each product
   - Update `src/data/products.json` with your Payment Links

4. **Deploy to Netlify**:
   ```bash
   git push origin main
   ```
   Netlify will auto-deploy with serverless functions enabled.

## 💰 Zero-Cost Architecture

### Hosting: Netlify (Free Tier)
- 100GB bandwidth/month
- 125k serverless function requests/month
- Automatic deployments from GitHub

### Payments: Stripe Payment Links
- No monthly fees
- Pay only 2.9% + 30¢ per transaction
- Handles inventory, taxes, shipping automatically

### Database: GitHub/Stripe
- Products stored in `src/data/products.json`
- Orders stored in Stripe (metadata fields)
- Optional: GitHub API for order archival

## 📁 Project Structure

```
built-primal/
├── src/
│   ├── data/
│   │   └── products.json      # Product catalog
│   ├── lib/
│   │   ├── products.ts        # Product utilities
│   │   └── cart.ts           # Cart management
│   ├── pages/
│   │   ├── store/
│   │   │   ├── index.astro   # Store listing
│   │   │   └── [slug].astro  # Product details
│   │   └── cart.astro        # Shopping cart
│   └── components/
│       ├── ProductDetail.astro
│       └── CartButton.astro
├── netlify/
│   └── functions/
│       └── stripe-webhook.ts  # Order processing
└── .env.example              # Environment template
```

## 🛒 Cart Functionality

The cart uses localStorage for persistence:

```javascript
import { addToCart, getCart } from '@/lib/cart';

// Add product to cart
addToCart(product, quantity);

// Get current cart
const cart = getCart();
```

## 💳 Stripe Integration

### Payment Links
Each product has a Stripe Payment Link:
```json
{
  "stripe_payment_link": "https://buy.stripe.com/live_xxx",
  "stripe_price_id": "price_xxx"
}
```

### Webhook Processing
The Netlify function at `/netlify/functions/stripe-webhook.ts`:
1. Verifies Stripe webhook signatures
2. Processes successful payments
3. Optionally stores orders in GitHub

### Testing Webhooks Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local function
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

## 🔧 Configuration

### Environment Variables
```env
# Stripe (Required)
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# GitHub (Optional - for order storage)
GITHUB_TOKEN=ghp_xxx
GITHUB_OWNER=your-username
GITHUB_REPO=built-primal
```

### Product Management
Edit `src/data/products.json`:
```json
{
  "id": "product-id",
  "title": "Product Name",
  "price": 99,
  "stripe_payment_link": "https://buy.stripe.com/xxx",
  "category": "equipment|digital|apparel",
  "stock": 100  // or -1 for unlimited
}
```

## 📊 Analytics & Monitoring

### Free Options:
1. **Netlify Analytics** - Basic traffic stats
2. **Stripe Dashboard** - Payment analytics
3. **GitHub API** - Order history (if enabled)
4. **Google Analytics** - Detailed user behavior

## 🚨 Production Checklist

- [ ] Replace test Stripe keys with live keys
- [ ] Update all Payment Links to live versions
- [ ] Configure Stripe webhook endpoint in Dashboard
- [ ] Set up email notifications in Stripe
- [ ] Test complete purchase flow
- [ ] Enable Netlify form notifications (contact forms)
- [ ] Configure custom domain
- [ ] Set up SSL certificate (auto with Netlify)

## 💡 Scaling Considerations

When you outgrow the free tier:

1. **Database**: Migrate to Supabase (free tier: 500MB)
2. **Images**: Use Cloudinary (free tier: 25GB)
3. **Email**: SendGrid (free tier: 100 emails/day)
4. **Search**: Algolia (free tier: 10k searches/month)

## 🔗 Resources

- [Stripe Payment Links](https://stripe.com/docs/payment-links)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Astro Documentation](https://docs.astro.build)

---

Built with 💪 by Built Primal