import { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { teachers as allTeachers, departments } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ManageTeachers() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = allTeachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Teacher Added", description: "New teacher has been registered successfully." });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Teachers</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} faculty members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-[200px] bg-card" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="w-4 h-4" />Add Teacher</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Teacher</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter name" required /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="teacher@college.edu" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 9876543210" /></div>
                  <div className="space-y-2"><Label>Subject</Label><Input placeholder="e.g. Data Structures" required /></div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select>
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Register Teacher</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((teacher, i) => (
          <div key={teacher.id} className="bg-card rounded-xl border border-border p-5 stat-card-shadow animate-fade-in hover:border-accent/40 transition-colors" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">{teacher.avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 -mt-1 -mr-1" onClick={() => toast({ title: "Teacher Removed" })}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>📧 {teacher.email}</p>
              <p>📱 {teacher.phone}</p>
              <p>📚 {teacher.subject}</p>
              <p>🏢 {teacher.department}</p>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {teacher.assignedClasses.map((c) => (
                  <span key={c} className="bg-accent/10 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
