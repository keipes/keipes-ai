---
applyTo: "**"
---

## Environment

- Windows system - use Windows-compatible commands and paths

## Command Triggers

- **"run app"** | **"start app"** → `npm run dev`
- **"build app"** | **"build project"** → `npm run build`
- **"commit"** → Execute automated commit workflow

## Git Workflow Rules

1. **Batch operations**: Combine status checks, staging, commit messages, committing, and pushing
2. **Minimize user input**: Use as few API calls as possible
3. **Never auto-push**: Always ask before pushing changes
4. **Commit message format**: Concise, descriptive, conventional commit standards with file changes and functionality
5. **Squash recommendation**: Offer to squash local commits before pushing to remote repository
