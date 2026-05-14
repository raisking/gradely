const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  appInfo: { name: 'Gradely', version: '1.0.0' },
});

// ── Customer ──────────────────────────────────────────────────────────────────

async function createCustomer({ email, name, metadata = {} }) {
  return stripe.customers.create({ email, name, metadata });
}

async function getCustomer(customerId) {
  return stripe.customers.retrieve(customerId);
}

// ── Checkout / Subscription ───────────────────────────────────────────────────

async function createCheckoutSession({ customerId, priceId, successUrl, cancelUrl, trialDays = 0, metadata = {} }) {
  const params = {
    customer:             customerId,
    mode:                 'subscription',
    line_items:           [{ price: priceId, quantity: 1 }],
    success_url:          successUrl,
    cancel_url:           cancelUrl,
    metadata,
    subscription_data:    { metadata },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  };

  if (trialDays > 0) {
    params.subscription_data.trial_period_days = trialDays;
  }

  return stripe.checkout.sessions.create(params);
}

// ── Subscription management ───────────────────────────────────────────────────

async function getSubscription(subscriptionId) {
  return stripe.subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice', 'customer'] });
}

async function cancelSubscription(subscriptionId, atPeriodEnd = true) {
  if (atPeriodEnd) {
    return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  }
  return stripe.subscriptions.cancel(subscriptionId);
}

async function reactivateSubscription(subscriptionId) {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
}

async function changeSubscriptionPlan(subscriptionId, newPriceId) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: sub.items.data[0].id, price: newPriceId }],
    proration_behavior: 'create_prorations',
  });
}

// ── Customer portal ───────────────────────────────────────────────────────────

async function createPortalSession(customerId, returnUrl) {
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

// ── Invoices ──────────────────────────────────────────────────────────────────

async function listInvoices(customerId, limit = 24) {
  return stripe.invoices.list({ customer: customerId, limit });
}

// ── Webhook ───────────────────────────────────────────────────────────────────

function constructWebhookEvent(payload, signature) {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

module.exports = {
  stripe,
  createCustomer,
  getCustomer,
  createCheckoutSession,
  getSubscription,
  cancelSubscription,
  reactivateSubscription,
  changeSubscriptionPlan,
  createPortalSession,
  listInvoices,
  constructWebhookEvent,
};
