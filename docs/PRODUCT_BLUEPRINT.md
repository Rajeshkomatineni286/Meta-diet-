# METADIET AI — Delivery in strict order

1. Folder Structure: backend apps + frontend components + infra.
2. Backend code: Django/DRF modular apps with JWT, body scan, plans, payment verify.
3. Frontend code: Neural OS landing and UI primitives.
4. Database schema: User, Plan, Payment models.
5. API endpoints: /api/v1/auth, /plans/scan, /payments/create-order, /payments/verify.
6. UI components: glassmorphism panels, neon gradient hero, pulsing metrics placeholders.
7. Payment integration: Razorpay create/verify stubs + signature validation.
8. PDF system: planned via reportlab task in notifications queue (to extend in Celery).
9. Email + WhatsApp: notification endpoint and SMTP config with queue placeholder.
10. Landing page: viral sections and CTA in LandingPage component.
11. Logo concept: Neural Core circular mark with hidden M and metabolism arcs.
12. Docker setup: db + redis + backend + celery + frontend.
13. Integration fixes: end-to-end route consistency under /api/v1.
14. Performance optimization: Redis cache/celery async, JWT stateless auth, compressed static via whitenoise.
15. Monetization improvements: locked preview funnel, premium unlock on verified payment, viral share hooks.
