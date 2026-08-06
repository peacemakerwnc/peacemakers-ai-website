# A4-1 reproduction evidence

## Environment

- `next start --port 3001` (production build)
- Chromium Playwright headless
- Fictional Optimum Demo Contractors only

## Timeline (pre-fix)

| Step | Observation |
|------|-------------|
| Owner login | PASS |
| Open evidence hub | PASS — 200 HTML |
| Click Create | POST 200 server action |
| DB | Row `cmsgxv1ab001litkxl93opi8z` created |
| RSC | GET for `/evidence/cmsgxv1ab001litkxl93opi8z` fired |
| URL | Remained `/evidence` |
| Button | Stuck / detached; no navigation |
| Duration | ~124s before abandon |
| Duplicates from that single click | 1 record (not duplicated by the hang itself) |

## Conclusion before code change

Failure is **client pending + soft navigation**, not meeting creation domain logic.
