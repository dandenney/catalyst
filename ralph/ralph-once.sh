#!/bin/bash
# ralph-once.sh - Human-In-The-Loop mode
# Run a single iteration, watch the AI work, intervene as needed
# Usage: ./ralph/ralph-once.sh [component_id]
#
# Examples:
#   ./ralph/ralph-once.sh           # Work on next incomplete component
#   ./ralph/ralph-once.sh faq       # Work specifically on FAQ component

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

COMPONENT_ID="${1:-}"

# Build the prompt
PROMPT="You are converting components to editable schema-based components.

@ralph/prd.json contains the requirements for each component.
@ralph/progress.txt tracks what has been completed and any decisions made.
@CLAUDE.md contains the patterns and instructions for how to make components editable.

IMPORTANT RULES:
1. Work on ONE component per iteration
2. Before committing, run ALL feedback loops:
   - pnpm typecheck (must pass)
   - pnpm lint (must pass)
   - pnpm build (must pass)
3. Do NOT commit if any feedback loop fails - fix the issues first
4. After successful commit, update ralph/progress.txt with what was done
5. Commit progress.txt changes as part of the component commit

$(if [ -n "$COMPONENT_ID" ]; then echo "Work on the '$COMPONENT_ID' component."; else echo "Work on the next incomplete component from the PRD (where passes: false)."; fi)

Follow the pattern from existing schema components (schema-stats.tsx, schema-items.tsx).

When you have successfully:
1. Created/updated the schema types
2. Created the schema component
3. All feedback loops pass
4. Committed the changes
5. Updated progress.txt

Output: <promise>COMPLETE</promise>

If you encounter a blocker you cannot resolve, output: <promise>BLOCKED: [reason]</promise>"

echo "=== Ralph HITL Mode ==="
echo "Project: $PROJECT_ROOT"
echo "Component: ${COMPONENT_ID:-next incomplete}"
echo ""
echo "Starting Claude Code..."
echo ""

# Run claude with the prompt
claude -p "$PROMPT"
