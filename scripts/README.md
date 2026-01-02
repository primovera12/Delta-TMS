# 🤖 Autonomous AI Development System

> Build the entire Wheelchair Transportation Platform automatically using AI

This system uses Claude AI to autonomously build the platform from your specification documents, task by task, with human checkpoints for quality control.

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 20+
- GitHub repository with `/docs` folder containing all spec documents
- Anthropic API key
- PostgreSQL database (or Neon/Supabase)

### 2. Setup

```bash
# Clone your repo
git clone https://github.com/yourusername/wheelchair-transport.git
cd wheelchair-transport

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Parse the roadmap into tasks
npm run parse-tasks

# Start autonomous development
npm run orchestrate:continuous
```

### 3. GitHub Actions (Recommended)

Add your secrets to GitHub:
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

The workflow will run automatically every 2 hours, or you can trigger it manually.

---

## 📁 Files

```
scripts/
├── orchestrator.ts           # Main orchestration logic
├── task-parser.ts            # Parses roadmap into tasks
├── package.json              # Dependencies
├── tasks/
│   ├── tasks.json            # Generated task list
│   └── progress.json         # Current progress
└── .github/
    └── workflows/
        └── autonomous-dev.yml # GitHub Actions workflow
```

---

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `npm run parse-tasks` | Parse DEVELOPMENT_ROADMAP.md into tasks.json |
| `npm run orchestrate` | Run the next pending task |
| `npm run orchestrate:continuous` | Run until checkpoint or complete |
| `npm run orchestrate:status` | Show current progress |
| `npm run approve-checkpoint` | Approve checkpoint to continue |

---

## 🔄 How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Parse     │────▶│  Generate   │────▶│  Validate   │
│   Task      │     │   Code      │     │   Output    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Claude    │     │   Tests     │
                    │    API      │     │   & Lint    │
                    └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Commit    │
                                        │   to Git    │
                                        └─────────────┘
```

### Task Flow

1. **Parse Tasks**: Converts DEVELOPMENT_ROADMAP.md into atomic, executable tasks
2. **Select Task**: Picks next pending task with satisfied dependencies
3. **Build Context**: Reads relevant spec files (DESIGN_SYSTEM.md, API_SPEC.md, etc.)
4. **Generate Code**: Sends task + context to Claude API
5. **Apply Code**: Writes generated files to disk
6. **Validate**: Runs linting, type-checking, tests
7. **Commit**: Commits changes to git with descriptive message
8. **Repeat**: Continues to next task

### Checkpoints

Every 10 days, the system pauses for human review:

- Day 10, 20, 30, 40, 50, 60, 70, 80, 90, 100

To approve a checkpoint:
```bash
npm run approve-checkpoint
git add scripts/tasks/progress.json
git commit -m "Approve checkpoint"
git push
```

---

## ⚙️ Configuration

Edit `CONFIG` in `orchestrator.ts`:

```typescript
const CONFIG = {
  // Claude API
  model: 'claude-sonnet-4-20250514',
  maxTokens: 8000,
  
  // Retry settings
  maxRetries: 3,
  retryDelayMs: 5000,
  
  // Rate limiting
  minDelayBetweenTasksMs: 10000,
  maxTasksPerHour: 20,
  
  // Checkpoints (days requiring human approval)
  checkpointDays: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  
  // Validation
  runTests: true,
  runLint: true,
  runTypeCheck: true,
  requireBuildPass: true,
};
```

---

## 📊 Progress Tracking

View current progress:

```bash
npm run orchestrate:status
```

Output:
```
╔══════════════════════════════════════════════════════════════════╗
║           AUTONOMOUS DEVELOPMENT PROGRESS                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Day: 23  / 100                    Phase: dispatcher              ║
║                                                                   ║
║  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  23%            ║
║                                                                   ║
║  Tasks Completed:    47 / 203                                     ║
║  Tasks Failed:       2                                            ║
║  Current Task:       Build Trip List Table Component              ║
║                                                                   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🛡️ Safety Features

### Rate Limiting
- Max 20 tasks per hour
- 10 second delay between tasks
- Respects Claude API limits

### Error Recovery
- 3 retry attempts per task
- Exponential backoff
- Failed tasks logged for review

### Rollback
- Each task is a separate commit
- Easy to revert if needed:
  ```bash
  git revert HEAD
  ```

### Human Oversight
- Checkpoints every 10 days
- GitHub issues created for failures
- Progress visible in Actions

---

## 🐛 Troubleshooting

### Task keeps failing

1. Check the error in `scripts/tasks/progress.json`
2. View the task in `scripts/tasks/tasks.json`
3. Try running manually with more context
4. Skip the task:
   ```bash
   # Edit tasks.json and set status: "skipped"
   ```

### Build errors

```bash
# Check what's wrong
npm run build

# Fix and continue
npm run orchestrate
```

### API rate limits

Adjust in `CONFIG`:
```typescript
minDelayBetweenTasksMs: 30000,  // 30 seconds
maxTasksPerHour: 10,            // Reduce rate
```

---

## 📈 Estimated Timeline

| Phase | Days | Tasks | Est. Duration |
|-------|------|-------|---------------|
| Foundation | 1-10 | ~30 | 2-3 days |
| Authentication | 11-15 | ~15 | 1-2 days |
| Dispatcher | 16-30 | ~40 | 3-4 days |
| Driver | 31-45 | ~35 | 3-4 days |
| Admin | 46-60 | ~35 | 3-4 days |
| Facility | 61-75 | ~25 | 2-3 days |
| Patient/Family | 76-85 | ~20 | 2 days |
| Advanced | 86-95 | ~20 | 2 days |
| Polish | 96-100 | ~10 | 1-2 days |
| **Total** | 100 | ~230 | **~20-25 days** |

*Running 24/7 with GitHub Actions at ~10 tasks/hour*

---

## 🤝 Contributing

The system generates code, but you can:

1. Review and improve generated code
2. Add new tasks to `task-parser.ts`
3. Improve validation rules
4. Enhance the orchestrator logic

---

## 📄 License

MIT

---

*Built with ❤️ and Claude AI*
