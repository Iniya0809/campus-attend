import { classes, departments, teachers } from "@/lib/data";
import { Building2 } from "lucide-react";

export default function ManageClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Classes & Sections</h1>
        <p className="text-sm text-muted-foreground">Manage departments, classes, and section assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls, i) => {
          const teacher = teachers.find((t) => t.id === cls.teacherId);
          return (
            <div key={cls.id} className="bg-card rounded-xl border border-border p-5 stat-card-shadow animate-fade-in hover:border-accent/40 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {cls.id}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Students</span>
                  <span className="font-semibold text-card-foreground">{cls.studentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semester</span>
                  <span className="font-semibold text-card-foreground">{cls.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teacher</span>
                  <span className="font-semibold text-card-foreground">{teacher?.name || "—"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
