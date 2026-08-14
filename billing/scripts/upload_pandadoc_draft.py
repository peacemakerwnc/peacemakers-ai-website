#!/usr/bin/env python3
"""Upload a local DOCX/PDF as a PandaDoc DRAFT (never send).

Usage:
  export PANDADOC_API_KEY=...
  python3 billing/scripts/upload_pandadoc_draft.py path/to/agreement.docx \\
    --name "Business Blueprint Agreement — Example Client" \\
    --recipient-email alex@example.com \\
    --recipient-first Alex --recipient-last Rivera \\
    --client-dir billing/clients/example-client
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from packet_lib import append_status, billing_root  # noqa: E402

PANDADOC_API = "https://api.pandadoc.com/public/v1"


def load_dotenv() -> None:
    env_path = billing_root() / ".env"
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


def multipart_body(
    fields: dict[str, str],
    file_field: str,
    file_path: Path,
) -> tuple[bytes, str]:
    boundary = "----PeacemakersPandaDocBoundary7MA4YWxkTrZu0gW"
    chunks: list[bytes] = []
    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode())
        chunks.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        chunks.append(value.encode("utf-8"))
        chunks.append(b"\r\n")
    mime = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    file_bytes = file_path.read_bytes()
    chunks.append(f"--{boundary}\r\n".encode())
    chunks.append(
        (
            f'Content-Disposition: form-data; name="{file_field}"; '
            f'filename="{file_path.name}"\r\n'
            f"Content-Type: {mime}\r\n\r\n"
        ).encode()
    )
    chunks.append(file_bytes)
    chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode())
    return b"".join(chunks), boundary


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser(description="Upload file as PandaDoc draft.")
    parser.add_argument("file", type=Path, help="Local .docx or .pdf")
    parser.add_argument("--name", required=True, help="Document name in PandaDoc")
    parser.add_argument("--recipient-email", required=True)
    parser.add_argument("--recipient-first", default="")
    parser.add_argument("--recipient-last", default="")
    parser.add_argument("--role", default="Client")
    parser.add_argument(
        "--client-dir",
        type=Path,
        help="Optional billing/clients/<slug> to append status.md",
    )
    parser.add_argument("--send", action="store_true", help="Forbidden")
    args = parser.parse_args()

    if args.send:
        die("Refusing to send. Draft upload only. Use send_pandadoc.py after dual approval.")

    path = args.file.expanduser().resolve()
    if not path.is_file():
        die(f"Not a file: {path}")
    if path.suffix.lower() not in {".docx", ".pdf", ".doc"}:
        die("File must be .docx or .pdf")

    api_key = os.environ.get("PANDADOC_API_KEY") or ""
    if not api_key:
        die("Set PANDADOC_API_KEY (or put it in billing/.env)")

    meta = {
        "name": args.name,
        "recipients": [
            {
                "email": args.recipient_email,
                "first_name": args.recipient_first or args.recipient_email.split("@")[0],
                "last_name": args.recipient_last or "Signer",
                "role": args.role,
            }
        ],
        "metadata": {
            "brand": "Peacemakers AI Solutions",
            "source": "peacemakers-billing-upload",
        },
        "tags": ["peacemakers", "draft", "upload"],
    }

    body, boundary = multipart_body({"data": json.dumps(meta)}, "file", path)
    req = urllib.request.Request(
        f"{PANDADOC_API}/documents",
        data=body,
        method="POST",
        headers={
            "Authorization": f"API-Key {api_key}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            created = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        die(f"PandaDoc HTTP {exc.code}: {detail}")

    doc_id = created.get("id") or created.get("uuid")
    if not doc_id:
        die(f"Unexpected response: {created}")

    status = created.get("status") or "document.uploaded"
    review_url = f"https://app.pandadoc.com/a/#/documents/{doc_id}"
    print(f"Created PandaDoc DRAFT {doc_id}")
    print(f"Status: {status} (wait until document.draft if still uploading)")
    print(f"Review: {review_url}")
    print("Add signature fields in PandaDoc UI. Do NOT send until dual approval.")

    if args.client_dir:
        append_status(
            args.client_dir.resolve(),
            [
                f"- PandaDoc document ID: {doc_id}",
                f"- PandaDoc: {review_url}",
                f"- PandaDoc source file: {path.name}",
                f"- PandaDoc status: draft (not sent)",
            ],
        )


if __name__ == "__main__":
    main()
