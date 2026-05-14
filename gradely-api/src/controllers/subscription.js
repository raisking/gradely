const { PrismaClient } = require('@prisma/client');
const stripeService = require('../services/stripe');
const { notFound, badReq, forbidden } = require('../utils/errors');

const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// GET /api/subscription/plans
async function getPlans(_req, res, next) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });
    res.json(plans.map(p => ({ ...p, features: p.features })));
  } catch (err) { next(err); }
}

// GET /api/subscription/status
async function getStatus(req, res, next) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
      include: { plan: true },
    });

    if (!subscription) return res.json({ active: false, subscription: null });

    const isActive = ['ACTIVE', 'TRIALING'].includes(subscription.status);
    res.json({ active: isActive, subscription });
  } catch (err) { next(err); }
}

// POST /api/subscription/checkout  — creates Stripe checkout session
async function createCheckout(req, res, next) {
  try {
    const { planId } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) return next(notFound('Plan not found.'));

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        name:  `${user.firstName} ${user.lastName}`,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripeService.createCheckoutSession({
      customerId,
      priceId:    plan.stripePriceId,
      successUrl: `${FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:  `${FRONTEND_URL}/subscription/cancel`,
      metadata:   { userId: user.id, planId },
    });

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err) { next(err); }
}

// POST /api/subscription/cancel
async function cancelSubscription(req, res, next) {
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId: req.user.id } });
    if (!sub) return next(notFound('No active subscription.'));
    if (!['ACTIVE', 'TRIALING'].includes(sub.status)) return next(badReq('Subscription is not active.'));

    await stripeService.cancelSubscription(sub.stripeSubscriptionId, true);

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data:  { cancelAtPeriodEnd: true },
      include: { plan: true },
    });

    res.json({ message: 'Subscription will cancel at period end.', subscription: updated });
  } catch (err) { next(err); }
}

// POST /api/subscription/reactivate
async function reactivateSubscription(req, res, next) {
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId: req.user.id } });
    if (!sub || !sub.cancelAtPeriodEnd) return next(badReq('No pending cancellation to reactivate.'));

    await stripeService.reactivateSubscription(sub.stripeSubscriptionId);

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data:  { cancelAtPeriodEnd: false },
      include: { plan: true },
    });

    res.json({ message: 'Subscription reactivated.', subscription: updated });
  } catch (err) { next(err); }
}

// POST /api/subscription/change-plan
async function changePlan(req, res, next) {
  try {
    const { planId } = req.body;

    const [sub, plan] = await Promise.all([
      prisma.subscription.findUnique({ where: { userId: req.user.id } }),
      prisma.subscriptionPlan.findUnique({ where: { id: planId } }),
    ]);

    if (!sub || !['ACTIVE', 'TRIALING'].includes(sub.status)) {
      return next(badReq('No active subscription.'));
    }
    if (!plan || !plan.isActive) return next(notFound('Plan not found.'));

    await stripeService.changeSubscriptionPlan(sub.stripeSubscriptionId, plan.stripePriceId);

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data:  { planId },
      include: { plan: true },
    });

    res.json({ message: 'Plan changed.', subscription: updated });
  } catch (err) { next(err); }
}

// GET /api/subscription/invoices
async function getInvoices(req, res, next) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { subscription: { userId: req.user.id } },
      orderBy: { createdAt: 'desc' },
      take: 24,
      include: { subscription: { include: { plan: { select: { name: true, interval: true } } } } },
    });
    res.json(invoices);
  } catch (err) { next(err); }
}

// GET /api/subscription/portal  — Stripe billing portal
async function getBillingPortal(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.stripeCustomerId) return next(badReq('No billing account.'));

    const session = await stripeService.createPortalSession(
      user.stripeCustomerId,
      `${FRONTEND_URL}/account`,
    );

    res.json({ portalUrl: session.url });
  } catch (err) { next(err); }
}

// POST /api/subscription/webhook  — Stripe webhook handler (raw body required)
async function handleWebhook(req, res, next) {
  let event;
  try {
    event = stripeService.constructWebhookEvent(req.body, req.headers['stripe-signature']);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode !== 'subscription') break;

        const { userId, planId } = session.metadata;
        const stripeSub = await stripeService.getSubscription(session.subscription);
        const plan      = planId
          ? await prisma.subscriptionPlan.findUnique({ where: { id: planId } })
          : await prisma.subscriptionPlan.findFirst({ where: { stripePriceId: stripeSub.items.data[0].price.id } });

        if (!plan) break;

        await prisma.subscription.upsert({
          where:  { userId },
          create: {
            userId,
            planId:              plan.id,
            stripeSubscriptionId: stripeSub.id,
            stripeCustomerId:    stripeSub.customer,
            status:              stripeSub.status.toUpperCase(),
            currentPeriodStart:  new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd:    new Date(stripeSub.current_period_end   * 1000),
            trialEnd: stripeSub.trial_end ? new Date(stripeSub.trial_end * 1000) : null,
          },
          update: {
            planId:              plan.id,
            stripeSubscriptionId: stripeSub.id,
            status:              stripeSub.status.toUpperCase(),
            currentPeriodStart:  new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd:    new Date(stripeSub.current_period_end   * 1000),
          },
        });

        // Ensure customer id is saved on user
        await prisma.user.updateMany({
          where: { id: userId },
          data:  { stripeCustomerId: stripeSub.customer },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: stripeSub.id },
          data: {
            status:             stripeSub.status.toUpperCase(),
            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd:   new Date(stripeSub.current_period_end   * 1000),
            cancelAtPeriodEnd:  stripeSub.cancel_at_period_end,
            canceledAt: stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000) : null,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: stripeSub.id },
          data:  { status: 'CANCELED', canceledAt: new Date() },
        });
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        await prisma.invoice.upsert({
          where:  { stripeInvoiceId: invoice.id },
          update: { status: 'paid', paidAt: new Date(invoice.status_transitions.paid_at * 1000), pdfUrl: invoice.invoice_pdf, hostedUrl: invoice.hosted_invoice_url },
          create: {
            stripeInvoiceId: invoice.id,
            subscription:    { connect: { stripeSubscriptionId: invoice.subscription } },
            amountCents:     invoice.amount_paid,
            currency:        invoice.currency,
            status:          'paid',
            pdfUrl:          invoice.invoice_pdf,
            hostedUrl:       invoice.hosted_invoice_url,
            paidAt:          invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
          },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription },
            data:  { status: 'PAST_DUE' },
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
}

module.exports = {
  getPlans, getStatus, createCheckout, cancelSubscription,
  reactivateSubscription, changePlan, getInvoices, getBillingPortal, handleWebhook,
};
