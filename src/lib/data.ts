export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  course: string;
  avatar: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  course: string;
}

export const courses = [
  "Computer Science 101",
  "Data Structures",
  "Web Development",
  "Database Systems",
  "Software Engineering",
];

const firstNames = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Arjun", "Kavya", "Rahul", "Meera", "Siddharth", "Ishita", "Aditya", "Nisha", "Karan", "Tanvi", "Dev", "Riya", "Nikhil", "Pooja"];
const lastNames = ["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Joshi", "Mehta", "Nair", "Verma", "Iyer", "Desai", "Rao", "Chopra", "Bhat", "Malhotra", "Srinivasan", "Kapoor", "Menon", "Agarwal"];

export const students: Student[] = Array.from({ length: 20 }, (_, i) => {
  const first = firstNames[i];
  const last = lastNames[i];
  return {
    id: `STU${String(i + 1).padStart(3, "0")}`,
    name: `${first} ${last}`,
    rollNumber: `CS${String(2024001 + i)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@college.edu`,
    course: courses[i % courses.length],
    avatar: first[0] + last[0],
  };
});

// Generate last 30 days of attendance
const statuses: AttendanceRecord["status"][] = ["present", "absent", "late"];
const weights = [0.75, 0.15, 0.1];

function weightedRandom(): AttendanceRecord["status"] {
  const r = Math.random();
  if (r < weights[0]) return statuses[0];
  if (r < weights[0] + weights[1]) return statuses[1];
  return statuses[2];
}

export const attendanceRecords: AttendanceRecord[] = [];

for (let d = 0; d < 30; d++) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  const dateStr = date.toISOString().split("T")[0];
  for (const student of students) {
    attendanceRecords.push({
      studentId: student.id,
      date: dateStr,
      status: weightedRandom(),
      course: student.course,
    });
  }
}

export function getAttendanceStats(course?: string) {
  const filtered = course
    ? attendanceRecords.filter((r) => r.course === course)
    : attendanceRecords;
  const total = filtered.length;
  const present = filtered.filter((r) => r.status === "present").length;
  const absent = filtered.filter((r) => r.status === "absent").length;
  const late = filtered.filter((r) => r.status === "late").length;
  return {
    total,
    present,
    absent,
    late,
    presentPercent: total ? Math.round((present / total) * 100) : 0,
    absentPercent: total ? Math.round((absent / total) * 100) : 0,
    latePercent: total ? Math.round((late / total) * 100) : 0,
  };
}

export function getWeeklyData(course?: string) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => {
    const date = new Date();
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    date.setDate(date.getDate() - diff + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayRecords = (course
      ? attendanceRecords.filter((r) => r.course === course)
      : attendanceRecords
    ).filter((r) => r.date === dateStr);
    return {
      day,
      present: dayRecords.filter((r) => r.status === "present").length,
      absent: dayRecords.filter((r) => r.status === "absent").length,
      late: dayRecords.filter((r) => r.status === "late").length,
    };
  });
}

export function getTodayAttendance(course?: string) {
  const today = new Date().toISOString().split("T")[0];
  const records = attendanceRecords.filter(
    (r) => r.date === today && (!course || r.course === course)
  );
  return students
    .filter((s) => !course || s.course === course)
    .map((s) => {
      const record = records.find((r) => r.studentId === s.id);
      return { ...s, status: record?.status || ("present" as const) };
    });
}
