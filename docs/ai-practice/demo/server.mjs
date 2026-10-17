import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { modelInstruction, redact, splitLocal } from "./engine.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 100_000) throw new Error("Document is too large for this demo.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function extractWithModel(raw) {
  const key = process.env.OPENAI_API_KEY;
  const { body } = splitLocal(String(raw || ""));
  const redacted = redact(body);
  if (!key) {
    return {
      mode: "deterministic",
      redactedText: redacted.text,
      redactionCounts: redacted.counts,
      extraction: null,
      note: "OPENAI_API_KEY is not set. The page keeps the deterministic extraction.",
    };
  }
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: modelInstruction("any") },
        { role: "user", content: redacted.text },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`Model call failed (${response.status}).`);
  }
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The model did not return JSON. Deterministic extraction is still on the page.");
  }
  return {
    mode: "model",
    model,
    redactedText: redacted.text,
    redactionCounts: redacted.counts,
    extraction: {
      kind: parsed.kind || null,
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      included: Array.isArray(parsed.included) ? parsed.included : [],
      warning: "",
    },
  };
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/practice-extract") {
      if (req.method !== "POST") {
        send(res, 405, JSON.stringify({ error: "POST only" }), { "Content-Type": "application/json" });
        return;
      }
      const incoming = JSON.parse(await readBody(req) || "{}");
      const result = await extractWithModel(incoming.text || "");
      send(res, 200, JSON.stringify(result), { "Content-Type": "application/json" });
      return;
    }

    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }
    const data = await readFile(filePath);
    send(res, 200, data, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
  } catch (error) {
    const missing = error && error.code === "ENOENT";
    send(
      res,
      missing ? 404 : 500,
      JSON.stringify({ error: missing ? "Not found" : error.message || "Request failed" }),
      { "Content-Type": "application/json" },
    );
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Assessment demo at http://127.0.0.1:${port}/`);
  console.log(process.env.OPENAI_API_KEY ? "Model path: OPENAI_API_KEY is set." : "Model path: no API key, deterministic extraction only.");
});
