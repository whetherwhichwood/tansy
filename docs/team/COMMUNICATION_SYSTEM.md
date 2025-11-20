# AI Agent Communication System

## 🎯 Overview
This system allows AI agents to communicate, share instructions, and collaborate effectively through dedicated files. Each AI agent has their own instruction file that they edit, while monitoring other agents' files for tasks and coordination needs.

## 📁 File Structure
```
docs/team/communication/
├── commlog.md                  # Record of all instructions left in agent files
├── product-manager-notes.md    # Product Manager AI Agent - Owned by PM Agent
├── frontend-developer-notes.md # Frontend Developer AI Agent - Owned by Frontend Agent
└── backend-developer-notes.md  # Backend Developer AI Agent - Owned by Backend Agent
```

## 🔄 How It Works

### AI Agent Workflow
1. **Continuous Monitoring**: Each agent continuously checks other agents' instruction files
2. **Task Execution**: When instructions are found, agent incorporates details and executes tasks
3. **File Updates**: Agent updates their own instruction file with progress and new instructions for other agents
4. **Coordination**: Product Manager agent coordinates between Frontend and Backend agents
5. **Completion Loop**: Agent checks other files for new instructions and repeats until no outstanding tasks

### AI Agent Rules
- **Single File Ownership**: Each agent only edits their own instruction file
- **Continuous Monitoring**: Check other agents' files for new instructions
- **Task Incorporation**: Incorporate additional details from other agents before executing
- **Clear Instructions**: Leave specific, actionable instructions for other agents
- **Progress Updates**: Update own file with progress and next steps
- **Coordination**: PM agent coordinates between Frontend and Backend agents

## 📋 Commlog System

### Purpose
The `commlog.md` file serves as a record of all instructions left in individual agent files by the CEO and other agents. This provides an audit trail of what instructions were given to each agent.

### How It Works
1. **Instruction Recording**: Records what instructions were left in each agent file
2. **Timestamps**: Every entry includes date, time, and context
3. **Agent Status**: Tracks which agent received what instructions
4. **Individual Files**: Each agent manages their own file with current tasks and progress

### Commlog Entry Format
```markdown
#### YYYY-MM-DD HH:MM - [Instruction Title]
**From**: [Sender Name]  
**To**: [Recipient(s)]  
**Type**: [Instruction/Update/Question/Decision]  

**Instructions**:
- [Instruction 1]
- [Instruction 2]
- [Instruction 3]

**Priority**: [High/Medium/Low]  
**Due Date**: [Date/Time]  
**Status**: [Active/Completed/Cancelled]  

**Notes**: [Additional context or rationale]
```

### Benefits
- **Complete History**: Never lose track of instructions or decisions
- **Clean Context**: Individual files stay focused and readable
- **Audit Trail**: Full record of all team communications
- **Accountability**: Clear tracking of who said what and when

## 📝 File Templates

### Product Manager Notes Template
```markdown
# Product Manager Notes - [Date]

## Today's Priorities
- [ ] Priority 1
- [ ] Priority 2
- [ ] Priority 3

## Questions for Team
- **Frontend Dev**: [Question about frontend implementation]
- **Backend Dev**: [Question about backend architecture]

## Decisions Made
- [Decision 1 with rationale]
- [Decision 2 with rationale]

## Blockers/Issues
- [Blocker 1 - needs resolution]
- [Issue 1 - needs attention]

## Updates for Team
- [Update 1]
- [Update 2]

## Tomorrow's Focus
- [Focus area 1]
- [Focus area 2]
```

### Developer Notes Template
```markdown
# [Role] Developer Notes - [Date]

## Progress Today
- [ ] Completed: [Task description]
- [ ] In Progress: [Current task]
- [ ] Next: [Next task]

## Technical Notes
- **File**: `path/to/file.tsx` - [Note about implementation]
- **Issue**: [Technical issue encountered]
- **Solution**: [How it was resolved]

## Questions/Help Needed
- **For PM**: [Question about requirements]
- **For [Other Dev]**: [Question about integration]

## Code Changes
- **Modified**: [Files changed]
- **Added**: [New files created]
- **Removed**: [Files deleted]

## Testing Status
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Performance testing completed

## Blockers
- [Blocker 1 - needs help]
- [Blocker 2 - waiting for input]

## Tomorrow's Plan
- [Plan 1]
- [Plan 2]
```

## 🚀 Getting Started

### Step 1: Create Communication Files
1. Create the communication directory
2. Copy the templates above
3. Customize for your specific needs

### Step 2: Set Up Daily Routine
1. **Morning (9:00 AM)**: Read all communication files
2. **Midday (1:00 PM)**: Update your file with progress
3. **Evening (5:00 PM)**: Final update and tomorrow's plan

### Step 3: Use During Development
1. **Before starting work**: Check for updates from team
2. **During work**: Add notes about progress and issues
3. **After completing tasks**: Update status and ask questions
4. **When blocked**: Clearly describe the blocker and what help is needed

## 📊 Benefits

### For Product Manager
- **Visibility**: See what each developer is working on
- **Decision Tracking**: Record decisions and rationale
- **Issue Resolution**: Quickly identify and resolve blockers
- **Progress Monitoring**: Track project progress daily

### For Developers
- **Collaboration**: Easy way to ask questions and get help
- **Knowledge Sharing**: Share technical insights and solutions
- **Progress Tracking**: Document what you've accomplished
- **Blocker Resolution**: Get help when stuck

### For Team
- **Transparency**: Everyone knows what everyone else is doing
- **Accountability**: Clear record of progress and issues
- **Efficiency**: Quick communication without meetings
- **Documentation**: Historical record of project development

## 🔧 Best Practices

### Writing Effective Notes
- **Use Bullet Points**: Easy to scan and read
- **Include Context**: File names, line numbers, specific details
- **Be Actionable**: Clear next steps and responsibilities
- **Update Regularly**: Keep information current

### Responding to Questions
- **Be Specific**: Provide detailed answers with examples
- **Include Code**: Show code snippets when helpful
- **Ask Follow-ups**: Clarify if you need more information
- **Document Solutions**: Record how problems were solved

### Managing Blockers
- **Describe Clearly**: What exactly is blocking you
- **Include Context**: What you've tried, what you need
- **Set Expectations**: When you need help by
- **Follow Up**: Update when blocker is resolved

## 📅 Daily Standup Integration

### Standup Notes Template
```markdown
# Daily Standup - [Date]

## Frontend Developer
- **Yesterday**: [What was accomplished]
- **Today**: [What's planned]
- **Blockers**: [Any issues]

## Backend Developer
- **Yesterday**: [What was accomplished]
- **Today**: [What's planned]
- **Blockers**: [Any issues]

## Product Manager
- **Yesterday**: [What was accomplished]
- **Today**: [What's planned]
- **Blockers**: [Any issues]

## Team Decisions
- [Decision 1]
- [Decision 2]

## Action Items
- [ ] [Action item 1] - [Assigned to] - [Due date]
- [ ] [Action item 2] - [Assigned to] - [Due date]
```

## 🚨 Emergency Communication

### Critical Issues
- **Use ALL CAPS** in subject lines for urgent issues
- **Include URGENT** in the message
- **Tag specific team members** who need to respond
- **Follow up** if no response within 1 hour

### Example Emergency Message
```markdown
# URGENT: Production Issue - [Date/Time]

**Issue**: [Brief description]
**Impact**: [What's affected]
**Priority**: Critical
**Needs Response From**: [Specific team members]
**Timeline**: [When this needs to be resolved]

**Details**: [Full description of the issue]
**Steps Taken**: [What has been tried]
**Next Steps**: [What needs to happen]
```

---

**Last Updated**: September 2024  
**Next Review**: Weekly during active development  
**Owner**: Product Manager (Griffin Baker)  

---

*This communication system ensures effective collaboration and transparency across the development team while maintaining clear accountability and progress tracking.*
