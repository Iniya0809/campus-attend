import { courses } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CourseFilter({ value, onChange }: CourseFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[220px] bg-card">
        <SelectValue placeholder="All Courses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Courses</SelectItem>
        {courses.map((c) => (
          <SelectItem key={c} value={c}>{c}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
