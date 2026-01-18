//  Analytics service - Business intelligence layer
// This provides insights and statistics for dashboards
import { Task, Project, Team, User } from '@/models';
import { TaskStatus, ProjectStatus } from '@/types';
import { Types } from 'mongoose';

/**
 * Get team workload distribution
 * Shows how many tasks each team member has
 */
export const getTeamWorkload = async (teamId: string) => {
  const team = await Team.findById(teamId).populate('members.userId', 'name email avatar');

  if (!team) {
    throw new Error('Team not found');
  }

  // Get all projects for this team
  const projects = await Project.find({ team: teamId }).select('_id');
  const projectIds = projects.map((p) => p._id);

  // Aggregate tasks by assignee
  const workload = await Task.aggregate([
    {
      $match: {
        project: { $in: projectIds },
        assignedTo: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0],
          },
        },
        inProgressTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0],
          },
        },
        todoTasks: {
          $sum: {
            $cond:  [{ $eq: ['$status', TaskStatus.TODO] }, 1, 0],
          },
        },
        overdueTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$deadline', new Date()] },
                  { $ne: ['$status', TaskStatus. COMPLETED] },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum:  '$actualHours' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        email: '$user.email',
        avatar: '$user.avatar',
        totalTasks: 1,
        completedTasks:  1,
        inProgressTasks:  1,
        todoTasks: 1,
        overdueTasks: 1,
        totalEstimatedHours: 1,
        totalActualHours: 1,
        completionRate: {
          $cond: [
            { $eq: ['$totalTasks', 0] },
            0,
            { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
          ],
        },
      },
    },
    {
      $sort: { totalTasks: -1 },
    },
  ]);

  return {
    team:  {
      _id: team._id,
      name: team.name,
      memberCount: team.members.length,
    },
    workload,
  };
};

/**
 * Get project statistics
 */
export const getProjectStats = async (projectId: string) => {
  const project = await Project. findById(projectId).populate('team', 'name');

  if (!project) {
    throw new Error('Project not found');
  }

  // Task statistics
  const taskStats = await Task.aggregate([
    { $match: { project: new Types.ObjectId(projectId) } },
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        byPriority: [
          {
            $group: {
              _id: '$priority',
              count:  { $sum: 1 },
            },
          },
        ],
        overall: [
          {
            $group: {
              _id:  null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0],
                },
              },
              overdue: {
                $sum:  {
                  $cond:  [
                    {
                      $and: [
                        { $lt: ['$deadline', new Date()] },
                        { $ne: ['$status', TaskStatus.COMPLETED] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              totalEstimatedHours: { $sum: '$estimatedHours' },
              totalActualHours:  { $sum: '$actualHours' },
              avgEstimatedHours: { $avg: '$estimatedHours' },
              avgActualHours:  { $avg: '$actualHours' },
            },
          },
        ],
        assignees: [
          {
            $match: { assignedTo: { $exists: true, $ne: null } },
          },
          {
            $group: {
              _id: '$assignedTo',
              taskCount: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              userId: '$_id',
              name: '$user.name',
              email: '$user.email',
              taskCount: 1,
            },
          },
        ],
      },
    },
  ]);

  const stats = taskStats[0];

  // Format response
  const byStatus:  any = {};
  stats.byStatus.forEach((s:  any) => {
    byStatus[s._id] = s. count;
  });

  const byPriority: any = {};
  stats.byPriority.forEach((p: any) => {
    byPriority[p._id] = p.count;
  });

  const overall = stats.overall[0] || {
    total: 0,
    completed: 0,
    overdue: 0,
    totalEstimatedHours: 0,
    totalActualHours: 0,
    avgEstimatedHours: 0,
    avgActualHours:  0,
  };

  return {
    project: {
      _id: project._id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
    },
    tasks: {
      total: overall.total,
      completed: overall.completed,
      overdue: overall.overdue,
      completionRate: 
        overall.total > 0 ?  (overall.completed / overall.total) * 100 : 0,
      byStatus,
      byPriority,
    },
    hours: {
      totalEstimated: overall.totalEstimatedHours || 0,
      totalActual: overall.totalActualHours || 0,
      avgEstimated: overall.avgEstimatedHours || 0,
      avgActual: overall.avgActualHours || 0,
      variance: 
        (overall.totalActualHours || 0) - (overall.totalEstimatedHours || 0),
    },
    assignees: stats.assignees,
  };
};

/**
 * Get user dashboard statistics
 */
export const getUserDashboard = async (userId: string) => {
  // Get user's teams
  const user = await User.findById(userId).populate('teams', 'name');

  if (!user) {
    throw new Error('User not found');
  }

  const teamIds = user.teams.map((t: any) => t._id);

  // Get all projects from user's teams
  const projects = await Project.find({ team: { $in: teamIds } }).select('_id');
  const projectIds = projects.map((p) => p._id);

  // Tasks assigned to user
  const myTasks = await Task.aggregate([
    {
      $match: {
        assignedTo:  new Types.ObjectId(userId),
      },
    },
    {
      $facet: {
        byStatus:  [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        byPriority: [
          {
            $group: {
              _id: '$priority',
              count: { $sum:  1 },
            },
          },
        ],
        overall: [
          {
            $group: {
              _id:  null,
              total: { $sum: 1 },
              completed: {
                $sum:  {
                  $cond:  [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0],
                },
              },
              inProgress: {
                $sum:  {
                  $cond:  [{ $eq: ['$status', TaskStatus.IN_PROGRESS] }, 1, 0],
                },
              },
              todo: {
                $sum:  {
                  $cond:  [{ $eq: ['$status', TaskStatus.TODO] }, 1, 0],
                },
              },
              overdue:  {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $lt: ['$deadline', new Date()] },
                        { $ne: ['$status', TaskStatus. COMPLETED] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        upcomingDeadlines: [
          {
            $match: {
              deadline: { $exists: true, $gte: new Date() },
              status: { $ne: TaskStatus.COMPLETED },
            },
          },
          {
            $sort: { deadline: 1 },
          },
          {
            $limit: 5,
          },
          {
            $lookup: {
              from: 'projects',
              localField: 'project',
              foreignField: '_id',
              as: 'project',
            },
          },
          {
            $unwind:  '$project',
          },
          {
            $project: {
              _id: 1,
              title: 1,
              status: 1,
              priority: 1,
              deadline: 1,
              project: { _id: 1, name: 1 },
            },
          },
        ],
      },
    },
  ]);

  const stats = myTasks[0];

  const byStatus: any = {};
  stats.byStatus.forEach((s: any) => {
    byStatus[s._id] = s.count;
  });

  const byPriority: any = {};
  stats.byPriority.forEach((p: any) => {
    byPriority[p._id] = p. count;
  });

  const overall = stats.overall[0] || {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
  };

  // Tasks created by user
  const createdTasksCount = await Task.countDocuments({ createdBy: userId });

  // Active projects count
  const activeProjectsCount = await Project.countDocuments({
    _id: { $in: projectIds },
    status: ProjectStatus.ACTIVE,
  });

  return {
    user:  {
      _id: user._id,
      name: user. name,
      email: user. email,
      avatar: user. avatar,
    },
    myTasks: {
      total:  overall.total,
      completed: overall.completed,
      inProgress: overall.inProgress,
      todo: overall.todo,
      overdue: overall.overdue,
      completionRate:
        overall.total > 0 ? (overall.completed / overall.total) * 100 : 0,
      byStatus,
      byPriority,
    },
    upcomingDeadlines: stats.upcomingDeadlines,
    createdTasks: createdTasksCount,
    teams: user.teams.length,
    activeProjects: activeProjectsCount,
  };
};

/**
 * Get team member performance history
 * Used by AI to suggest assignments
 */
export const getMemberPerformanceHistory = async (
  userId: string,
  teamId: string
) => {
  // Get all projects for the team
  const projects = await Project.find({ team: teamId }).select('_id');
  const projectIds = projects.map((p) => p._id);

  // Get completed tasks for this user in this team
  const completedTasks = await Task.find({
    project: { $in: projectIds },
    assignedTo: userId,
    status: TaskStatus. COMPLETED,
  })
    .select('priority estimatedHours actualHours tags createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50); // Last 50 completed tasks

  if (completedTasks.length === 0) {
    return {
      userId,
      tasksCompleted: 0,
      avgCompletionTime: 0,
      accuracy: 0,
      commonTags: [],
      preferredPriority: null,
    };
  }

  // Calculate average completion time (in days)
  let totalCompletionTime = 0;
  let tasksWithTime = 0;

  completedTasks.forEach((task) => {
    if (task.createdAt && task.updatedAt) {
      const diff =
        (task.updatedAt. getTime() - task.createdAt.getTime()) /
        (1000 * 60 * 60 * 24);
      totalCompletionTime += diff;
      tasksWithTime++;
    }
  });

  const avgCompletionTime =
    tasksWithTime > 0 ?  totalCompletionTime / tasksWithTime : 0;

  // Calculate estimation accuracy
  let totalAccuracy = 0;
  let tasksWithEstimates = 0;

  completedTasks.forEach((task) => {
    if (task. estimatedHours && task.actualHours) {
      const accuracy =
        1 - Math.abs(task.actualHours - task.estimatedHours) / task.estimatedHours;
      totalAccuracy += Math.max(0, accuracy); // Ensure non-negative
      tasksWithEstimates++;
    }
  });

  const avgAccuracy =
    tasksWithEstimates > 0 ?  (totalAccuracy / tasksWithEstimates) * 100 : 0;

  // Find common tags (expertise areas)
  const tagCount:  any = {};
  completedTasks.forEach((task) => {
    task.tags?. forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const commonTags = Object.entries(tagCount)
    .sort((a:  any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0]);

  // Find preferred priority level
  const priorityCount: any = {};
  completedTasks.forEach((task) => {
    priorityCount[task.priority] = (priorityCount[task.priority] || 0) + 1;
  });

  const preferredPriority = Object.entries(priorityCount).sort(
    (a: any, b: any) => b[1] - a[1]
  )[0]?.[0];

  return {
    userId,
    tasksCompleted: completedTasks. length,
    avgCompletionTime:  Math.round(avgCompletionTime * 10) / 10, // Round to 1 decimal
    accuracy: Math.round(avgAccuracy * 10) / 10,
    commonTags,
    preferredPriority,
  };
};

/**
 * Get task completion trends (last 30 days)
 */
export const getTaskCompletionTrends = async (projectId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trends = await Task.aggregate([
    {
      $match: {
        project: new Types.ObjectId(projectId),
        status: TaskStatus.COMPLETED,
        updatedAt: { $gte:  thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        tasksCompleted: '$count',
      },
    },
  ]);

  return trends;
};