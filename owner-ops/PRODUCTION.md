# Production readiness (required before real client data)

Phase 1 `owner-ops` is **local development only**.

Do **not** use on Vercel production with:

- SQLite
- Local filesystem uploads
- Single shared password auth as the long-term model
- In-memory rate limiting alone

Before production, complete a separate production-readiness phase covering:

1. Managed Postgres
2. Production-grade authentication
3. Durable private file storage (e.g. private object store)
4. Rate limiting that works across serverless instances
5. Email provider configuration (replace log adapter)
6. Backup and recovery
7. Privacy and retention policies
8. Security testing

Interfaces already exist for email (`src/lib/mail.ts`) and storage (`src/lib/storage.ts`) so providers can be swapped without rebuilding the application.
