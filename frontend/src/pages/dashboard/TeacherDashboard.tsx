import { useState } from "react";
import { Plus, Users, DollarSign, Star, TrendingUp, BookOpen, PlayCircle, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [courses] = useState([
    {
      id: 1,
      title: "Complete React Development",
      description: "Learn React from basics to advanced concepts",
      students: 1247,
      revenue: 23890,
      rating: 4.8,
      lessons: 45,
      status: "published" as const,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop"
    },
    {
      id: 2, 
      title: "JavaScript Fundamentals",
      description: "Master the fundamentals of JavaScript programming",
      students: 892,
      revenue: 15670,
      rating: 4.6,
      lessons: 28,
      status: "published" as const,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      description: "Build scalable backend applications with Node.js",
      students: 0,
      revenue: 0,
      rating: 0,
      lessons: 12,
      status: "draft" as const,
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop"
    }
  ]);

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  const averageRating = courses.filter(c => c.rating > 0).reduce((sum, course) => sum + course.rating, 0) / courses.filter(c => c.rating > 0).length;
  const publishedCourses = courses.filter(c => c.status === "published").length;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your courses and track your success
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/teacher/create-course")}
          className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-medium)] transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+8% from last month"
          changeType="positive"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          change="Excellent performance"
          changeType="positive"
          icon={<Star className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Published Courses"
          value={publishedCourses.toString()}
          change={`${courses.length - publishedCourses} in draft`}
          changeType="neutral"
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Courses</h2>
          <Button variant="outline" onClick={() => navigate("/dashboard/teacher/courses")}>
            View All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-[var(--shadow-medium)] transition-all duration-300 bg-gradient-to-br from-card to-muted/10">
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={course.status === "published" ? "default" : "secondary"}>
                    {course.status}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate(`/dashboard/teacher/courses/${course.id}/edit`)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  {course.revenue > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>${course.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span>{course.rating}/5.0</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/dashboard/teacher/courses/${course.id}`)}
                  >
                    Manage
                  </Button>
                  {course.status === "published" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/dashboard/teacher/courses/${course.id}/analytics`)}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;