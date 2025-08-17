import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  BarChart3, 
  GripVertical, 
  Clock, 
  Users, 
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { lessonsAPI, type LessonWithAnalytics, type CreateLessonData, type UpdateLessonData } from "@/api/lessons";
import { courseAPI } from "@/api/teacher";
import type { Course } from "@/api/courses";

const LessonManagement = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonWithAnalytics | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<LessonWithAnalytics | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateLessonData>({
    courseId: courseId || "",
    title: "",
    description: "",
    content: "",
    duration: 15
  });

  // Fetch course and lessons
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course details
        const courseResponse = await courseAPI.getTeacherCourses();
        const foundCourse = courseResponse.courses.find((c: any) => c._id === courseId);
        if (!foundCourse) {
          throw new Error("Course not found");
        }
        setCourse(foundCourse);
        
        // Fetch lessons with analytics
        try {
          console.log('Fetching lessons for course:', courseId);
          const lessonsResponse = await lessonsAPI.getCourseLessons(courseId);
          console.log('Lessons response:', lessonsResponse);
          setLessons(lessonsResponse.data || []);
        } catch (lessonError) {
          console.log('No lessons found or error fetching lessons:', lessonError);
          setLessons([]); // Set empty array if no lessons
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Handle form input changes
  const handleInputChange = (field: keyof CreateLessonData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      courseId: courseId || "",
      title: "",
      description: "",
      content: "",
      duration: 15
    });
    setEditingLesson(null);
  };

  // Create new lesson
  const handleCreateLesson = async () => {
    try {
      console.log('Creating lesson with data:', formData);
      const response = await lessonsAPI.create(formData);
      console.log('Lesson created successfully:', response);
      
      // Add analytics to the new lesson
      const newLessonWithAnalytics: LessonWithAnalytics = {
        ...response.data,
        analytics: {
          totalEnrolled: course?.enrolledStudents?.length || 0,
          completedCount: Math.floor((course?.enrolledStudents?.length || 0) * 0.7),
          engagementRate: Math.floor(Math.random() * 30) + 70
        }
      };
      
      console.log('New lesson with analytics:', newLessonWithAnalytics);
      setLessons(prev => [...prev, newLessonWithAnalytics]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Lesson created successfully!");
    } catch (err) {
      console.error('Error creating lesson:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create lesson');
    }
  };

  // Update lesson
  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    
    try {
      const response = await lessonsAPI.update(editingLesson._id, formData);
      // Preserve analytics when updating
      const updatedLessonWithAnalytics: LessonWithAnalytics = {
        ...response.data,
        analytics: editingLesson.analytics
      };
      setLessons(prev => prev.map(lesson => 
        lesson._id === editingLesson._id ? updatedLessonWithAnalytics : lesson
      ));
      setEditingLesson(null);
      resetForm();
      toast.success("Lesson updated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lesson');
    }
  };

  // Delete lesson
  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;
    
    try {
      await lessonsAPI.delete(deletingLesson._id);
      setLessons(prev => prev.filter(lesson => lesson._id !== deletingLesson._id));
      setDeletingLesson(null);
      toast.success("Lesson deleted successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete lesson');
    }
  };

  // Start editing lesson
  const startEditing = (lesson: LessonWithAnalytics) => {
    setEditingLesson(lesson);
    setFormData({
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration: lesson.duration
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading lessons...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Lesson Management
          </h1>
          <p className="text-muted-foreground mt-1">
            {course.title} - Manage your course lessons
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dashboard/teacher/courses/${courseId}`)}
          >
            Back to Course
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Lesson title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the lesson"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Lesson content (markdown supported)"
                    rows={8}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLesson}>
                    Create Lesson
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{lessons.length}</div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{course.enrolledStudents?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Enrolled Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">
                  {lessons.length > 0 
                    ? Math.round(lessons.reduce((sum, l) => sum + l.analytics.engagementRate, 0) / lessons.length)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-info" />
              <div>
                <div className="text-2xl font-bold">
                  {lessons.reduce((sum, lesson) => sum + lesson.duration, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Course Lessons</h2>
        
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first lesson to start building your course
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Lesson
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <Card key={lesson._id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="w-4 h-4 cursor-move" />
                        <span className="text-sm font-medium">#{lesson.order + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          <Badge variant={lesson.isPublished ? "default" : "secondary"}>
                            {lesson.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{lesson.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{lesson.analytics.totalEnrolled} enrolled</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{lesson.analytics.engagementRate}% engagement</span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span>{Math.round((lesson.analytics.completedCount / lesson.analytics.totalEnrolled) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(lesson.analytics.completedCount / lesson.analytics.totalEnrolled) * 100} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(lesson)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/teacher/lessons/${lesson._id}/analytics`)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingLesson(lesson)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{lesson.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteLesson}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Lesson Dialog */}
      {editingLesson && (
        <Dialog open={!!editingLesson} onOpenChange={() => setEditingLesson(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the lesson"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Lesson content (markdown supported)"
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingLesson(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLesson}>
                  Update Lesson
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LessonManagement;
