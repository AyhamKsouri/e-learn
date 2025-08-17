import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit3, Eye, EyeOff, Trash2, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { courseAPI } from "@/api/teacher";
import { type Course } from "@/api/courses";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch teacher's courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getTeacherCourses();
      setCourses(response.courses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && course.isPublished) ||
                         (statusFilter === "draft" && !course.isPublished);
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle course publication toggle
  const handleTogglePublication = async (courseId: string, currentStatus: boolean) => {
    try {
      await courseAPI.togglePublication(courseId);
      
      // Update local state
      setCourses(prev => prev.map(course => 
        course._id === courseId 
          ? { ...course, isPublished: !currentStatus }
          : course
      ));

      toast({
        title: `Course ${!currentStatus ? 'published' : 'unpublished'} successfully`,
        description: !currentStatus 
          ? "Your course is now available to students" 
          : "Your course is now in draft mode",
      });
    } catch (error) {
      toast({
        title: "Error updating course",
        description: error instanceof Error ? error.message : "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await courseAPI.delete(courseId);
      
      // Remove from local state
      setCourses(prev => prev.filter(course => course._id !== courseId));
      
      toast({
        title: "Course deleted successfully",
        description: "The course has been permanently removed",
      });
    } catch (error) {
      toast({
        title: "Error deleting course",
        description: error instanceof Error ? error.message : "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your courses in one place
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

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="language">Language</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          {courses.length === 0 ? (
            <>
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first course to start teaching and earning
              </p>
              <Button 
                onClick={() => navigate("/dashboard/teacher/create-course")}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            </>
          ) : (
            <>
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}>
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="group hover:shadow-[var(--shadow-medium)] transition-all duration-300">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "published" : "draft"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{course.category}</Badge>
                  <Badge variant="outline" className="text-xs">{course.level}</Badge>
                  <Badge variant="outline" className="text-xs">${course.price}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold">{course.lessons.length}</div>
                    <div className="text-xs text-muted-foreground">Lessons</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-semibold">{course.enrolledStudents.length}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/dashboard/teacher/courses/${course._id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/edit`)}
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={course.isPublished ? "outline" : "default"}
                      onClick={() => handleTogglePublication(course._id, course.isPublished)}
                      title={course.isPublished ? "Unpublish" : "Publish"}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      className="text-destructive hover:text-destructive"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/lessons`)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Manage Lessons
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredCourses.length > 0 && (
        <div className="text-center py-6 border-t">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
