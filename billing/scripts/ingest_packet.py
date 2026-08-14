#!/usr/bin/env python3
"""Validate and drop a sealed invoice packet into billing/inbox/.

Usage:
  python3 billing/scripts/ingest_packet.py path/to/packet.json
  cat packet.json | python3 billing/scripts/ingest_packet.py -
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow running as script from repo root
sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import validate_packet, write_inbox_packet  # noqa: E402


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest sealed invoice packet into inbox.")
    parser.add_argument(
        "packet",
        type=str,
        help="Path to JSON packet, or '-' for stdin",
    )
    args = parser.parse_args()

    if args.packet == "-":
        raw = sys.stdin.read()
    else:
        path = Path(args.packet)
        if not path.is_file():
            die(f"Not a file: {path}")
        raw = path.read_text(encoding="utf-8")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        die(f"Invalid JSON: {exc}")

    if not isinstance(data, dict):
        die("Packet must be a JSON object")

    errors = validate_packet(data)
    if errors:
        die("; ".join(errors))

    try:
        out = write_inbox_packet(data)
    except FileExistsError as exc:
        die(str(exc), code=409)
    except ValueError as exc:
        die(str(exc))

    print(f"ok: wrote {out}")
    print(f"idempotency_key: {data['idempotency_key']}")
    print("Next: peacemakers-invoice-draft skill (dry-run then draft). Do not send.")


if __name__ == "__main__":
    main()
