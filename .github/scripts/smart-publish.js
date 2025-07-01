#!/usr/bin/env node

const { execSync } = require("child_process");

/**
 * Smart Publish - Single command for complete publishing workflow
 * Combines analysis, commit staging, and push in one operation
 */

function smartPublish() {
  console.log("🚀 Smart Publish starting...");

  try {
    // Stage all changes
    execSync("git add .", { stdio: "inherit" });

    // Check if there are staged changes and commit if needed
    try {
      execSync("git diff --staged --quiet");
      console.log("ℹ️ No changes to commit");
    } catch {
      execSync('git commit -m "feat: automated publish commit"', {
        stdio: "inherit",
      });
      console.log("✅ Changes committed");
    }

    // Push to origin
    execSync("git push origin main", { stdio: "inherit" });

    console.log("✅ Smart Publish completed!");
    console.log("🌐 Changes pushed to origin/main");
  } catch (error) {
    console.error("❌ Smart Publish failed:", error.message);
    console.log("💡 Check git status and try again");
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(`
Smart Publish - Single-command publishing

Usage:
  node .github/scripts/smart-publish.js    # Auto-commit and push everything
        `);
    process.exit(0);
  }

  smartPublish();
}

module.exports = { smartPublish };
