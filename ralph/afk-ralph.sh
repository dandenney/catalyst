#!/bin/bash
# afk-ralph.sh - Away From Keyboard mode
# Loop with capped iterations, work unsupervised
# Usage: ./ralph/afk-ralph.sh [max_iterations] [component_id]
#
# Examples:
#   ./ralph/afk-ralph.sh              # 5 iterations, next incomplete component
#   ./ralph/afk-ralph.sh 10           # 10 iterations, next incomplete
#   ./ralph/afk-ralph.sh 3 pricing    # 3 iterations on pricing specifically

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

MAX_ITERATIONS="${1:-5}"
COMPONENT_ID="${2:-}"
LOG_FILE="$SCRIPT_DIR/afk-log-$(date +%Y%m%d-%H%M%S).txt"

echo "=== Ralph AFK Mode ===" | tee "$LOG_FILE"
echo "Project: $PROJECT_ROOT" | tee -a "$LOG_FILE"
echo "Max iterations: $MAX_ITERATIONS" | tee -a "$LOG_FILE"
echo "Component: ${COMPONENT_ID:-next incomplete}" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Build the prompt
build_prompt() {
  cat <<EOF
You are converting components to editable schema-based components.

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

If you encounter a blocker you cannot resolve, output: <promise>BLOCKED: [reason]</promise>

If ALL components in the PRD have passes: true, output: <promise>ALL_DONE</promise>
EOF
}

PROMPT=$(build_prompt)

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "=== Iteration $i of $MAX_ITERATIONS ===" | tee -a "$LOG_FILE"
  echo "Started: $(date)" | tee -a "$LOG_FILE"

  # Run claude and capture output
  RESULT=$(claude -p "$PROMPT" 2>&1) || true

  echo "$RESULT" >> "$LOG_FILE"

  # Check for completion signals
  if [[ "$RESULT" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "" | tee -a "$LOG_FILE"
    echo "✓ Component completed successfully" | tee -a "$LOG_FILE"
    echo "Finished: $(date)" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"

    # If working on a specific component, we're done
    if [ -n "$COMPONENT_ID" ]; then
      echo "=== Specific component '$COMPONENT_ID' completed ===" | tee -a "$LOG_FILE"

      # Send notification (macOS)
      if command -v osascript &> /dev/null; then
        osascript -e "display notification \"Component $COMPONENT_ID converted successfully\" with title \"Ralph Complete\""
      fi

      exit 0
    fi

    # Otherwise, continue to next component
    continue
  fi

  if [[ "$RESULT" == *"<promise>ALL_DONE</promise>"* ]]; then
    echo "" | tee -a "$LOG_FILE"
    echo "=== All components completed! ===" | tee -a "$LOG_FILE"
    echo "Finished: $(date)" | tee -a "$LOG_FILE"

    # Send notification (macOS)
    if command -v osascript &> /dev/null; then
      osascript -e "display notification \"All component conversions complete!\" with title \"Ralph Complete\""
    fi

    exit 0
  fi

  if [[ "$RESULT" == *"<promise>BLOCKED:"* ]]; then
    echo "" | tee -a "$LOG_FILE"
    echo "=== BLOCKED ===" | tee -a "$LOG_FILE"
    # Extract the reason
    REASON=$(echo "$RESULT" | grep -oP '(?<=<promise>BLOCKED: ).*(?=</promise>)' || echo "Unknown reason")
    echo "Reason: $REASON" | tee -a "$LOG_FILE"
    echo "Finished: $(date)" | tee -a "$LOG_FILE"

    # Send notification (macOS)
    if command -v osascript &> /dev/null; then
      osascript -e "display notification \"Blocked: $REASON\" with title \"Ralph Blocked\""
    fi

    exit 1
  fi

  echo "" | tee -a "$LOG_FILE"
  echo "Iteration $i completed without clear status" | tee -a "$LOG_FILE"
  echo "Continuing to next iteration..." | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
done

echo "=== Max iterations ($MAX_ITERATIONS) reached ===" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"

# Send notification (macOS)
if command -v osascript &> /dev/null; then
  osascript -e "display notification \"Max iterations reached\" with title \"Ralph Stopped\""
fi
