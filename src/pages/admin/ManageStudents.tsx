import { useState } from "react";
import { Search, Plus, Trash2, Users } from "lucide-react";
import { students as allStudents, departments, sections, getStudentAttendancePercent } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ManageStudents() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = allStudents.filter((s) => {
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Student Added", description: "New student has been registered successfully." });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1>Manage Students</h1>
              <p>{filtered.length} students found</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-[200px] bg-card" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="All Departments" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/20"><Plus className="w-4 h-4" />Add Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter name" required /></div>
                  <div className="space-y-2"><Label>Roll Number</Label><Input placeholder="e.g. CS2024001" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="student@college.edu" required /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 9876543210" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{sections.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
                  </div>
                  <div className="space-y-2"><Label>Semester</Label><Input type="number" min={1} max={8} placeholder="1-8" /></div>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Register Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden stat-card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Roll No.</th>
                <th className="text-left py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Department</th>
                <th className="text-left py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Section</th>
                <th className="text-center py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</th>
                <th className="text-center py-3.5 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => {
                const percent = getStudentAttendancePercent(student.id);
                return (
                  <tr key={student.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors animate-fade-in" style={{ animationDelay: `${i * 15}ms` }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent ring-1 ring-accent/20">{student.avatar}</div>
                        <div>
                          <p className="font-semibold text-card-foreground text-[13px]">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{student.rollNumber}</td>
                    <td className="py-3 px-4 text-muted-foreground text-[13px] hidden lg:table-cell">{student.department}</td>
                    <td className="py-3 px-4 text-muted-foreground text-[13px] hidden lg:table-cell">{student.section}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={percent} className="h-1.5 w-16" />
                        <span className={`text-xs font-bold ${percent < 75 ? "text-destructive" : "text-success"}`}>{percent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => toast({ title: "Student Removed", description: `${student.name} has been removed.` })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
