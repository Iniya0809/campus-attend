import { departments, classes } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassFilterProps {
  value: string;
  onChange: (value: string) => void;
  filterType?: "class" | "department";
}

export default function ClassFilter({ value, onChange, filterType = "class" }: ClassFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[220px] bg-card">
        <SelectValue placeholder={filterType === "class" ? "All Classes" : "All Departments"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{filterType === "class" ? "All Classes" : "All Departments"}</SelectItem>
        {filterType === "class"
          ? classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))
          : departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))
        }
      </SelectContent>
    </Select>
  );
}
