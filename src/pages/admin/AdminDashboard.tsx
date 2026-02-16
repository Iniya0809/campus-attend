import { Users, UserCheck, UserX, Clock, AlertTriangle, TrendingUp, Building2, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import StatCard from "@/components/StatCard";
import { getAttendanceStats, getWeeklyData, getMonthlyTrend, getLowAttendanceStudents, getDepartmentStats, students, teachers, classes } from "@/lib/data";

const PIE_COLORS = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 55%)", "hsl(38, 92%, 55%)"];

export default function AdminDashboard() {
  const stats = getAttendanceStats();
  const weeklyData = getWeeklyData();
  const monthlyTrend = getMonthlyTrend();
  const lowAttendance = getLowAttendanceStudents();
  const deptStats = getDepartmentStats();

  const todayStats = getAttendanceStats({ date: new Date().toISOString().split("T")[0] });
  const pieData = [
    { name: "Present", value: stats.presentPercent },
    { name: "Absent", value: stats.absentPercent },
    { name: "Late", value: stats.latePercent },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Complete overview of the attendance management system</p>
          </div>
        </div>
      </div>

      {/* Top stats row */}
      <div className="dashboard-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={students.length} icon={Users} subtitle="All departments" />
        <StatCard title="Total Teachers" value={teachers.length} icon={BookOpen} variant="accent" subtitle="Active faculty" />
        <StatCard title="Total Classes" value={classes.length} icon={Building2} variant="default" subtitle="Across departments" />
        <StatCard title="Avg Attendance" value={`${stats.presentPercent}%`} icon={TrendingUp} variant="success" subtitle="Last 30 days" />
      </div>

      {/* Today's stats */}
      <div className="dashboard-grid grid-cols-1 sm:grid-cols-3">
        <StatCard title="Present Today" value={todayStats.present} icon={UserCheck} variant="success" subtitle={`${todayStats.presentPercent}% of total`} />
        <StatCard title="Absent Today" value={todayStats.absent} icon={UserX} variant="destructive" subtitle={`${todayStats.absentPercent}% of total`} />
        <StatCard title="Late Today" value={todayStats.late} icon={Clock} variant="warning" subtitle={`${todayStats.latePercent}% of total`} />
      </div>

      {/* Charts */}
      <div className="dashboard-grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 chart-container card-hover">
          <h3 className="text-sm font-bold text-card-foreground mb-1">Weekly Attendance Overview</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Present, absent & late breakdown by day</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} stroke="hsl(214, 20%, 92%)" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} stroke="hsl(214, 20%, 92%)" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)" }} />
              <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[6, 6, 0, 0]} name="Absent" />
              <Bar dataKey="late" fill="hsl(38, 92%, 55%)" radius={[6, 6, 0, 0]} name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container card-hover">
          <h3 className="text-sm font-bold text-card-foreground mb-1">Overall Distribution</h3>
          <p className="text-[11px] text-muted-foreground mb-4">30-day attendance breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-3">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend + Low Attendance */}
      <div className="dashboard-grid grid-cols-1 lg:grid-cols-2">
        <div className="chart-container card-hover">
          <h3 className="text-sm font-bold text-card-foreground mb-1">Monthly Trend</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Weekly attendance rate over last month</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} stroke="hsl(214, 20%, 92%)" />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} stroke="hsl(214, 20%, 92%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px hsl(0 0% 0% / 0.08)" }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(174, 60%, 40%)" strokeWidth={2.5} dot={{ fill: "hsl(174, 60%, 40%)", r: 5, strokeWidth: 2, stroke: "white" }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container card-hover">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-destructive/10">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            </div>
            <h3 className="text-sm font-bold text-card-foreground">Low Attendance Alert</h3>
            <span className="ml-auto text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">{lowAttendance.length} students</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">Students below 75% attendance threshold</p>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            {lowAttendance.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center text-[10px] font-bold text-destructive">{s.avatar}</div>
                  <div>
                    <p className="text-xs font-semibold text-card-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.rollNumber} · {s.department}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-destructive">{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department stats table */}
      <div className="chart-container card-hover">
        <h3 className="text-sm font-bold text-card-foreground mb-1">Department-wise Statistics</h3>
        <p className="text-[11px] text-muted-foreground mb-4">Attendance breakdown across all departments</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Students</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Present %</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Absent %</th>
                <th className="text-center py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Late %</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map((d) => (
                <tr key={d.department} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-card-foreground text-[13px]">{d.department}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{d.students}</td>
                  <td className="py-3 px-4 text-center"><span className="text-success font-bold bg-success/10 px-2 py-0.5 rounded-full text-xs">{d.presentPercent}%</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-full text-xs">{d.absentPercent}%</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-warning font-bold bg-warning/10 px-2 py-0.5 rounded-full text-xs">{d.latePercent}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
