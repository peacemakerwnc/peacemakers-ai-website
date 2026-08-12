# Versioning Standard

**ID:** `pm-os-versioning` · **Version:** `0.1.0`

Version anything that changes behavior or accountability:

| Artifact | Version field |
|----------|----------------|
| Peacemakers OS docs | `pm-os-x.y.z` (this folder README) |
| Peacemakers Blueprint Advisor skill | `blueprint-advisor-x.y.z` in skill frontmatter/body; record compatible `pm-os-x.y.z` (current: `blueprint-advisor-0.1.2` / `pm-os-0.1.0`) |
| Blueprint methodology / deliverable outline | deliverables README + template version field |
| Privacy notice | `PRIVACY_NOTICE_VERSION` / invitation privacy fields |
| Prompts / system instructions | future `PromptVersion` |
| Agent definitions / policies / eval rubrics | future version entities |
| Workflows / tool contracts / schemas | future + Prisma migrations |
| Models/providers | log when used |
| Recommendation / security rules | policy version IDs |

A historical run should be attributable to the behavioral configuration used at the time.
