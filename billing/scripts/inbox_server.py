#!/usr/bin/env python3
"""Write-only HTTP inbox for sealed invoice packets (ChatGPT Custom GPT Action).

Hard rules:
  - POST /invoice-packet only (no list/read of repo files)
  - Auth via X-Inbox-Secret (or Authorization: Bearer <secret>)
  - Writes one JSON file under billing/inbox/
  - Response body is {ok, path, idempotency_key} only

Usage:
  export INBOX_SECRET=your-long-random-secret
  python3 billing/scripts/inbox_server.py
  # Optional: --host 127.0.0.1 --port 8787

Point a local tunnel (ngrok/cloudflared) at this port for Custom GPT Actions.
Never expose without a strong secret. Never give ChatGPT read tools.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import billing_root, validate_packet, write_inbox_packet  # noqa: E402


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


class InboxHandler(BaseHTTPRequestHandler):
    secret: str = ""

    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _read_json(self) -> dict | None:
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 200_000:
            return None
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None
        return data if isinstance(data, dict) else None

    def _check_auth(self) -> bool:
        header_secret = self.headers.get("X-Inbox-Secret") or ""
        auth = self.headers.get("Authorization") or ""
        bearer = ""
        if auth.lower().startswith("bearer "):
            bearer = auth[7:].strip()
        provided = header_secret or bearer
        return bool(self.secret) and provided == self.secret

    def _send(self, code: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in {"/", "/health"}:
            # Health only — never list inbox or return file contents
            self._send(200, {"ok": True, "service": "peacemakers-invoice-inbox"})
            return
        self._send(404, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path != "/invoice-packet":
            self._send(404, {"ok": False, "error": "not_found"})
            return

        if not self._check_auth():
            self._send(401, {"ok": False, "error": "unauthorized"})
            return

        data = self._read_json()
        if data is None:
            self._send(400, {"ok": False, "error": "invalid_json"})
            return

        errors = validate_packet(data)
        if errors:
            self._send(400, {"ok": False, "error": "validation_failed", "details": errors})
            return

        try:
            out = write_inbox_packet(data)
        except FileExistsError as exc:
            self._send(409, {"ok": False, "error": "duplicate", "message": str(exc)})
            return
        except ValueError as exc:
            self._send(400, {"ok": False, "error": "validation_failed", "details": [str(exc)]})
            return

        # Prefer path relative to repo root (parent of billing/)
        try:
            rel = str(out.relative_to(billing_root().parent))
        except ValueError:
            rel = str(out)

        self._send(
            201,
            {
                "ok": True,
                "path": rel,
                "idempotency_key": data["idempotency_key"],
            },
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Write-only invoice packet inbox server.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    args = parser.parse_args()

    secret = os.environ.get("INBOX_SECRET") or ""
    if not secret or len(secret) < 16:
        die("Set INBOX_SECRET to a random string (≥16 chars) before starting the inbox server")

    InboxHandler.secret = secret
    server = HTTPServer((args.host, args.port), InboxHandler)
    print(f"Peacemakers invoice inbox listening on http://{args.host}:{args.port}")
    print("POST /invoice-packet  (header X-Inbox-Secret required)")
    print("GET  /health")
    print(f"Writes to {billing_root() / 'inbox'}")
    print("No send / no Stripe — Cursor drafts only after you review.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
