const router   = require('express').Router();
const express  = require('express');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/subscription');

// Stripe webhook requires raw body — must be registered BEFORE express.json() parses it.
// Mount this route BEFORE the JSON body parser in server.js.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  ctrl.handleWebhook,
);

// All other routes need JSON body parsing (express.json runs after this router in server.js,
// so we add it here for non-webhook routes).
router.use(express.json({ limit: '1mb' }));
router.use(authenticate);

router.get('/plans',         ctrl.getPlans);
router.get('/status',        ctrl.getStatus);
router.post('/checkout',     ctrl.createCheckout);
router.post('/cancel',       ctrl.cancelSubscription);
router.post('/reactivate',   ctrl.reactivateSubscription);
router.post('/change-plan',  ctrl.changePlan);
router.get('/invoices',      ctrl.getInvoices);
router.get('/portal',        ctrl.getBillingPortal);

module.exports = router;
