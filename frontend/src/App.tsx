import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  {/* Main Pages */}
                  <Route path="/" element={<Index />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/verify-2fa" element={<Verify2FA />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Dashboards */}
                  <Route path="/dashboard/student" element={<StudentDashboard />} />
                  <Route path="/dashboard/student/courses" element={<StudentCourses />} />
                  <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                  <Route path="/dashboard/teacher/courses" element={<TeacherCourses />} />
                  <Route path="/dashboard/teacher/create-course" element={<CreateCourse />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />

                  {/* Catch-all 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
