import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "@/providers/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import MainLayout from "@/components/layout/MainLayout";

import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Auth from "./pages/Auth";
import About from "./pages/about";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentCourses from "./pages/dashboard/StudentCourses";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import TeacherCourses from "./pages/dashboard/TeacherCourses";
import CreateCourse from "./pages/CreateCourse";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Verify2FA from "./pages/Verify2FA";
import LessonManagement from "./pages/dashboard/LessonManagement";
import LessonAnalytics from "./pages/dashboard/LessonAnalytics";



const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <TooltipProvider>
              <Router>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/about" element={<About />} />
                    
                    {/* Teacher Routes */}
                    <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                    <Route path="/dashboard/teacher/courses" element={<TeacherCourses />} />
                    <Route path="/dashboard/teacher/courses/:courseId" element={<TeacherCourses />} />
                    <Route path="/dashboard/teacher/courses/:courseId/lessons" element={<LessonManagement />} />
                    <Route path="/dashboard/teacher/lessons/:lessonId/analytics" element={<LessonAnalytics />} />
                    <Route path="/dashboard/teacher/create-course" element={<CreateCourse />} />

                    
                    {/* Dashboard Routes */}
                    
                    {/* Student Routes */}
                    <Route path="/dashboard/student" element={<StudentDashboard />} />
                    <Route path="/dashboard/student/courses" element={<StudentCourses />} />
                    
                    {/* Admin Routes */}
                    <Route path="/dashboard/admin" element={<AdminDashboard />} />
                    
                    {/* Common Routes */}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/verify-2fa" element={<Verify2FA />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
                <Toaster />
              </Router>
            </TooltipProvider>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
