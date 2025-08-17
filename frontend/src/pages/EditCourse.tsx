import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { courseAPI } from "@/api/teacher";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CurriculumStep from "@/components/course-creation/CurriculumStep";

interface Lesson {
  id?: string;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  resources?: File[]; // or string[] if already uploaded
}

interface EditCourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: number;
  thumbnail?: string;
  tags?: string[];
  lessons: Lesson[];   // ✅ add this
}

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<EditCourseData>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    duration: 0,
    tags: [],
    lessons: []  
  });

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        const course = await courseAPI.getCourseById(courseId);

        setCourseData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "",
          price: course.price || 0,
          duration: course.duration || 0,
          thumbnail: course.thumbnail || "",
          tags: course.tags || [],
          lessons: course.lessons || []   // ✅ load lessons from backend
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleInputChange = (field: keyof EditCourseData, value: string | number | string[]) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!courseId) return;

    try {
      setSaving(true);
      await courseAPI.updatecourse(courseId, courseData);

      toast({
        title: "Course updated successfully",
        description: "Your changes have been saved",
      });

      navigate(`/dashboard/teacher/courses`);
    } catch (err) {
      toast({
        title: "Error updating course",
        description: err instanceof Error ? err.message : "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return courseData.title && courseData.description && courseData.category && courseData.level;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/teacher/courses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Edit Course
          </h1>
          <p className="text-muted-foreground">
            Update your course information
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Course Title</label>
            <Input
              value={courseData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what students will learn in this course"
              rows={4}
              className="w-full"
            />
          </div>

          {/* Category and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <Input
                type="number"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (hours)</label>
              <Input
                type="number"
                value={courseData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail URL (optional)</label>
            <Input
              value={courseData.thumbnail || ""}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              value={courseData.tags?.join(', ') || ""}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
              placeholder="javascript, react, frontend"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
      {/* Curriculum (Lessons) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <CurriculumStep
            data={courseData}
            updateData={(newData) => setCourseData(prev => ({ ...prev, ...newData }))}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/teacher/courses")}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          disabled={!isFormValid() || saving}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditCourse;
