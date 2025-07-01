---
applyTo: "conversation-history-logger"
---

# Unified Conversation-Commit Logger

## Overview

Auto-logs VS Code chat conversations and enhances git commits with conversation context. Creates rich git history combining code changes with decision-making process.

## System Behavior

### Pre-Commit Enhancement

- Reads current conversation log (`logs/conversation-history.md`)
- Extracts recent context (last 10 meaningful entries)
- Appends conversation context to commit message
- Archives conversation log with timestamp and commit hash
- Starts fresh log for next session

### Log Format

```
Original commit message

Session Context:
- User requested feature X
- Discussed implementation approach Y
- Resolved security concern Z
- Added error handling for edge case W
```

### Archival Workflow

1. **Pre-commit**: Hook enhances commit message with conversation context
2. **Post-commit**: Moves `logs/conversation-history.md` → `logs/archive/conversation-history-YYYY-MM-DD-{hash}.md`
3. **Reset**: Creates new conversation log for next session

## Technical Implementation

### Hook Installation

- Git hook: `.git/hooks/prepare-commit-msg` (Node.js)
- Automatic execution on every commit
- Enhances commit messages with conversation context
- Handles archival and log rotation

### File Structure

```
logs/
├── conversation-history.md           # Active log (gets archived on commit)
└── archive/
    ├── conversation-history-2025-01-28-abc123.md
    ├── conversation-history-2025-01-29-def456.md
    └── ...
```

### Context Extraction

- Filters meaningful conversation entries
- Excludes headers and empty lines
- Limits to recent context (10 lines max)
- Preserves decision rationale and technical discussions

## Usage Instructions

### For Assistant

1. **Log continuously**: Append entries to `logs/conversation-history.md` using `insert_edit_into_file`
2. **Keep it concise**: Short, human-friendly entries with emojis
3. **Let hook handle commits**: Hook automatically enhances commit messages
4. **No manual archival**: Hook handles all log rotation

### Entry Format

```markdown
### HH:MM - Brief description 📝

- Specific action or discussion point
- Key decisions made
- Technical considerations
```

### Benefits

- **Single workflow**: One system for both conversation tracking and git history
- **Rich commits**: Every commit has full context of why changes were made
- **Automatic archival**: No manual log management needed
- **Git consistency**: Everything versioned and searchable
- **Decision history**: Track not just what changed, but why

## Error Handling

- Graceful fallback if conversation log missing
- Prevents duplicate context addition
- Maintains git workflow if hook fails
- Creates archive directory automatically

This unified system eliminates redundancy between conversation logs and commit messages while creating richer git history with full decision context.
