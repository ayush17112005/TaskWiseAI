import { TaskContext, TeamMemberContext } from '@/types';

/**
 * Build prompt for task assignee suggestion
 * 
 */
export const buildAssigneePrompt = (
  task: TaskContext,
  teamMembers: TeamMemberContext[],
  isNewTeam: boolean
): string => {
  if (isNewTeam || teamMembers.every(m => m.tasksCompleted === 0)) {
    // NEW TEAM - Fair distribution
    return `
You are a task assignment expert for a NEW TEAM with no history. 

TASK DETAILS:
- Title: ${task.title}
- Description: ${task.description || 'No description'}
- Tags: ${task.tags?.join(', ') || 'None'}
- Estimated Hours: ${task.estimatedHours || 'Unknown'}
- Priority: ${task.priority || 'Not set'}

TEAM MEMBERS: 
${teamMembers.map((m, i) => `
${i + 1}. ${m.name}
   - Current Workload: ${m.currentWorkload} active tasks
`).join('')}

Since this is a new team with no task history, suggest the team member with the LOWEST current workload for fair distribution. 

Return ONLY valid JSON (no markdown, no extra text):
{
  "suggestedUserId": "user_id_here",
  "confidence": 0.35,
  "reasoning": "Fair distribution:  [Name] has the fewest active tasks ([number] tasks). Note: This is a new team - suggestions will improve as tasks are completed.",
  "isNewTeam": true,
  "disclaimer": "⚠️ New team:  Complete tasks to enable smarter AI suggestions based on performance history."
}
`;
  }

  // ESTABLISHED TEAM - Use history
  return `
You are an expert task assignment AI for project management.

TASK DETAILS: 
- Title: ${task.title}
- Description: ${task. description || 'No description provided'}
- Tags: ${task. tags?.join(', ') || 'None'}
- Estimated Hours: ${task.estimatedHours || 'Not specified'}
- Priority: ${task.priority || 'medium'}
- Project: ${task.projectName}
- Team: ${task.teamName}

TEAM MEMBERS ANALYSIS:
${teamMembers.map((m, i) => `
${i + 1}. ${m.name} (ID: ${m.userId})
   - Tasks Completed: ${m.tasksCompleted}
   - Average Completion Time: ${m.avgCompletionTime. toFixed(1)} days
   - Accuracy:  ${m.accuracy. toFixed(1)}% (estimated vs actual hours)
   - Expertise Tags: ${m.commonTags.join(', ') || 'None yet'}
   - Current Workload: ${m.currentWorkload} active tasks
   - Preferred Priority: ${m.preferredPriority || 'Not determined'}
`).join('')}

ANALYSIS CRITERIA:
1. Match task tags with member expertise
2. Consider current workload (avoid overloading)
3. Factor in completion speed
4. Consider accuracy for time estimation
5. Balance team distribution

Return ONLY valid JSON (no markdown, no extra text):
{
  "suggestedUserId": "the_user_id_of_best_match",
  "confidence": 0.85,
  "reasoning":  "Brief explanation of why this person is the best match (mention relevant expertise, workload, past performance)"
}
`;
};

/**
 * Build prompt for deadline suggestion
 */
export const buildDeadlinePrompt = (
  task: TaskContext,
  teamMemberHistory?:  TeamMemberContext
): string => {
  if (!teamMemberHistory || teamMemberHistory.tasksCompleted === 0) {
    // No history - simple estimate
    return `
You are a project management expert.

TASK: 
- Title: ${task.title}
- Description: ${task. description || 'No description'}
- Estimated Hours: ${task.estimatedHours || 'Not specified'}
- Priority: ${task.priority || 'medium'}

Since there's no team history, suggest a reasonable deadline based on: 
- Task complexity (analyze title and description)
- Estimated hours if provided
- Industry standards
- Priority level

Return ONLY valid JSON (no markdown):
{
  "suggestedDays": 3,
  "confidence": 0.5,
  "reasoning": "Brief explanation of the deadline estimate",
  "isNewTeam": true
}
`;
  }

  // With history
  return `
You are a deadline estimation expert.

TASK:
- Title: ${task.title}
- Description: ${task.description || 'No description'}
- Estimated Hours: ${task.estimatedHours || 'Not specified'}
- Priority: ${task.priority || 'medium'}

ASSIGNEE HISTORY:
- Name: ${teamMemberHistory.name}
- Average Completion Time: ${teamMemberHistory.avgCompletionTime. toFixed(1)} days
- Accuracy: ${teamMemberHistory.accuracy.toFixed(1)}%
- Current Workload: ${teamMemberHistory.currentWorkload} tasks

Based on the assignee's history and current workload, suggest an appropriate deadline.

Return ONLY valid JSON (no markdown):
{
  "suggestedDays": 3,
  "confidence": 0.85,
  "reasoning": "Brief explanation based on historical data"
}
`;
};

/**
 * Build prompt for priority suggestion
 */
export const buildPriorityPrompt = (task: TaskContext): string => {
  return `
You are a task priority assessment expert.

TASK:
- Title: ${task.title}
- Description: ${task.description || 'No description'}
- Tags: ${task.tags?.join(', ') || 'None'}
- Project: ${task.projectName}

Analyze the task and suggest priority based on:
- Urgency keywords (urgent, asap, critical, blocking, etc.)
- Impact on project
- Dependencies
- Business value

Priority levels:  low, medium, high, urgent

Return ONLY valid JSON (no markdown):
{
  "suggestedPriority": "high",
  "confidence": 0.8,
  "reasoning":  "Brief explanation of why this priority level"
}
`;
};

/**
 * Build prompt for task breakdown
 */
export const buildBreakdownPrompt = (task:  TaskContext, maxSubtasks:  number = 5): string => {
  return `
You are a task breakdown expert for software development.

TASK TO BREAK DOWN:
- Title:  ${task.title}
- Description: ${task.description || 'No additional details'}
- Estimated Hours: ${task.estimatedHours || 'Not specified'}
- Tags: ${task.tags?.join(', ') || 'None'}

Break this task into ${maxSubtasks} or fewer subtasks that are: 
1. Specific and actionable
2. Can be completed independently
3. Follow logical order
4. Cover all aspects of the main task

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no comments, no extra text.
Use double quotes for all strings. No trailing commas.

Expected JSON format:
{
  "subtasks": [
    {
      "title": "Specific subtask title",
      "description": "Brief description",
      "estimatedHours":  2,
      "order": 1
    }
  ],
  "reasoning": "Brief explanation of the breakdown approach",
  "confidence": 0.9
}
`;
};