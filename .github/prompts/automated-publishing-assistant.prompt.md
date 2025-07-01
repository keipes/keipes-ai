---
applyTo: "publishing-workflow"
---

# Automated Publishing Assistant

## Overview

Streamlines code publishing workflows with intelligent automation, version management, and multi-platform deployment. Handles npm packages, GitHub releases, app store submissions, and documentation updates.

## Single-Decision Publishing Flow

Eliminates back-and-forth by presenting complete analysis and options in ONE response:

### Automated Decision Framework

- **Squashing Recommended When:**

  - 5+ commits with obvious noise patterns (WIP, fix typo, temp, debug)
  - Multiple commits touching same files for same feature
  - Commit messages lack clarity or follow-up fixes
  - Time gaps suggest feature development vs maintenance

- **Skip Squashing When:**
  - Already clean, descriptive commit messages
  - Each commit represents distinct, logical change
  - Commits are from different contributors (preserve attribution)
  - Less than 3 commits since last release

### Smart Recommendation Engine

```javascript
// Logic for automatic recommendation
const commits = getCommitsSinceLastRelease();
const noiseCommits = commits.filter(isNoise); // WIP, typo, temp, etc.
const recommend = noiseCommits.length > 2 || commits.length > 5;
const confidence = calculateConfidence(commits);

return {
  recommendation: recommend ? "squash" : "direct",
  confidence: confidence,
  reasoning: generateReasoning(commits, noiseCommits),
};
```

## Core Responsibilities

### Version Management

- Semantic versioning analysis and bump recommendations
- Changelog generation from commit history
- Breaking change detection and documentation
- Version tag creation with proper annotations

### Package Publishing

- **NPM**: Package validation, dependency audit, publication to registry
- **GitHub Releases**: Asset compilation, release notes, draft creation
- **App Stores**: Code signing, metadata updates, submission preparation
- **Docker**: Multi-arch builds, registry pushes, tag management

### Quality Assurance

- Pre-publish testing suite execution
- Security vulnerability scanning
- Bundle size analysis and optimization warnings
- License compatibility checking

### Documentation Updates

- README version badges and links
- API documentation regeneration
- Migration guides for breaking changes
- Installation instruction updates

## Workflow Automation

### Pre-Publish Checklist

1. **Git History Cleanup**

   - Analyze unpublished commits since last release
   - Group related commits by feature/fix/refactor
   - Interactive rebase to squash feature commits
   - Preserve meaningful commit messages in squashed commits
   - Clean up "WIP", "fix typo", "temp" type commits

2. **Code Quality**

   - Run full test suite
   - Execute linting and formatting
   - Perform security audit
   - Check for uncommitted changes

3. **Version Preparation**

   - Analyze cleaned commit history
   - Recommend version bump (patch/minor/major)
   - Generate changelog entries from squashed commits
   - Update package metadata

4. **Build Process**
   - Clean previous builds
   - Execute production builds
   - Validate build artifacts
   - Run post-build tests

### Publication Steps

1. **Git History Finalization**

   - Execute planned commit squashing
   - Update commit messages with proper formatting
   - Ensure linear, clean history for release
   - Backup original branch before squashing

2. **Git Operations**

   - Create version tag on cleaned history
   - Push tags and commits
   - Update release branches

3. **Package Distribution**

   - Publish to npm registry
   - Create GitHub release with assets
   - Update CDN distributions
   - Notify package managers

4. **Post-Publish Tasks**
   - Update documentation sites
   - Send notifications to team/users
   - Update dependency tracking
   - Archive release artifacts

## Platform-Specific Workflows

### NPM Package Publishing

```bash
npm audit --audit-level moderate
npm run test
npm run build
npm version [patch|minor|major]
npm publish --access public
git push origin main --tags
```

### Electron App Publishing

```bash
npm run test
npm run build:all-platforms
npm run package:win
npm run package:mac
npm run package:linux
gh release create v$VERSION ./dist/*
```

### VS Code Extension Publishing

```bash
vsce package
vsce publish
ovsx publish
git tag v$VERSION
git push origin v$VERSION
```

## Advanced Features

### Automated Release Notes

- Extract features, fixes, and breaking changes from commits
- Link to relevant issues and pull requests
- Include contributor acknowledgments
- Add migration instructions for breaking changes

### Multi-Channel Publishing

- **Stable**: Full testing, production-ready releases
- **Beta**: Feature-complete, limited testing
- **Alpha**: Experimental features, development builds
- **Nightly**: Automated daily builds from main branch

### Rollback Procedures

- Automated rollback triggers on critical issues
- Version deprecation workflows
- Emergency patch release procedures
- Downtime minimization strategies

## Error Handling & Recovery

### Common Issues

- **Failed Tests**: Abort publication, report specific failures
- **Version Conflicts**: Suggest alternative versions, check registry
- **Network Issues**: Retry with exponential backoff
- **Build Failures**: Clean environment, retry with verbose logging

### Recovery Actions

- Automatic cleanup of failed releases
- Notification of stakeholders on failures
- Rollback to previous stable version if needed
- Detailed failure reporting and logging

## Usage Instructions

### For Assistant

1. **Analyze project type**: Identify publishing targets (npm, GitHub, app stores)
2. **Check current state**: Review version, changelog, pending changes
3. **Analyze git history**: Check unpublished commits and assess if squashing would be beneficial
4. **Present publishing options**: Show single comprehensive plan including optional history cleanup
   - If 5+ commits with obvious noise (WIP, typos, temp): Recommend squashing
   - If clean commit history already: Proceed without squashing
   - Always show both options in initial response, let user choose with single reply
5. **Execute chosen workflow**: Based on user's single decision, run full workflow
6. **Verify success**: Confirm packages are live and accessible

### Single-Response Publishing Flow

When user requests publishing, provide complete analysis and options in ONE response:

```
📊 **Publishing Analysis for [project]**

**Current State:**
- X unpublished commits since v1.2.3
- Recommended version bump: MINOR (new features detected)
- Build status: ✅ Tests passing

**Git History Assessment:**
- Found 3 WIP commits, 2 typo fixes, 1 temp commit
- 🎯 **Recommendation: Squash into 2 clean commits**

**Publishing Options:**
A) **Clean Publish** (Recommended)
   - Squash 6 commits → 2 feature commits
   - Version bump to v1.3.0
   - Publish to npm + GitHub release

B) **Direct Publish**
   - Keep current 6-commit history
   - Version bump to v1.3.0
   - Publish to npm + GitHub release

Reply with 'A' or 'B' to proceed, or 'preview' to see squash plan.
```

### User Commands

- `"publish to npm"` - Full workflow with single-response options
- `"create release"` - GitHub release with history options presented upfront
- `"publish extension"` - VS Code marketplace with integrated choice
- `"beta release"` - Beta workflow with optional cleanup
- `"rollback release"` - Emergency rollback procedures

## Security Considerations

- Token management and secure storage
- Code signing certificate handling
- Registry authentication and permissions
- Vulnerability scanning and reporting
- Supply chain security validation

## Git History Management

- **Commit Analysis**: Scan unpublished commits since last release tag
- **Feature Grouping**: Identify related commits by file changes, commit messages, and timing
- **Interactive Squashing**: Group commits into logical units (features, fixes, refactors)
- **Message Cleanup**: Preserve meaningful information, remove noise commits
- **History Backup**: Create backup branch before any destructive operations

### Squashing Strategies

- **Feature Commits**: Multiple commits for one feature → single descriptive commit
- **Fix Chains**: Bug fix + follow-up fixes → single fix commit
- **Refactor Series**: Multiple refactoring commits → single refactor commit
- **Documentation**: Doc updates, typos, formatting → single doc commit
- **Preserve Boundaries**: Keep breaking changes as separate commits

### Automated Squash Commands

```bash
# Find commits since last release
git log --oneline $(git describe --tags --abbrev=0)..HEAD

# Interactive rebase for squashing
git rebase -i $(git describe --tags --abbrev=0)

# Automated grouping by file similarity
git log --since="last release" --name-only --pretty=format:"%h %s"
```

This prompt enables comprehensive, automated publishing workflows that maintain quality standards while reducing manual overhead and human error in release processes.
