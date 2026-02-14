export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  department: string;
  section: string;
  semester: number;
  avatar: string;
  enrollmentDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  assignedClasses: string[];
  avatar: string;
  joinDate: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  department: string;
  section: string;
  semester: number;
  studentCount: number;
  teacherId: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  classId: string;
  markedBy: string;
}

// Departments
export const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"];
export const sections = ["A", "B", "C"];

// Mock students
const firstNames = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Arjun", "Kavya", "Rahul", "Meera", "Siddharth", "Ishita", "Aditya", "Nisha", "Karan", "Tanvi", "Dev", "Riya", "Nikhil", "Pooja", "Amit", "Divya", "Harsh", "Neha", "Varun", "Shreya", "Manish", "Swati", "Rajat", "Pallavi"];
const lastNames = ["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Joshi", "Mehta", "Nair", "Verma", "Iyer", "Desai", "Rao", "Chopra", "Bhat", "Malhotra", "Srinivasan", "Kapoor", "Menon", "Agarwal", "Tiwari", "Banerjee", "Mishra", "Pandey", "Saxena", "Dubey", "Kulkarni", "Pillai", "Dutta", "Ghosh"];

export const students: Student[] = Array.from({ length: 30 }, (_, i) => ({
  id: `STU${String(i + 1).padStart(3, "0")}`,
  name: `${firstNames[i]} ${lastNames[i]}`,
  rollNumber: `${departments[i % 5].substring(0, 2).toUpperCase()}${String(2024001 + i)}`,
  email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@college.edu`,
  phone: `+91 ${String(9800000000 + Math.floor(Math.random() * 199999999))}`,
  department: departments[i % 5],
  section: sections[i % 3],
  semester: (i % 8) + 1,
  avatar: firstNames[i][0] + lastNames[i][0],
  enrollmentDate: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

const teacherFirstNames = ["Anita", "Ramesh", "Sunita", "Vijay", "Lakshmi", "Suresh", "Geeta", "Mohan"];
const teacherLastNames = ["Sharma", "Iyer", "Deshmukh", "Nair", "Kulkarni", "Reddy", "Bose", "Rao"];
const subjects = ["Data Structures", "Operating Systems", "Database Systems", "Computer Networks", "Software Engineering", "Web Development", "Machine Learning", "Digital Electronics"];

export const teachers: Teacher[] = Array.from({ length: 8 }, (_, i) => ({
  id: `TCH${String(i + 1).padStart(3, "0")}`,
  name: `Prof. ${teacherFirstNames[i]} ${teacherLastNames[i]}`,
  email: `${teacherFirstNames[i].toLowerCase()}.${teacherLastNames[i].toLowerCase()}@college.edu`,
  phone: `+91 ${String(9700000000 + Math.floor(Math.random() * 199999999))}`,
  department: departments[i % 5],
  subject: subjects[i],
  assignedClasses: [`${departments[i % 5].substring(0, 2).toUpperCase()}-${sections[i % 3]}`],
  avatar: teacherFirstNames[i][0] + teacherLastNames[i][0],
  joinDate: `202${i % 3}-0${(i % 9) + 1}-15`,
}));

export const classes: ClassInfo[] = departments.flatMap((dept) =>
  sections.map((sec) => ({
    id: `${dept.substring(0, 2).toUpperCase()}-${sec}`,
    name: `${dept} - Section ${sec}`,
    department: dept,
    section: sec,
    semester: Math.floor(Math.random() * 8) + 1,
    studentCount: students.filter((s) => s.department === dept && s.section === sec).length,
    teacherId: teachers.find((t) => t.department === dept)?.id || "TCH001",
  }))
);

// Generate attendance records for last 30 days
const statusWeights: [number, number, number] = [0.75, 0.15, 0.1];
const allStatuses: AttendanceRecord["status"][] = ["present", "absent", "late"];

function weightedRandom(): AttendanceRecord["status"] {
  const r = Math.random();
  if (r < statusWeights[0]) return allStatuses[0];
  if (r < statusWeights[0] + statusWeights[1]) return allStatuses[1];
  return allStatuses[2];
}

export const attendanceRecords: AttendanceRecord[] = [];
for (let d = 0; d < 30; d++) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  // Skip weekends
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  const dateStr = date.toISOString().split("T")[0];
  for (const student of students) {
    const classId = `${student.department.substring(0, 2).toUpperCase()}-${student.section}`;
    attendanceRecords.push({
      studentId: student.id,
      date: dateStr,
      status: weightedRandom(),
      classId,
      markedBy: teachers.find((t) => t.department === student.department)?.id || "TCH001",
    });
  }
}

// Helper functions
export function getAttendanceStats(filters?: { classId?: string; department?: string; date?: string }) {
  let filtered = [...attendanceRecords];
  if (filters?.classId) filtered = filtered.filter((r) => r.classId === filters.classId);
  if (filters?.department) {
    const deptPrefix = filters.department.substring(0, 2).toUpperCase();
    filtered = filtered.filter((r) => r.classId.startsWith(deptPrefix));
  }
  if (filters?.date) filtered = filtered.filter((r) => r.date === filters.date);

  const total = filtered.length;
  const present = filtered.filter((r) => r.status === "present").length;
  const absent = filtered.filter((r) => r.status === "absent").length;
  const late = filtered.filter((r) => r.status === "late").length;
  return {
    total, present, absent, late,
    presentPercent: total ? Math.round((present / total) * 100) : 0,
    absentPercent: total ? Math.round((absent / total) * 100) : 0,
    latePercent: total ? Math.round((late / total) * 100) : 0,
  };
}

export function getStudentAttendancePercent(studentId: string) {
  const records = attendanceRecords.filter((r) => r.studentId === studentId);
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === "present" || r.status === "late").length;
  return Math.round((present / records.length) * 100);
}

export function getWeeklyData(classId?: string) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day, i) => {
    const date = new Date();
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    date.setDate(date.getDate() - diff + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayRecords = (classId
      ? attendanceRecords.filter((r) => r.classId === classId)
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

export function getMonthlyTrend() {
  const data: { week: string; attendance: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekRecords = attendanceRecords.filter((r) => {
      const d = new Date(r.date);
      return d >= weekStart && d <= weekEnd;
    });
    const present = weekRecords.filter((r) => r.status === "present").length;
    data.push({
      week: `Week ${4 - w}`,
      attendance: weekRecords.length ? Math.round((present / weekRecords.length) * 100) : 0,
    });
  }
  return data;
}

export function getTodayAttendance(classId?: string) {
  const today = new Date().toISOString().split("T")[0];
  const records = attendanceRecords.filter(
    (r) => r.date === today && (!classId || r.classId === classId)
  );
  const relevantStudents = classId
    ? students.filter((s) => `${s.department.substring(0, 2).toUpperCase()}-${s.section}` === classId)
    : students;
  return relevantStudents.map((s) => {
    const record = records.find((r) => r.studentId === s.id);
    return { ...s, status: record?.status || ("present" as const) };
  });
}

export function getLowAttendanceStudents(threshold = 75) {
  return students
    .map((s) => ({ ...s, percent: getStudentAttendancePercent(s.id) }))
    .filter((s) => s.percent < threshold)
    .sort((a, b) => a.percent - b.percent);
}

export function getDepartmentStats() {
  return departments.map((dept) => {
    const stats = getAttendanceStats({ department: dept });
    const deptStudents = students.filter((s) => s.department === dept);
    return { department: dept, students: deptStudents.length, ...stats };
  });
}
