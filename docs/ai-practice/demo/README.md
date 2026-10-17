# Assessment demo

A working sample of the assessment pattern: a field document in, an editable rate card, a draft PDF out, and a person in the middle.

The companies, people, addresses, and prices are fictional. Cape Fear Drainage Co., Oak Island Comfort Co., and Harborline Homes are not clients.

## Run it locally

From the repository root:

```bash
node docs/ai-practice/demo/server.mjs
```

Open http://127.0.0.1:4173/

That path needs no API key. It prices the three built-in samples with the deterministic extractor.

Check the math without a browser:

```bash
node docs/ai-practice/demo/self-check.mjs
```

Expected fictional totals: storm structures `$3,210`, HVAC `$741`, selections `$13,768`.

## Use a model

The page calls `POST /api/practice-extract` only if you click **Try the model**. The local server redacts the document again and, when `OPENAI_API_KEY` is set, sends that redacted text to OpenAI. The contact block is removed before that call. The rate card still sets the price.

```bash
OPENAI_API_KEY=sk-... node docs/ai-practice/demo/server.mjs
```

Optional: `OPENAI_MODEL` (default `gpt-4.1-mini`). If the key is missing, or the call fails, the page keeps the deterministic result. The key stays in the environment. It is not written into the page.

Do not put a real client file in this demo. The samples are the only documents it is meant to see.

## What the page is showing

- The contact block (name, phone, email, service address, account) is held in the browser and is not part of the text a model would receive.
- Emails, phone numbers, Social Security numbers, and labeled account numbers elsewhere in the text are replaced before a model call.
- The server does not write the upload to disk. The audit log lives in the page's memory and records the event, not the document. A refresh clears both.
- Export stays off until someone checks the review box and types their initials.

Screenshots of the three samples, and the approved export state, are in `artifacts/` next to this file (`storm.png`, `hvac.png`, `builder.png`, `approved.png`, `assessment-demo.gif`).

## On the public site

If this repository's Vercel project publishes the repo root, the demo is a static page at `/docs/ai-practice/demo/`. `/practice-demo` redirects there. That hosted page is the no-key path. The model route exists only in `server.mjs`, so a preview will not call OpenAI even if a key exists in some other Vercel project.
