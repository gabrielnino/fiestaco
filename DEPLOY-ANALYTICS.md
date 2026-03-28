# Analytics Deployment Checklist

## Before Deployment
- [ ] Verify Plausible account is created at plausible.io
- [ ] Add site `fiestaco.today` to Plausible dashboard
- [ ] Test analytics locally using test-analytics.html
- [ ] Verify build passes: `npm run build`

## Deployment Steps
1. **Rebuild Docker image** (if using Docker):
   ```bash
   docker build -t fiestaco:latest .
   ```

2. **Deploy to staging** (if applicable):
   ```bash
   ./deploy-staging.sh
   ```

3. **Verify deployment**:
   - Visit staging site
   - Check browser console for Plausible loading
   - Make test interactions (click flavors, addons, WhatsApp)
   - Check Plausible dashboard for incoming events

4. **Deploy to production**:
   ```bash
   ./deploy-new-container.sh
   ```

## Post-Deployment Verification
- [ ] Visit fiestaco.today
- [ ] Open browser DevTools → Console
- [ ] Verify no errors related to analytics
- [ ] Make test order via WhatsApp
- [ ] Check Plausible dashboard within 5 minutes
- [ ] Verify events appear in dashboard

## Monitoring
1. **Daily check** (first week):
   - Plausible dashboard for traffic
   - Custom events tracking properly
   - No JavaScript errors in console

2. **Key metrics to watch**:
   - Pageviews per day
   - WhatsApp click-through rate
   - Most popular taco flavors
   - Add-on attachment rate
   - Conversion funnel (visit → customize → order)

## Troubleshooting

### Issue: No events in Plausible
1. Check browser console for errors
2. Verify Plausible script is loading:
   ```javascript
   // In browser console
   typeof window.plausible // should be "function"
   ```
3. Check network tab for requests to plausible.io
4. Verify domain matches in script tag

### Issue: Build fails
1. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
2. Verify analytics.ts imports correctly
3. Check for missing dependencies (none should be needed)

### Issue: Events not tracking
1. Verify event names match Plausible dashboard
2. Check custom event props format
3. Test with basic event:
   ```javascript
   window.plausible('Test', { props: { test: 'yes' } })
   ```

## Rollback Plan
If analytics cause issues:

1. **Quick rollback**:
   ```bash
   cp ./app/layout.tsx.backup-analytics ./app/layout.tsx
   npm run build
   redeploy
   ```

2. **Alternative**: Remove analytics script from layout.tsx
3. **Minimal impact**: Analytics is client-side only, no server changes

## Support
- Plausible documentation: https://plausible.io/docs
- Plausible community: https://plausible.io/community
- GitHub issues: https://github.com/plausible/analytics

## Notes
- Analytics data appears in Plausible within 1-2 minutes
- No impact on site performance (Plausible is ~1KB)
- Privacy-friendly: no cookie banner needed
- All data stored in EU (GDPR compliant)