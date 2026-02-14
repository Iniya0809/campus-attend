import { getDepartmentStats, getMonthlyTrend, getLowAttendanceStudents } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function AdminReports() {
  const deptStats = getDepartmentStats();
  const monthlyTrend = getMonthlyTrend();
  const lowAttendance = getLowAttendanceStudents();

  const barData = deptStats.map((d) => ({
    name: d.department.split(" ")[0],
    present: d.presentPercent,
    absent: d.absentPercent,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Generate and download attendance reports</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({ title: "Report Downloaded", description: "Attendance report saved as PDF." })}>
          <Download className="w-4 h-4" />Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 50%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(174, 60%, 40%)" strokeWidth={2.5} dot={{ fill: "hsl(174, 60%, 40%)", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Students Below 75% Attendance Threshold</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Roll No.</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Department</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Attendance %</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowAttendance.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center text-[10px] font-bold text-destructive">{s.avatar}</div>
                      <span className="font-medium text-card-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground hidden md:table-cell">{s.rollNumber}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{s.department}</td>
                  <td className="py-3 px-4 text-center font-bold text-destructive">{s.percent}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.percent < 50 ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                      {s.percent < 50 ? "Critical" : "Warning"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
