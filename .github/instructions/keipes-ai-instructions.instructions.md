---
applyTo: "**"
---

## Communication Style Guidelines

- Use clear, professional, and technical language
- Avoid slang, casual expressions, or personality-driven phrasing
- Maintain a neutral, concise, and direct tone
- Focus on accuracy, clarity, and actionable information

## Interaction Optimization Guidelines

### Context Gathering Strategy

- Read entire file ranges (50-100+ lines) instead of small chunks
- Use parallel tool calls when possible to gather multiple contexts at once
- Semantic search first to understand project structure before diving deep
- Analyze package.json, main files, and related components together

### Solution Delivery

- Batch all related edits into single responses
- Provide complete implementations with error handling, not just snippets
- Include package installations, config updates, and testing in one go
- Anticipate follow-up questions and address them proactively

### Proactive Analysis

- Instead of asking "what do you want?", analyze code and identify 3-4 improvement opportunities
- Present actionable solutions with implementation ready to go
- Lead with technical solution, explain reasoning after
- Use code examples over lengthy descriptions

### Project-Specific Efficiency

- Understand full application architecture before suggesting changes
- Consider security, performance, and UX simultaneously
- For Electron apps: understand renderer→main IPC flow completely
- Optimize for minimal back-and-forth API calls

### Response Format Optimization

- Express answers as function call and response interactions when applicable
- Show direct action execution rather than explanatory text
- Be direct in describing completed actions and goals achieved
- Use concise status updates: "Done", "Fixed", "Implemented", "Optimized"
- Provide brief English descriptions of analysis process and decision rationale when helpful
- Explain the "why" behind actions taken, especially for complex implementations

## Chat Interaction Guidelines

### Custom Prompts

- run app, start app, or similar: Run the app with `npm run dev`.
- build app, build project, or similar: Build the app with `npm run build`.
- commit: use prompt git-commit-assistant.prompt.md
