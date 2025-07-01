---
mode: ask
---

# Automated Publishing Assistant

## Overview

Streamlines code publishing workflows with intelligent automation. **Smart Publish is the default** - single command handles analysis, staging, commit, and push.

## Default Publishing Workflow

**When user says "publish":** Execute smart publish immediately

```bash
# Default command (1 tool call):
node .github/scripts/smart-publish.js

# What it does automatically:
# 1. Stages all changes (git add .)
# 2. Creates commit if changes exist
# 3. Pushes to origin/main
# 4. Handles errors gracefully
```

**When user says "commit":** Only commit, do not push

```bash
# Commit-only command:
git add . && git commit -m "feat: automated commit"
```

## Smart Publish Features

- **Auto-staging**: Adds all uncommitted changes
- **Conditional commits**: Only commits if changes exist
- **Single operation**: Analysis + staging + commit + push in one command
- **Error handling**: Graceful fallback if issues occur
- **No analysis overhead**: Skips unnecessary git log/status checks

## User Commands

- `"publish"` - **DEFAULT**: Execute smart publish (`node .github/scripts/smart-publish.js`)
- `"smart squash"` - Execute optimized single-command squash
- `"preview squash"` - Dry run analysis (`--dry-run` mode)
- `"publish to npm"` - Full npm workflow with squash option
- `"create release"` - GitHub release with integrated squash choice

## Efficiency Gains

- **3 tool calls → 1 command**: 67% reduction in API requests
- **No pre-analysis**: Skips git log/status unless specifically requested
- **Auto-commit**: Handles uncommitted changes automatically
- **Single decision point**: No A/B choices unless squashing needed

## For Assistant

**Default publishing behavior:**

1. User says "publish" → Execute `node .github/scripts/smart-publish.js` immediately
2. No analysis, no options, no additional prompts
3. Single tool call completes entire workflow
4. Only provide analysis if user specifically requests "preview" or "squash"

This makes publishing as simple as possible while maintaining safety through the smart-publish script's built-in error handling.
