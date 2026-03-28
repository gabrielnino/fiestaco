# Analytics System for Fiestaco

## Overview
Implemented a privacy-focused analytics system using **Plausible Analytics**. This system tracks user interactions without cookies, is GDPR-compliant, and provides valuable insights into user behavior.

## What's Tracked

### Automatic Tracking (via layout.tsx)
1. **Pageviews** - All page visits automatically tracked
2. **WhatsApp Clicks** - Any click on WhatsApp links
3. **Scroll Depth** - 25%, 50%, 75%, 100% scroll tracking
4. **Form Submissions** - Any form submissions
5. **Custom Element Clicks** - Elements with `data-flavor` or `data-addon` attributes

### Custom Event Tracking (via lib/analytics.ts)
1. **Flavor Selections** - When users select taco flavors
2. **Add-on Selections** - When users select add-ons
3. **Drink Selections** - When users select drinks
4. **Kit Customization** - When users build their kit (flavors + addons + drinks)
5. **WhatsApp Orders** - When users click "Order via WhatsApp"
6. **Conversions** - For completed orders (future enhancement)

## Setup Instructions

### 1. Plausible Dashboard
1. Go to [plausible.io](https://plausible.io)
2. Sign up for a free account
3. Add your site: `fiestaco.today`
4. Get your tracking script (already implemented in layout.tsx)

### 2. Environment Variables (Optional)
If you want to use a different domain for staging/dev:

```bash
# In your deployment script or environment
export PLAUSIBLE_DOMAIN="staging.fiestaco.today"
```

### 3. View Analytics
1. Login to plausible.io
2. View real-time dashboard
3. See:
   - Pageviews
   - Unique visitors
   - Bounce rate
   - Top pages
   - Custom events
   - Referrers
   - Device/browser breakdown

## Privacy Features
- ✅ No cookies required
- ✅ No personal data collected
- ✅ GDPR/CCPA/PECR compliant
- ✅ No cross-site tracking
- ✅ Data hosted in EU (GDPR compliant)
- ✅ Open-source software

## Custom Events API

### Basic Usage
```typescript
import { trackEvent } from '../lib/analytics';

// Track any custom event
trackEvent('Button Click', { button: 'special-offer' });

// Pre-defined events
trackFlavorSelect('al_pastor');
trackAddonSelect('guacamole');
trackWhatsAppOrder('al_pastor', ['guacamole', 'salsa']);
```

### Available Functions
- `trackEvent(eventName, props)` - Generic event tracking
- `trackFlavorSelect(flavorId)` - Taco flavor selection
- `trackAddonSelect(addonId)` - Add-on selection
- `trackDrinkSelect(drinkId)` - Drink selection
- `trackKitCustomization(flavors, addons, drinks)` - Kit built
- `trackWhatsAppOrder(flavor, addons)` - Order initiated
- `trackConversion(amount, currency)` - Order completed
- `trackError(type, details)` - Error tracking

## Testing
1. **Development**: Events log to console when Plausible not loaded
2. **Production**: Events sent to Plausible dashboard
3. **Verify**: Check Plausible dashboard for incoming events

## Maintenance
- No dependencies to update (CDN-based)
- Script updates automatically
- Dashboard accessible at plausible.io
- Data retention: 24 months (Plausible default)

## Cost
- **Free tier**: Up to 10,000 pageviews/month
- **Paid plans**: Start at $9/month for 10k pageviews
- **Self-hosted**: Free option available

## Next Steps
1. Set up Plausible account and verify tracking
2. Add conversion value tracking for revenue analytics
3. Set up goals/funnels in Plausible dashboard
4. Add UTM parameter tracking for marketing campaigns
5. Consider A/B testing integration

## Rollback
If needed, revert to backup:
```bash
cp ./app/layout.tsx.backup-analytics ./app/layout.tsx
```