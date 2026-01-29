# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Catalyst project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences.

## Format

Each ADR follows this template:

```markdown
# ADR NNNN: Title

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Date
YYYY-MM-DD

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

## Alternatives Considered (optional)
What other options were evaluated?

## References (optional)
Links to relevant resources.
```

## Creating a New ADR

1. Copy the template above
2. Create a new file: `NNNN-short-title.md` (use next sequential number)
3. Fill in all sections
4. Submit for review

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](./0001-monorepo-structure.md) | Monorepo Structure with Single Catalyst Package | Accepted | 2025-01-26 |
| [0003](./0003-consumer-owned-edit-ui.md) | Consumer-Owned Edit UI Styling | Accepted | 2026-01-28 |
