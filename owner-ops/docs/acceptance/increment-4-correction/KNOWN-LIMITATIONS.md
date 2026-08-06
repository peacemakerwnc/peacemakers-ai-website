# Known limitations

1. **Production readiness remains FAIL** — hosting, deploy, real-client ops, and pilot infrastructure are out of scope for this correction.
2. **Phase 2 not started** — no AI extraction, recommendations, research, ROI, email/calendar/CRM.
3. **Soft navigation** — meeting create uses hard navigation after success; other owner forms may still use `useTransition` + soft nav (not in scope unless they hang similarly).
4. **Pending visibility in automation** — hard nav can complete before Playwright samples “Creating…”; product still terminates pending via `finally`.
5. **Packet preview chrome** — intentional for owner workspace; print route is the client/print-safe surface.
6. **Unrelated dirty work** — peacemakers-ai / bookdirect / other apps untouched and uncommitted.
7. **Local SQLite only** — fictional/internal testing; not a production multi-tenant deployment.
8. **Finder `.next` duplicates** — macOS “copy” artifacts can break `tsc`; clean before gates.
