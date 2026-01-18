import { Task, Project, Team } from '@/models';
import { callGeminiJSON } from '@/config/gemini';
import {
  buildAssigneePrompt,
  buildDeadlinePrompt,
  buildPriorityPrompt,
  buildBreakdownPrompt,
} from '@/utils/prompt-builder';
import {
  getMemberPerformanceHistory,
  getTeamWorkload,
} from './analytics.service';
import {
  SuggestAssigneeResponse,
  SuggestDeadlineResponse,
  SuggestPriorityResponse,
  BreakdownTaskResponse,
  TaskContext,
  TeamMemberContext,
  AISuggestionType,
} from '@/types';
import { AppError } from '@/middlewares/error.middleware';

/*
 * Suggest the best team member for task assignment
 * 
 * This function analyzes team history and suggests an assignee
 * 
 * How it works:
 * 1. Get task details
 * 2. Get team members
 * 3. Get performance history for each member
 * 4. Build AI prompt with all context
 * 5. Call Gemini API
 * 6. Parse and validate response
 * 7. Save suggestion to task
 * 8. Return result
 */
export const suggestTaskAssignee = async (
  taskId: string,
  userId: string
): Promise<SuggestAssigneeResponse> => {
  try {
    // 1. Get task
    const task = await Task.findById(taskId)
      .populate('project', 'name team')
      .populate('createdBy', 'name');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // 2. Get team and verify user access
    const team = await Team.findById(project.team).populate('members.userId', 'name email');

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (m) => m.userId._id. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You must be a team member to use AI suggestions', 403);
    }

    // 3. Build task context
    const taskContext: TaskContext = {
      taskId:  task._id. toString(),
      title: task.title,
      description: task.description,
      tags: task.tags,
      estimatedHours: task.estimatedHours,
      priority: task.priority,
      projectName: (project as any).name,
      teamName: team.name,
    };

    // 4. Get team member performance data
    const teamMemberContexts: TeamMemberContext[] = [];

    for (const member of team. members) {
      const userId = (member.userId as any)._id.toString();
      const performance = await getMemberPerformanceHistory(userId, team._id.toString());

      teamMemberContexts.push({
        userId,
        name: (member.userId as any).name,
        email: (member.userId as any).email,
        tasksCompleted: performance.tasksCompleted,
        avgCompletionTime: performance.avgCompletionTime,
        accuracy: performance.accuracy,
        commonTags: performance.commonTags,
        currentWorkload: 0, // Will calculate next
        preferredPriority: performance.preferredPriority || undefined,
      });
    }

    // 5. Get current workload for each member
    const workloadData = await getTeamWorkload(team._id.toString());

    teamMemberContexts.forEach((member) => {
      const workload = workloadData.workload.find(
        (w: any) => w.userId. toString() === member.userId
      );
      member.currentWorkload = workload?. totalTasks || 0;
    });

    // 6. Check if new team
    const isNewTeam = teamMemberContexts.every((m) => m.tasksCompleted === 0);

    // 7. Build AI prompt
    const prompt = buildAssigneePrompt(taskContext, teamMemberContexts, isNewTeam);

    console.log('Calling Gemini AI for task assignment...');

    // 8. Call Gemini API with JSON response
    const aiResponse = await callGeminiJSON<{
      suggestedUserId: string;
      confidence: number;
      reasoning: string;
      isNewTeam?:  boolean;
      disclaimer?: string;
    }>(prompt);

    console.log('AI Response received:', aiResponse);

    // 9. Validate response
    if (! aiResponse. suggestedUserId || !aiResponse.confidence || !aiResponse.reasoning) {
      throw new Error('Invalid AI response format');
    }

    // 10. Verify suggested user exists in team
    const suggestedMember = teamMemberContexts.find(
      (m) => m.userId === aiResponse.suggestedUserId
    );

    if (!suggestedMember) {
      // Fallback:  suggest least busy member
      const leastBusy = teamMemberContexts. reduce((prev, curr) =>
        curr.currentWorkload < prev.currentWorkload ? curr :  prev
      );

      aiResponse.suggestedUserId = leastBusy.userId;
      aiResponse.reasoning = `Fallback: ${leastBusy.name} has the lowest workload (${leastBusy.currentWorkload} tasks)`;
      aiResponse.confidence = 0.3;
    }

    // 11. Save AI suggestion to task
    if (!task.aiSuggestions) {
      task.aiSuggestions = [];
    }
    task.aiSuggestions.push({
      type: AISuggestionType.ASSIGNEE,
      suggestion: aiResponse.suggestedUserId,
      reasoning: aiResponse.reasoning,
      confidence: aiResponse.confidence,
      createdAt: new Date(),
    } as any);

    await task.save();

    // 12. Return formatted response
    const suggestedUser = teamMemberContexts.find(
      (m) => m.userId === aiResponse.suggestedUserId
    );

    return {
      suggestedUserId:  aiResponse.suggestedUserId,
      suggestedUserName: suggestedUser?. name || 'Unknown',
      confidence: aiResponse.confidence,
      reasoning: aiResponse.reasoning,
      isNewTeam:  aiResponse.isNewTeam || isNewTeam,
      disclaimer:  aiResponse.disclaimer,
    };
  } catch (error:  any) {
    console.error('AI Assignee Suggestion Error:', error. message);

    // If AI fails, use simple fallback
    if (error.message.includes('Gemini') || error.message.includes('API')) {
      // Fallback to simple logic
      const task = await Task.findById(taskId).populate('project');
      const project = await Project.findById((task as any).project);
      const team = await Team.findById((project as any).team).populate('members.userId', 'name');

      // Get member with least tasks
      const workload = await getTeamWorkload((team as any)._id.toString());
      const leastBusy = workload.workload.sort((a:  any, b: any) => a.totalTasks - b.totalTasks)[0];

      return {
        suggestedUserId: leastBusy?. userId || (team as any).members[0].userId._id.toString(),
        suggestedUserName: leastBusy?.name || (team as any).members[0].userId.name,
        confidence: 0.3,
        reasoning: 'AI service unavailable.  Using simple workload distribution.',
        isNewTeam: true,
        disclaimer: 'AI temporarily unavailable. Using fallback logic.',
      };
    }

    throw error;
  }
};

/*
 * Suggest deadline for task
 */
export const suggestTaskDeadline = async (
  taskId: string,
  _userId: string
): Promise<SuggestDeadlineResponse> => {
  try {
    const task = await Task.findById(taskId)
      .populate('project', 'name team')
      .populate('assignedTo', 'name');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team.findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Build task context
    const taskContext: TaskContext = {
      taskId:  task._id.toString(),
      title: task.title,
      description: task.description,
      tags: task.tags,
      estimatedHours: task.estimatedHours,
      priority:  task.priority,
      projectName: (project as any).name,
      teamName: team.name,
    };

    // Get assignee history if assigned
    let assigneeHistory: TeamMemberContext | undefined;

    if (task.assignedTo) {
      const assigneeId = (task.assignedTo as any)._id?.toString() || task.assignedTo. toString();
      const performance = await getMemberPerformanceHistory(assigneeId, team._id.toString());

      assigneeHistory = {
        userId: assigneeId,
        name: (task.assignedTo as any).name || 'Unknown',
        email:  '',
        tasksCompleted: performance.tasksCompleted,
        avgCompletionTime: performance. avgCompletionTime,
        accuracy: performance.accuracy,
        commonTags: performance.commonTags,
        currentWorkload:  0,
      };
    }

    // Build prompt
    const prompt = buildDeadlinePrompt(taskContext, assigneeHistory);

    console.log('Calling Gemini AI for deadline suggestion...');

    // Call AI
    const aiResponse = await callGeminiJSON<{
      suggestedDays: number;
      confidence: number;
      reasoning: string;
      isNewTeam?: boolean;
    }>(prompt);

    console.log('AI Response received:', aiResponse);

    // Calculate deadline date
    const suggestedDeadline = new Date();
    suggestedDeadline.setDate(suggestedDeadline.getDate() + aiResponse.suggestedDays);

    // Save suggestion
    if (!task.aiSuggestions) {
      task.aiSuggestions = [];
    }
    task.aiSuggestions.push({
      type: AISuggestionType.DEADLINE,
      suggestion: suggestedDeadline,
      reasoning: aiResponse.reasoning,
      confidence: aiResponse. confidence,
      createdAt:  new Date(),
    } as any);

    await task.save();

    return {
      suggestedDeadline,
      suggestedDays: aiResponse.suggestedDays,
      confidence: aiResponse.confidence,
      reasoning: aiResponse.reasoning,
      isNewTeam: aiResponse.isNewTeam,
    };
  } catch (error: any) {
    console.error('AI Deadline Suggestion Error:', error. message);

    // Fallback:  3 days default
    const fallbackDeadline = new Date();
    fallbackDeadline.setDate(fallbackDeadline.getDate() + 3);

    return {
      suggestedDeadline: fallbackDeadline,
      suggestedDays: 3,
      confidence:  0.3,
      reasoning: 'AI unavailable. Default 3-day estimate.',
      disclaimer: 'AI temporarily unavailable.',
    };
  }
};

/*
 * Suggest priority for task
 */
export const suggestTaskPriority = async (
  taskId: string,
  _userId:  string
): Promise<SuggestPriorityResponse> => {
  try {
    const task = await Task.findById(taskId).populate('project', 'name team');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await Project.findById(task.project);

    const taskContext: TaskContext = {
      taskId: task._id.toString(),
      title: task.title,
      description: task.description,
      tags: task.tags,
      estimatedHours:  task.estimatedHours,
      priority: task.priority,
      projectName: (project as any)?. name || 'Unknown',
      teamName: 'Unknown',
    };

    const prompt = buildPriorityPrompt(taskContext);

    console.log('Calling Gemini AI for priority suggestion.. .');

    const aiResponse = await callGeminiJSON<{
      suggestedPriority:  string;
      confidence: number;
      reasoning: string;
    }>(prompt);

    console.log('AI Response received:', aiResponse);

    // Save suggestion
    if (!task.aiSuggestions) {
      task.aiSuggestions = [];
    }
    task.aiSuggestions.push({
      type: AISuggestionType. PRIORITY,
      suggestion: aiResponse.suggestedPriority,
      reasoning: aiResponse. reasoning,
      confidence: aiResponse.confidence,
      createdAt: new Date(),
    } as any);

    await task.save();

    return {
      suggestedPriority: aiResponse.suggestedPriority,
      confidence: aiResponse.confidence,
      reasoning: aiResponse. reasoning,
    };
  } catch (error:  any) {
    console.error('AI Priority Suggestion Error:', error.message);

    return {
      suggestedPriority: 'medium',
      confidence: 0.3,
      reasoning: 'AI unavailable. Default priority.',
    };
  }
};

/*
 * Break down complex task into subtasks
 */
export const breakdownTask = async (
  taskId:  string,
  _userId: string,
  maxSubtasks: number = 5
): Promise<BreakdownTaskResponse> => {
  try {
    const task = await Task.findById(taskId).populate('project', 'name');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await Project. findById(task.project);

    const taskContext: TaskContext = {
      taskId: task._id. toString(),
      title: task. title,
      description: task. description,
      tags: task. tags,
      estimatedHours: task.estimatedHours,
      priority: task.priority,
      projectName: (project as any)?.name || 'Unknown',
      teamName: 'Unknown',
    };

    const prompt = buildBreakdownPrompt(taskContext, maxSubtasks);

    console.log('Calling Gemini AI for task breakdown...');

    const aiResponse = await callGeminiJSON<BreakdownTaskResponse>(prompt);

    console.log('AI Response received:', aiResponse);

    // Save suggestion
    if (!task.aiSuggestions) {
      task.aiSuggestions = [];
    }
    task.aiSuggestions.push({
      type: AISuggestionType. BREAKDOWN,
      suggestion: aiResponse.subtasks,
      reasoning: aiResponse.reasoning,
      confidence: aiResponse.confidence,
      createdAt: new Date(),
    } as any);

    await task.save();

    return aiResponse;
  } catch (error: any) {
    console.error('AI Breakdown Error:', error.message);

    return {
      subtasks: [],
      reasoning: 'AI unavailable. Please break down manually.',
      confidence: 0,
    };
  }
};