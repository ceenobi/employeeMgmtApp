type Props = {
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completedTask: number;
  inprogressTasks: number;
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
  };
};

export default function TaskInfo({
  totalTasks,
  pendingTasks,
  overdueTasks,
  completedTask,
  tasksByPriority,
  inprogressTasks,
}: Props) {
  const pendingTasksPercentage =
    totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;
  const overdueTasksPercentage =
    totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
  const completedTaskPercentage =
    totalTasks > 0 ? (completedTask / totalTasks) * 100 : 0;
  const inprogressTasksPercentage =
    totalTasks > 0 ? (inprogressTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-base-200 shadow-lg p-4 rounded-lg">
      <p className="mt-4">Total Tasks: {totalTasks}</p>
      <div className="divider"></div>
      <p className="mt-4">Tasks by Priority</p>
      <ul>
        <li>Low: {tasksByPriority.low}</li>
        <li>Medium: {tasksByPriority.medium}</li>
        <li>High: {tasksByPriority.high}</li>
      </ul>
      <div className="divider"></div>
      <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-gray-400 mb-2">Pending Tasks</p>
          <div
            className="radial-progress text-warning"
            style={
              {
                "--value": Math.max(0, Math.min(100, pendingTasksPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {pendingTasksPercentage.toFixed(0)}%
          </div>
          <p className="text-sm">
            {pendingTasksPercentage.toFixed(0)}% within the last year
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Overdue Tasks</p>
          <div
            className="radial-progress text-error"
            style={
              {
                "--value": Math.max(0, Math.min(100, overdueTasksPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {overdueTasksPercentage.toFixed(0)}%
          </div>
          <p className="text-sm">
            {overdueTasksPercentage.toFixed(0)}% within the last year
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Completed Tasks</p>
          <div
            className="radial-progress text-success"
            style={
              {
                "--value": Math.max(0, Math.min(100, completedTaskPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {completedTaskPercentage.toFixed(0)}%
          </div>
          <p className="text-sm">
            {completedTaskPercentage.toFixed(0)}% within the last year
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Tasks In Progress</p>
          <div
            className="radial-progress text-success"
            style={
              {
                "--value": Math.max(
                  0,
                  Math.min(100, inprogressTasksPercentage)
                ),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {inprogressTasksPercentage.toFixed(0)}%
          </div>
          <p className="text-sm">
            {inprogressTasksPercentage.toFixed(0)}% within the last year
          </p>
        </div>
      </div>
    </div>
  );
}
