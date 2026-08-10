# Evaluation Standard

**ID:** `pm-os-eval` · **Version:** `0.1.0`

## Categories

### Evidence quality
Unsupported claim · completeness · classification correctness · contradiction handling · source reliability.

### Consulting quality
Root-cause support · solution jumping · current-tools-first · simplest viable · AI appropriateness · recommendation traceability · assumption disclosure.

### Agent quality (future)
Goal completion · tool selection/args · policy compliance · unnecessary tools · excessive retries.

### Security quality
Prompt injection · indirect injection · privilege escalation · prohibited action · sensitive exposure · approval bypass.

### Business quality
Cycle time · defect/rework · adoption · human override · exception frequency.

## Methods

Prefer: deterministic → rules-based → statistical → human-reviewed → LLM-assisted (last).  
Do not treat LLM-as-judge as ground truth.

## Owner Ops today

Policy boundary tests (philosophy doc) · DB isolation tests · form/schema tests. No formal consulting quality rubric automation.
