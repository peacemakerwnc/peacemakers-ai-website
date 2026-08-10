# Agent Security Standard

**ID:** `pm-os-agent-security` · **Version:** `0.1.0`

## Principle

Security exists **outside** the model prompt. The model cannot enforce its own permissions.

## Required control themes

Least privilege · tool allowlists · authn/authz · tenant isolation · input/output validation · prompt-injection / indirect injection defenses · secrets management · data classification · redaction · context isolation · secure memory · rate/resource/budget limits · scoped credentials · network restrictions where appropriate · fail-closed consequential ops · human approval gates · anti-duplicate / idempotency · transaction integrity · rollback where feasible · supply-chain review · incident response · security & adversarial testing.

Never rely solely on “do not perform dangerous actions” instructions.

## Tool contract (minimum fields)

tool ID · purpose · owner · data accessed · operation type · READ/WRITE · permitted/prohibited resources · auth · min permission · validation · approval class · reversibility · idempotency · timeout · retry · logging · sensitive-data class.

Tool availability ≠ agent authorization.

## Owner Ops today

Invitation tokens hashed; owner session HMAC; company isolation in domain libs; audit sanitization; production guards. **No agent tool runtime yet.**
