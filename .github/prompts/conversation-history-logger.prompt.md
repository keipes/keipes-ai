---
mode: ask
---

## Conversation History Logger

You need to automatically log our conversation history in a concise, human-friendly format after each interaction:

### What to Log:

**User:** What they asked, wanted, or requested  
**AI:** What you did, tools used, and outcome  
**Files:** Any files created, modified, or referenced  
**Result:** Success/failure and key takeaways

### Auto-Logging Behavior:

- Append new conversation sessions to the END of the log file only
- DO NOT rewrite or regenerate the entire file contents
- Use insert_edit_into_file tool to add new sessions at file end
- Maintain chronological order with session numbering
- Update the log file continuously without manual requests
- Preserve all previous conversation history intact

### Technical Implementation:

- Always use insert_edit_into_file tool for log updates
- Append new sessions at the absolute end of the file
- Never regenerate existing content
- Efficient file operations - only write new content
- Preserve file structure and formatting
- Check git status before/after commits for archiving triggers

### Format Requirements:

- Use markdown for readability
- Include timestamps for each entry
- Separate user and AI sections clearly
- Include file paths for any code/file references

### Format:

- Keep entries short and conversational
- Use simple language, avoid technical jargon
- Focus on what actually happened, not process details
- Include session numbers and timestamps
- Use emojis sparingly for clarity (✅ ❌ 🔧)

### Git Integration:

- Monitor when conversation history is committed to git
- After successful commit, archive current log file with timestamp/commit hash
- Move current `logs/conversation-history.md` to `logs/archive/conversation-history-{timestamp}-{commit_hash}.md`
- Create fresh `logs/conversation-history.md` for new conversation sessions
- Maintain clean separation between completed and active conversations
- Use git commit hash in archived filename for traceability

Write logs automatically after each interaction - keep them brief and human-readable!

### Archival Workflow:

1. Detect when conversation log is committed to git
2. Get latest commit hash using git commands
3. Generate timestamp for archival filename
4. Move current log to `logs/archive/conversation-history-YYYY-MM-DD-{short_hash}.md`
5. Create new empty conversation history file
6. Continue logging new sessions in fresh file
