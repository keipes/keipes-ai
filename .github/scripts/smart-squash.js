#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

/**
 * Smart Git Squash - Single command to analyze and squash commits
 * Reduces 8+ tool calls to 1 operation
 */

function getCommitsSinceOrigin() {
  try {
    const commits = execSync("git log --oneline origin/main..HEAD", {
      encoding: "utf8",
    }).trim();
    return commits ? commits.split("\n") : [];
  } catch (error) {
    console.error("❌ Could not get commits since origin/main:", error.message);
    return [];
  }
}

function analyzeCommits(commits) {
  const noisePatterns = /^(wip|temp|test|fix typo|debug|tmp)/i;
  const featurePatterns = /^(feat|feature|add|implement)/i;

  const noiseCommits = commits.filter((commit) => noisePatterns.test(commit));
  const featureCommits = commits.filter((commit) =>
    featurePatterns.test(commit)
  );

  return {
    total: commits.length,
    noise: noiseCommits.length,
    features: featureCommits.length,
    shouldSquash: commits.length > 2 || noiseCommits.length > 1,
    confidence: calculateConfidence(commits, noiseCommits),
  };
}

function calculateConfidence(commits, noiseCommits) {
  if (commits.length === 0) return 0;
  const noiseRatio = noiseCommits.length / commits.length;
  const volumeScore = Math.min(commits.length / 5, 1); // More commits = higher confidence
  return Math.round((noiseRatio * 0.7 + volumeScore * 0.3) * 100);
}

function generateSquashMessage(commits) {
  // Extract feature themes from commit messages
  const features = [];
  const fixes = [];
  const others = [];

  commits.forEach((commit) => {
    const msg = commit.substring(8); // Remove hash
    if (
      msg.includes("feat") ||
      msg.includes("add") ||
      msg.includes("implement")
    ) {
      features.push(msg);
    } else if (msg.includes("fix") || msg.includes("bug")) {
      fixes.push(msg);
    } else {
      others.push(msg);
    }
  });

  // Generate comprehensive commit message
  let message = "feat: consolidated feature implementation\n\n";

  if (features.length > 0) {
    message +=
      "Features:\n" + features.map((f) => `- ${f}`).join("\n") + "\n\n";
  }

  if (fixes.length > 0) {
    message += "Fixes:\n" + fixes.map((f) => `- ${f}`).join("\n") + "\n\n";
  }

  if (others.length > 0) {
    message +=
      "Other changes:\n" + others.map((o) => `- ${o}`).join("\n") + "\n\n";
  }

  message += `Squashed ${commits.length} commits for cleaner history`;

  return message;
}

function executeSmartSquash() {
  console.log("🔄 Starting smart squash analysis...");

  // Get commits to analyze
  const commits = getCommitsSinceOrigin();

  if (commits.length === 0) {
    console.log("✅ No commits to squash - already up to date");
    return;
  }

  // Analyze commits
  const analysis = analyzeCommits(commits);
  console.log(
    `📊 Analysis: ${analysis.total} commits, ${analysis.noise} noise, ${analysis.confidence}% confidence`
  );

  if (!analysis.shouldSquash) {
    console.log("✅ Git history is already clean - no squashing needed");
    return;
  }

  // Generate commit message
  const squashMessage = generateSquashMessage(commits);

  // Execute single-command squash
  const currentHash = execSync("git rev-parse --short HEAD", {
    encoding: "utf8",
  }).trim();

  try {
    console.log("🔄 Executing optimized squash...");

    // Single command chain - backup, reset, stage, commit
    execSync(
      `git branch backup-squash-${currentHash} && git reset --soft origin/main && git add . && git commit -m "${squashMessage.replace(
        /"/g,
        '\\"'
      )}"`,
      { stdio: "inherit" }
    );

    const newHash = execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
    }).trim();

    console.log(`✅ Smart squash completed!`);
    console.log(
      `📦 Squashed ${commits.length} commits → 1 clean commit (${newHash})`
    );
    console.log(`🔒 Backup created: backup-squash-${currentHash}`);
  } catch (error) {
    console.error("❌ Squash failed:", error.message);
    console.log("💡 Tip: Check git status and resolve any conflicts");
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Smart Git Squash - Single-command commit squashing

Usage:
  node smart-squash.js           # Analyze and squash commits automatically
  node smart-squash.js --dry-run # Show what would be squashed without doing it
  node smart-squash.js --help    # Show this help
        `);
    process.exit(0);
  }

  if (args.includes("--dry-run")) {
    const commits = getCommitsSinceOrigin();
    const analysis = analyzeCommits(commits);
    console.log("🔍 Dry run - would squash:");
    commits.forEach((commit, i) => console.log(`  ${i + 1}. ${commit}`));
    console.log(
      `\n📊 Analysis: ${analysis.confidence}% confidence for squashing`
    );
    process.exit(0);
  }

  executeSmartSquash();
}

module.exports = { executeSmartSquash, analyzeCommits, generateSquashMessage };
