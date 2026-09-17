import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTodoStore } from '../store/store';
import { startOfDay, subDays, format } from 'date-fns';

export function StatsCard() {
  const { tasks } = useTodoStore();

  // Get completed tasks for the last 7 days
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const completedCount = tasks.filter(task => 
        task.completed && 
        task.completedAt && 
        startOfDay(new Date(task.completedAt)).getTime() === date.getTime()
      ).length;
      
      data.push({
        day: format(date, 'EEE'),
        completed: completedCount
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text font-semibold">Progress</h3>
        <span className="text-text-muted text-xs">Last 7 days</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-bold text-text">{totalCompleted}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Rate</p>
          <p className="text-2xl font-bold text-accent">{completionRate}%</p>
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E3" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B6B6B', fontSize: 12 }}
            />
            <YAxis 
              hide
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E5E3',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}
            />
            <Bar 
              dataKey="completed" 
              fill="#3FAE6A" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
