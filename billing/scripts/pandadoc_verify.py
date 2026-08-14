#!/usr/bin/env python3
"""Verify PandaDoc API connectivity (read-only).

Usage:
  export PANDADOC_API_KEY=...
  python3 billing/scripts/pandadoc_verify.py

Also loads billing/.env if present (KEY=value lines).
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

PANDADOC_API = "https://api.pandadoc.com/public/v1"


def load_dotenv() -> None:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = val


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    load_dotenv()
    api_key = os.environ.get("PANDADOC_API_KEY") or ""
    if not api_key:
        die(
            "PANDADOC_API_KEY not set. Create a key in PandaDoc Dev Center, then:\n"
            "  export PANDADOC_API_KEY='…'\n"
            "or put it in billing/.env (see billing/docs/pandadoc-setup.md)"
        )

    req = urllib.request.Request(
        f"{PANDADOC_API}/templates?count=10",
        method="GET",
        headers={
            "Authorization": f"API-Key {api_key}",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        die(f"PandaDoc HTTP {exc.code}: {detail}")

    results = data.get("results") or data.get("templates") or []
    print(f"ok: PandaDoc API connected ({len(results)} template(s) listed)")
    for t in results[:10]:
        name = t.get("name") or "(unnamed)"
        uid = t.get("id") or t.get("uuid") or "?"
        print(f"  - {name}: {uid}")
    if not results:
        print("  (no templates yet — upload/DOCX path still works)")
    print("Ready for draft uploads. Do not send without dual approval.")


if __name__ == "__main__":
    main()
