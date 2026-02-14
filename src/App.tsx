import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageStudents from "@/pages/admin/ManageStudents";
import ManageTeachers from "@/pages/admin/ManageTeachers";
import ManageClasses from "@/pages/admin/ManageClasses";
import AdminReports from "@/pages/admin/AdminReports";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherMarkAttendance from "@/pages/teacher/TeacherMarkAttendance";
import TeacherReports from "@/pages/teacher/TeacherReports";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentHistory from "@/pages/student/StudentHistory";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  const homeRoute = `/${user!.role}`;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to={homeRoute} replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/teachers" element={<ManageTeachers />} />
        <Route path="/admin/classes" element={<ManageClasses />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* Teacher routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TeacherMarkAttendance />} />
        <Route path="/teacher/reports" element={<TeacherReports />} />

        {/* Student routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/history" element={<StudentHistory />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
