# Local write-only inbox

Prefer running:

```bash
export INBOX_SECRET=your-long-random-secret
python3 billing/scripts/inbox_server.py --host 127.0.0.1 --port 8787
```

See [../README.md](../README.md) and [../docs/chatgpt-action-openapi.yaml](../docs/chatgpt-action-openapi.yaml).

This folder is reserved for a future deployed receiver if you later want a Vercel/host endpoint that commits packets via a narrow GitHub write token. Until then, the Python server is the supported ChatGPT Action target (via tunnel).
