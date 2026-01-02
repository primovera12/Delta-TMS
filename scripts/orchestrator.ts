#!/usr/bin/env node
/**
 * Autonomous Development Orchestrator
 * 
 * This system autonomously builds the Wheelchair Transportation Platform
 * by parsing specification documents and generating code via Claude API.
 * 
 * Usage:
 *   npm run orchestrate           # Run single task
 *   npm run orchestrate:continuous # Run until complete
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Claude API
  model: 'claude-sonnet-4-20250514',
  maxTokens: 8000,
  
  // Paths
  docsDir: './docs',
  tasksFile: './scripts/tasks/tasks.json',
  progressFile: './scripts/tasks/progress.json',
  
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

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: string;
  day: number;
  phase: string;
  title: string;
  description: string;
  dependencies: string[];
  specs: string[];
  validation: ValidationRule[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  attempts: number;
  maxAttempts: number;
  output?: string;
  error?: string;
  completedAt?: string;
  filesCreated?: string[];
  filesModified?: string[];
}

interface ValidationRule {
  type: 'file_exists' | 'test_passes' | 'builds' | 'lint_passes' | 'type_check' | 'custom';
  target?: string;
  required: boolean;
}

interface Progress {
  startedAt: string;
  lastUpdated: string;
  currentDay: number;
  currentPhase: string;
  currentTaskId: string | null;
  tasksCompleted: number;
  tasksFailed: number;
  tasksSkipped: number;
  tasksRemaining: number;
  totalLinesOfCode: number;
  totalFiles: number;
  checkpointsPassed: number[];
  awaitingCheckpoint: boolean;
  errors: Array<{ taskId: string; error: string; timestamp: string }>;
}

interface GeneratedCode {
  files: Array<{
    path: string;
    content: string;
    action: 'create' | 'modify' | 'delete';
  }>;
  commands: string[];
  notes: string;
}

// ============================================================
// ORCHESTRATOR CLASS
// ============================================================

class DevelopmentOrchestrator {
  private anthropic: Anthropic;
  private tasks: Task[] = [];
  private progress: Progress;
  
  constructor() {
    this.anthropic = new Anthropic();
    this.loadTasks();
    this.loadProgress();
  }
  
  // ----------------------------------------------------------
  // INITIALIZATION
  // ----------------------------------------------------------
  
  private loadTasks(): void {
    if (!fs.existsSync(CONFIG.tasksFile)) {
      console.error('❌ Tasks file not found. Run: npm run parse-tasks');
      process.exit(1);
    }
    
    const data = JSON.parse(fs.readFileSync(CONFIG.tasksFile, 'utf-8'));
    this.tasks = data.tasks;
    console.log(`📋 Loaded ${this.tasks.length} tasks`);
  }
  
  private loadProgress(): void {
    if (fs.existsSync(CONFIG.progressFile)) {
      this.progress = JSON.parse(fs.readFileSync(CONFIG.progressFile, 'utf-8'));
      console.log(`📊 Resumed from Day ${this.progress.currentDay}`);
    } else {
      this.progress = {
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        currentDay: 1,
        currentPhase: 'foundation',
        currentTaskId: null,
        tasksCompleted: 0,
        tasksFailed: 0,
        tasksSkipped: 0,
        tasksRemaining: this.tasks.length,
        totalLinesOfCode: 0,
        totalFiles: 0,
        checkpointsPassed: [],
        awaitingCheckpoint: false,
        errors: [],
      };
      this.saveProgress();
      console.log('📊 Starting fresh');
    }
  }
  
  private saveProgress(): void {
    this.progress.lastUpdated = new Date().toISOString();
    fs.mkdirSync(path.dirname(CONFIG.progressFile), { recursive: true });
    fs.writeFileSync(CONFIG.progressFile, JSON.stringify(this.progress, null, 2));
  }
  
  // ----------------------------------------------------------
  // MAIN EXECUTION
  // ----------------------------------------------------------
  
  /**
   * Run a single task
   */
  async runNextTask(): Promise<boolean> {
    // Check for checkpoint
    if (this.progress.awaitingCheckpoint) {
      console.log('⏸️  Awaiting human checkpoint approval');
      return false;
    }
    
    // Get next task
    const task = this.getNextTask();
    if (!task) {
      console.log('✅ All tasks completed!');
      return false;
    }
    
    // Check checkpoint
    if (CONFIG.checkpointDays.includes(task.day) && 
        !this.progress.checkpointsPassed.includes(task.day)) {
      console.log(`\n🛑 CHECKPOINT: Day ${task.day}`);
      console.log('   Review progress and run: npm run approve-checkpoint');
      this.progress.awaitingCheckpoint = true;
      this.saveProgress();
      return false;
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📌 Task: ${task.id}`);
    console.log(`   Day ${task.day} | Phase: ${task.phase}`);
    console.log(`   ${task.title}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Run the task
    task.status = 'running';
    this.progress.currentTaskId = task.id;
    this.saveProgress();
    
    try {
      const result = await this.executeTask(task);
      
      if (result.success) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        task.filesCreated = result.filesCreated;
        task.filesModified = result.filesModified;
        this.progress.tasksCompleted++;
        this.progress.tasksRemaining--;
        console.log(`✅ Task completed: ${task.id}`);
        
        // Commit changes
        await this.commitChanges(task);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      task.attempts++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (task.attempts < task.maxAttempts) {
        console.log(`⚠️  Task failed (attempt ${task.attempts}/${task.maxAttempts}): ${errorMsg}`);
        task.status = 'pending'; // Will retry
      } else {
        console.log(`❌ Task failed permanently: ${errorMsg}`);
        task.status = 'failed';
        task.error = errorMsg;
        this.progress.tasksFailed++;
        this.progress.tasksRemaining--;
        this.progress.errors.push({
          taskId: task.id,
          error: errorMsg,
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    // Update progress
    this.progress.currentDay = task.day;
    this.progress.currentPhase = task.phase;
    this.saveProgress();
    this.saveTasks();
    
    return true;
  }
  
  /**
   * Run continuously until all tasks complete
   */
  async runContinuously(): Promise<void> {
    console.log('🚀 Starting continuous autonomous development...\n');
    
    let tasksThisHour = 0;
    let hourStart = Date.now();
    
    while (true) {
      // Rate limiting
      if (tasksThisHour >= CONFIG.maxTasksPerHour) {
        const elapsed = Date.now() - hourStart;
        if (elapsed < 3600000) {
          const waitTime = 3600000 - elapsed;
          console.log(`⏳ Rate limit reached. Waiting ${Math.round(waitTime / 60000)} minutes...`);
          await this.sleep(waitTime);
        }
        tasksThisHour = 0;
        hourStart = Date.now();
      }
      
      const hasMore = await this.runNextTask();
      
      if (!hasMore) {
        if (this.progress.awaitingCheckpoint) {
          console.log('\n⏸️  Paused at checkpoint. Waiting for approval...');
          await this.sleep(60000); // Check every minute
          this.loadProgress(); // Reload in case approved
          continue;
        }
        break;
      }
      
      tasksThisHour++;
      
      // Delay between tasks
      await this.sleep(CONFIG.minDelayBetweenTasksMs);
    }
    
    this.printSummary();
  }
  
  // ----------------------------------------------------------
  // TASK EXECUTION
  // ----------------------------------------------------------
  
  private getNextTask(): Task | null {
    // Find first pending task with satisfied dependencies
    for (const task of this.tasks) {
      if (task.status !== 'pending') continue;
      
      const depsComplete = task.dependencies.every(depId => {
        const dep = this.tasks.find(t => t.id === depId);
        return dep && (dep.status === 'completed' || dep.status === 'skipped');
      });
      
      if (depsComplete) return task;
    }
    return null;
  }
  
  private async executeTask(task: Task): Promise<{
    success: boolean;
    error?: string;
    filesCreated?: string[];
    filesModified?: string[];
  }> {
    // 1. Build context from spec files
    const context = await this.buildContext(task);
    
    // 2. Generate code via Claude
    const generated = await this.generateCode(task, context);
    
    // 3. Apply generated code
    const applied = await this.applyCode(generated);
    
    // 4. Run commands
    for (const cmd of generated.commands) {
      console.log(`   Running: ${cmd}`);
      try {
        execSync(cmd, { stdio: 'pipe' });
      } catch (e) {
        // Some commands may fail (e.g., tests before code exists)
        console.log(`   ⚠️  Command warning: ${cmd}`);
      }
    }
    
    // 5. Validate
    const validation = await this.validateTask(task);
    
    if (!validation.passed) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
      };
    }
    
    return {
      success: true,
      filesCreated: applied.created,
      filesModified: applied.modified,
    };
  }
  
  private async buildContext(task: Task): Promise<string> {
    let context = '';
    
    // Read relevant spec files
    for (const specFile of task.specs) {
      const specPath = path.join(CONFIG.docsDir, specFile);
      if (fs.existsSync(specPath)) {
        const content = fs.readFileSync(specPath, 'utf-8');
        context += `\n\n## ${specFile}\n\n${content}`;
      }
    }
    
    // Add current file structure
    context += '\n\n## Current Project Structure\n\n';
    context += this.getProjectStructure();
    
    return context;
  }
  
  private async generateCode(task: Task, context: string): Promise<GeneratedCode> {
    const systemPrompt = `You are an expert developer building the Wheelchair Transportation Platform.

You are working on an autonomous development system. Your code will be automatically applied and validated.

CRITICAL RULES:
1. Follow the specifications EXACTLY
2. Use the tech stack from TECH_STACK.md
3. Follow visual design from BRAND_GUIDELINES.md  
4. Include accessibility from ACCESSIBILITY_SPEC.md
5. Write clean, production-ready code
6. Include necessary imports
7. Handle errors appropriately

Your response MUST be valid JSON in this exact format:
{
  "files": [
    {
      "path": "relative/path/to/file.ts",
      "content": "full file content here",
      "action": "create"
    }
  ],
  "commands": ["npm install package-name"],
  "notes": "Any important notes about the implementation"
}

Do NOT include any text outside the JSON object.`;

    const userPrompt = `# Task: ${task.title}

## Day ${task.day} - Phase: ${task.phase}

## Description
${task.description}

## Validation Requirements
Your code must pass these checks:
${task.validation.map(v => `- ${v.type}${v.target ? `: ${v.target}` : ''}`).join('\n')}

## Relevant Specifications
${context}

Generate the code now. Remember: respond with ONLY valid JSON.`;

    console.log('   🤖 Generating code via Claude...');
    
    const response = await this.anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      messages: [
        { role: 'user', content: systemPrompt + '\n\n' + userPrompt }
      ],
    });
    
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    
    // Parse JSON response
    try {
      // Try to extract JSON if there's extra text
      let jsonStr = content.text;
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      return JSON.parse(jsonStr);
    } catch (e) {
      console.log('   ⚠️  Failed to parse JSON, attempting repair...');
      return this.repairAndParseJson(content.text);
    }
  }
  
  private repairAndParseJson(text: string): GeneratedCode {
    // Fallback: try to extract file content manually
    const files: GeneratedCode['files'] = [];
    
    // Look for code blocks
    const codeBlockRegex = /```(?:typescript|javascript|tsx|jsx|json|prisma|css)?\s*\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Try to infer filename from context
      const beforeBlock = text.slice(Math.max(0, match.index - 200), match.index);
      const filenameMatch = beforeBlock.match(/[`'"]([\w\-./]+\.(ts|tsx|js|jsx|json|prisma|css|md))[`'"]/);
      
      if (filenameMatch) {
        files.push({
          path: filenameMatch[1],
          content: match[1],
          action: 'create',
        });
      }
    }
    
    if (files.length === 0) {
      throw new Error('Could not parse generated code');
    }
    
    return { files, commands: [], notes: '' };
  }
  
  private async applyCode(generated: GeneratedCode): Promise<{
    created: string[];
    modified: string[];
  }> {
    const created: string[] = [];
    const modified: string[] = [];
    
    for (const file of generated.files) {
      const fullPath = path.resolve(file.path);
      const dir = path.dirname(fullPath);
      
      // Ensure directory exists
      fs.mkdirSync(dir, { recursive: true });
      
      const existed = fs.existsSync(fullPath);
      
      if (file.action === 'delete') {
        if (existed) fs.unlinkSync(fullPath);
        continue;
      }
      
      fs.writeFileSync(fullPath, file.content);
      
      if (existed) {
        modified.push(file.path);
        console.log(`   📝 Modified: ${file.path}`);
      } else {
        created.push(file.path);
        console.log(`   ✨ Created: ${file.path}`);
      }
    }
    
    return { created, modified };
  }
  
  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------
  
  private async validateTask(task: Task): Promise<{
    passed: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    for (const rule of task.validation) {
      if (!rule.required) continue;
      
      try {
        switch (rule.type) {
          case 'file_exists':
            if (!fs.existsSync(rule.target!)) {
              errors.push(`File not found: ${rule.target}`);
            }
            break;
            
          case 'builds':
            if (CONFIG.requireBuildPass) {
              await execAsync('npm run build');
            }
            break;
            
          case 'lint_passes':
            if (CONFIG.runLint) {
              await execAsync('npm run lint');
            }
            break;
            
          case 'type_check':
            if (CONFIG.runTypeCheck) {
              await execAsync('npm run type-check');
            }
            break;
            
          case 'test_passes':
            if (CONFIG.runTests && rule.target) {
              await execAsync(`npm test -- ${rule.target}`);
            }
            break;
            
          case 'custom':
            if (rule.target) {
              await execAsync(rule.target);
            }
            break;
        }
      } catch (e) {
        errors.push(`${rule.type} failed${rule.target ? ` (${rule.target})` : ''}`);
      }
    }
    
    return {
      passed: errors.length === 0,
      errors,
    };
  }
  
  // ----------------------------------------------------------
  // GIT OPERATIONS
  // ----------------------------------------------------------
  
  private async commitChanges(task: Task): Promise<void> {
    try {
      execSync('git add -A', { stdio: 'pipe' });
      
      const message = `🤖 Day ${task.day}: ${task.title}

Task: ${task.id}
Phase: ${task.phase}
Files: ${(task.filesCreated?.length || 0) + (task.filesModified?.length || 0)}

Auto-generated by Autonomous Development System`;
      
      execSync(`git commit -m "${message}"`, { stdio: 'pipe' });
      console.log('   📦 Changes committed');
      
      // Push if remote exists
      try {
        execSync('git push', { stdio: 'pipe' });
        console.log('   🚀 Pushed to remote');
      } catch {
        // No remote or push failed - that's ok
      }
    } catch (e) {
      console.log('   ⚠️  Git commit skipped (no changes or error)');
    }
  }
  
  // ----------------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------------
  
  private getProjectStructure(): string {
    try {
      const result = execSync('find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.json" | grep -v node_modules | grep -v .git | head -50', {
        encoding: 'utf-8',
      });
      return '```\n' + result + '```';
    } catch {
      return 'Project structure not available';
    }
  }
  
  private saveTasks(): void {
    fs.writeFileSync(CONFIG.tasksFile, JSON.stringify({ tasks: this.tasks }, null, 2));
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('                  DEVELOPMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`
  Started:        ${this.progress.startedAt}
  Completed:      ${new Date().toISOString()}
  
  Tasks Completed: ${this.progress.tasksCompleted}
  Tasks Failed:    ${this.progress.tasksFailed}
  Tasks Skipped:   ${this.progress.tasksSkipped}
  
  Total Files:     ${this.progress.totalFiles}
  Lines of Code:   ${this.progress.totalLinesOfCode}
  
  Checkpoints:     ${this.progress.checkpointsPassed.length}/10
`);
    console.log('='.repeat(60));
  }
  
  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  
  approveCheckpoint(): void {
    if (!this.progress.awaitingCheckpoint) {
      console.log('No checkpoint awaiting approval');
      return;
    }
    
    this.progress.checkpointsPassed.push(this.progress.currentDay);
    this.progress.awaitingCheckpoint = false;
    this.saveProgress();
    console.log(`✅ Checkpoint Day ${this.progress.currentDay} approved`);
  }
  
  getStatus(): Progress {
    return this.progress;
  }
  
  printProgress(): void {
    const p = this.progress;
    const total = p.tasksCompleted + p.tasksFailed + p.tasksSkipped + p.tasksRemaining;
    const percent = Math.round((p.tasksCompleted / total) * 100);
    const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
    
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           AUTONOMOUS DEVELOPMENT PROGRESS                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Day: ${String(p.currentDay).padEnd(3)} / 100                    Phase: ${p.currentPhase.padEnd(20)}║
║                                                                   ║
║  ${bar}  ${String(percent).padStart(3)}%            ║
║                                                                   ║
║  Tasks Completed:    ${String(p.tasksCompleted).padEnd(4)} / ${total}                                   ║
║  Tasks Failed:       ${String(p.tasksFailed).padEnd(4)}                                           ║
║  Current Task:       ${(p.currentTaskId || 'None').substring(0, 35).padEnd(35)}║
║                                                                   ║
║  Last Activity:      ${p.lastUpdated.substring(0, 19).padEnd(35)}║
║                                                                   ║
╚══════════════════════════════════════════════════════════════════╝
`);
  }
}

// ============================================================
// CLI
// ============================================================

const args = process.argv.slice(2);
const command = args[0] || 'next';

const orchestrator = new DevelopmentOrchestrator();

switch (command) {
  case 'next':
    orchestrator.runNextTask().then(() => {
      orchestrator.printProgress();
    });
    break;
    
  case 'continuous':
    orchestrator.runContinuously();
    break;
    
  case 'status':
    orchestrator.printProgress();
    break;
    
  case 'approve':
    orchestrator.approveCheckpoint();
    break;
    
  default:
    console.log(`
Usage: npx ts-node scripts/orchestrator.ts [command]

Commands:
  next        Run the next pending task (default)
  continuous  Run continuously until complete
  status      Show current progress
  approve     Approve checkpoint to continue
`);
}

export { DevelopmentOrchestrator };
