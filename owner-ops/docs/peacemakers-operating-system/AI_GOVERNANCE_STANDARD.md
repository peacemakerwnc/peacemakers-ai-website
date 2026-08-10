# AI Governance Standard

**ID:** `pm-os-ai` · **Version:** `0.1.0`

## Default posture

No in-app LLM/agent runtime exists in Owner Ops today (by design). This standard governs **future** AI and recommendations that mention AI.

## AI appropriateness gate (must answer before recommending AI)

1. Capability requiring AI  
2. Why deterministic logic is insufficient  
3. Ambiguity / unstructured input needing probabilistic reasoning  
4. Failure impact when wrong  
5. Error detectability  
6. Human review path  
7. Justified autonomy level  
8. Data received  
9. Sensitive data involvement  
10. Tools/actions accessible  
11. Least privilege  
12. Output validation  
13. Decisions that remain deterministic  
14. Actions requiring human approval  
15. Adequacy evidence  
16. Ongoing evaluation  
17. Fallback if model/provider fails  
18. Cost/latency constraints  
19. Model/version change control  
20. Superiority vs simpler alternative  

If insufficient → status **PROVISIONAL / NOT READY**.

## Autonomy classification

| Class | Meaning | Default |
|-------|---------|---------|
| A0 | No AI | Preferred when sufficient |
| A1 | Information only | Preferred AI start |
| A2 | Recommendation; human acts | Preferred |
| A3 | Proposed action; human approves | Preferred |
| A4 | Bounded autonomous low-risk reversible | Rare; strict policy |
| A5 | High-impact autonomous | **Not permitted** without architecture review, risk assessment, controls, owner approval |

Prefer A1–A3.

## External references (mapping only)

NIST AI RMF / GenAI guidance, OWASP GenAI / Agentic Security — map controls; do not copy wholesale.
