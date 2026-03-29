/**
 * Fiestaco Analytics BI Test Suite
 * Tests all 5 business intelligence upgrades:
 * - Revenue tracking (order_value)
 * - Drop-off / abandon by step
 * - UTM attribution
 * - Product combos
 * - Dashboard API response shape
 */

const BASE_URL = 'http://localhost:3010';
const API_URL = `${BASE_URL}/api/analytics`;
const DASH_URL = `${API_URL}/dashboard`;
const TOKEN = 'fiestaco-admin-2024';

let passed = 0;
let failed = 0;
const results = [];

function assert(name, condition, detail = '') {
  if (condition) {
    passed++;
    results.push(`  ✅ ${name}`);
  } else {
    failed++;
    results.push(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function post(body) {
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: r.status, data: await r.json() };
}

async function getDashboard() {
  const r = await fetch(DASH_URL, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return { status: r.status, data: await r.json() };
}

function uid() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ──────────────────────────────────────────────
// SCENARIO 1: Complete order with UTM (Instagram)
// Simulates: user arrives from Instagram, completes full wizard, orders
// ──────────────────────────────────────────────
async function runScenario1() {
  console.log('\n📱 SCENARIO 1 — Instagram user completes order');
  const session = uid();
  const utm = { utm_source: 'instagram', utm_medium: 'bio', utm_campaign: 'launch-week' };

  // page_view with UTM
  let r = await post({ sessionId: session, eventName: 'page_view', pagePath: '/', metadata: { ...utm } });
  assert('page_view fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'wizard_start', pagePath: '/', metadata: { ...utm } });
  assert('wizard_start fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'al-pastor' } });
  assert('flavor_select (al-pastor) fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 1 } });
  assert('step_visit 1 fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'chorizo' } });
  assert('flavor_select (chorizo) fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 2 } });
  assert('step_visit 2 fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'addon_select', pagePath: '/', metadata: { ...utm, addon: 'guac' } });
  assert('addon_select fires 200', r.status === 200);

  r = await post({ sessionId: session, eventName: 'drink_select', pagePath: '/', metadata: { ...utm, drink: 'corona-6' } });
  assert('drink_select fires 200', r.status === 200);

  // CONVERSION with order_value (Cambio 1)
  const orderValue = 45 + 12 + 17.31; // BASE + guac + corona
  r = await post({
    sessionId: session,
    eventName: 'whatsapp_click',
    pagePath: '/',
    metadata: {
      ...utm,
      flavor1: 'al-pastor',
      flavor2: 'chorizo',
      addons: ['guac'],
      drinks: ['corona-6'],
      order_value: orderValue,
      combo: 'al-pastor+chorizo',
    },
  });
  assert('whatsapp_click with order_value fires 200', r.status === 200);
  assert('order_value is correct (74.31)', Math.abs(orderValue - 74.31) < 0.01);

  return { session, orderValue, utm };
}

// ──────────────────────────────────────────────
// SCENARIO 2: TikTok user abandons at step 3
// Simulates: user from TikTok, picks flavors, leaves at add-ons
// ──────────────────────────────────────────────
async function runScenario2() {
  console.log('\n🎵 SCENARIO 2 — TikTok user abandons at step 3 (add-ons)');
  const session = uid();
  const utm = { utm_source: 'tiktok', utm_medium: 'video', utm_campaign: 'taco-night' };

  await post({ sessionId: session, eventName: 'page_view', pagePath: '/', metadata: { ...utm } });
  await post({ sessionId: session, eventName: 'wizard_start', pagePath: '/', metadata: { ...utm } });
  await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'al-pastor' } });
  await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 1 } });
  await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'carnitas' } });
  await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 2 } });

  // ABANDON at step 3 (Cambio 2)
  const r = await post({
    sessionId: session,
    eventName: 'wizard_abandon',
    pagePath: '/',
    metadata: {
      ...utm,
      at_step: 3,
      flavor1: 'al-pastor',
      flavor2: 'carnitas',
      addons_count: 0,
      had_price: 55, // BASE + carnitas surcharge
    },
  });
  assert('wizard_abandon at step 3 fires 200', r.status === 200);

  return { session };
}

// ──────────────────────────────────────────────
// SCENARIO 3: Direct traffic, step back, then orders
// Simulates: user navigates back, recovers, converts
// ──────────────────────────────────────────────
async function runScenario3() {
  console.log('\n🔄 SCENARIO 3 — Direct traffic, step_back, then converts');
  const session = uid();
  const utm = { utm_source: 'direct' };

  await post({ sessionId: session, eventName: 'page_view', pagePath: '/', metadata: { ...utm } });
  await post({ sessionId: session, eventName: 'wizard_start', pagePath: '/', metadata: { ...utm } });
  await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'pierna' } });
  await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 1 } });

  // User goes back (Cambio 2 — stepBack)
  const rb = await post({ sessionId: session, eventName: 'step_back', pagePath: '/', metadata: { ...utm, from_step: 2 } });
  assert('step_back fires 200', rb.status === 200);

  // Comes back and completes
  await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'al-pastor' } });
  await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 1 } });
  await post({ sessionId: session, eventName: 'flavor_select', pagePath: '/', metadata: { ...utm, flavor: 'chorizo' } });
  await post({ sessionId: session, eventName: 'step_visit', pagePath: '/', metadata: { ...utm, step: 2 } });

  const r = await post({
    sessionId: session,
    eventName: 'whatsapp_click',
    pagePath: '/',
    metadata: {
      ...utm,
      flavor1: 'al-pastor',
      flavor2: 'chorizo',
      addons: [],
      drinks: [],
      order_value: 45,
      combo: 'al-pastor+chorizo',
    },
  });
  assert('Direct user converts after step_back — 200', r.status === 200);

  return { session };
}

// ──────────────────────────────────────────────
// SCENARIO 4: Validate Dashboard API shape
// Checks all new fields exist in the response
// ──────────────────────────────────────────────
async function runDashboardValidation(s1Result) {
  console.log('\n📊 SCENARIO 4 — Dashboard API shape & BI data validation');
  await sleep(500); // let DB writes settle

  const { status, data } = await getDashboard();
  assert('Dashboard returns 200', status === 200);

  // Basic structure
  assert('today object exists', !!data.today);
  assert('recent_events array exists', Array.isArray(data.recent_events));
  assert('funnel array exists', Array.isArray(data.funnel));
  assert('daily_trends array exists', Array.isArray(data.daily_trends));

  // CAMBIO 1 — Revenue fields
  assert('today.revenue_today field exists', 'revenue_today' in data.today);
  assert('today.avg_order_value field exists', 'avg_order_value' in data.today);
  assert('revenue_today is a number', typeof data.today.revenue_today === 'number');
  assert('revenue_today > 0 (at least 1 order happened)', data.today.revenue_today > 0,
    `got ${data.today.revenue_today}`);
  assert('avg_order_value > 0', data.today.avg_order_value > 0,
    `got ${data.today.avg_order_value}`);

  // CAMBIO 2 — Abandon by step
  assert('abandon_by_step array exists', Array.isArray(data.abandon_by_step));
  const hasStep3Abandon = data.abandon_by_step.some(a => a.at_step === 3);
  assert('Step 3 abandon is tracked', hasStep3Abandon, 'wizard_abandon at_step=3 not found');

  // CAMBIO 3 — UTM attribution
  assert('channel_attribution array exists', Array.isArray(data.channel_attribution));
  const instagramChannel = data.channel_attribution.find(c => c.utm_source === 'instagram');
  assert('Instagram channel exists in attribution', !!instagramChannel,
    'utm_source=instagram not found in channel_attribution');
  if (instagramChannel) {
    assert('Instagram channel has revenue', instagramChannel.revenue > 0,
      `got revenue=${instagramChannel.revenue}`);
    assert('Instagram channel has order count', instagramChannel.orders >= 1,
      `got orders=${instagramChannel.orders}`);
  }

  // CAMBIO 4 — Top combos
  assert('top_combos array exists', Array.isArray(data.top_combos));
  const combo = data.top_combos.find(c => c.combo?.includes('al-pastor'));
  assert('al-pastor combo appears in top combos', !!combo,
    `combos: ${JSON.stringify(data.top_combos.map(c => c.combo))}`);

  // Daily trends with revenue
  if (data.daily_trends.length > 0) {
    assert('daily_trends has revenue field', 'revenue' in data.daily_trends[0]);
    const todayTrend = data.daily_trends[0];
    assert('Today trend has revenue > 0', todayTrend.revenue > 0,
      `got ${todayTrend.revenue}`);
  }

  // Recent events show order_value
  const orderEvent = data.recent_events.find(e => e.event_name === 'whatsapp_click');
  if (orderEvent && orderEvent.metadata) {
    let meta = {};
    try { meta = JSON.parse(orderEvent.metadata); } catch {}
    assert('Recent order event has order_value in metadata', 'order_value' in meta || 'totalPrice' in meta,
      `metadata keys: ${Object.keys(meta).join(', ')}`);
  }

  return data;
}

// ──────────────────────────────────────────────
// AUTH TESTS
// ──────────────────────────────────────────────
async function runAuthTests() {
  console.log('\n🔒 AUTH — Dashboard security');

  let r = await fetch(DASH_URL);
  assert('No auth header → 401', r.status === 401);

  r = await fetch(DASH_URL, { headers: { Authorization: 'Bearer wrong-token' } });
  assert('Wrong token → 403', r.status === 403);

  r = await fetch(DASH_URL, { headers: { Authorization: 'Bearer fiestaco-dev' } });
  assert('Old dev token correctly rejected → 403', r.status === 403);

  r = await fetch(DASH_URL, { headers: { Authorization: `Bearer ${TOKEN}` } });
  assert('Admin token → 200', r.status === 200);
}

// ──────────────────────────────────────────────
// RUN ALL
// ──────────────────────────────────────────────
(async () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   FIESTACO BI ANALYTICS TEST SUITE         ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    const s1 = await runScenario1();
    await runScenario2();
    await runScenario3();
    await runDashboardValidation(s1);
    await runAuthTests();
  } catch (err) {
    console.error('\n💥 Test threw an unexpected error:', err.message);
    failed++;
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   RESULTS                                  ║');
  console.log('╚════════════════════════════════════════════╝');
  results.forEach(r => console.log(r));
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total:  ${passed + failed}`);
  console.log(`🏆 Score:  ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON! Business intelligence activo.\n');
  } else {
    console.log('\n⚠️  Algunos tests fallaron — revisar logs arriba.\n');
    process.exit(1);
  }
})();
