import { useState } from "react";
import { Eye, Globe, Users, DollarSign, Clock, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CourseData } from "@/pages/CreateCourse";
import { courseAPI } from "@/api/teacher";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface PublishStepProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
  onPublish: () => void;
}

const PublishStep = ({ data, onPublish }: PublishStepProps) => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true);
  const [enableEnrollment, setEnableEnrollment] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      // Calculate duration in hours, ensuring minimum of 1 hour
      const totalMinutes = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
      const durationHours = Math.max(totalMinutes / 60, 1); // Minimum 1 hour
      
      // Validate minimum course duration
      if (totalMinutes < 60) {
        toast({
          title: "Course too short",
          description: "Your course must be at least 1 hour long. Please add more lessons or increase lesson durations.",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare course data for API
      const courseData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        level: data.level,
        duration: durationHours,
        thumbnail: "", // TODO: Handle file upload
        tags: [], // TODO: Add tags input
        lessons: data.lessons.map((lesson, index) => ({
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl || "",
          duration: lesson.duration,
          order: index + 1
        }))
      };

      // Create the course
      const response = await courseAPI.create(courseData);
      
      // If course should be published immediately
      if (isPublic) {
        await courseAPI.togglePublication(response.course._id);
      }

      toast({
        title: "Course created successfully!",
        description: isPublic ? "Your course is now published and available to students." : "Your course has been saved as a draft.",
      });

      // Navigate to teacher dashboard
      navigate("/dashboard/teacher");
      
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error creating course",
        description: error instanceof Error ? error.message : "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Review & Publish</h3>
        <p className="text-muted-foreground mb-6">
          Review your course details and configure publishing settings.
        </p>
      </div>

      {/* Course Preview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Course Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Header */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{data.title}</h2>
              <p className="text-muted-foreground mt-2">{data.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{data.category}</Badge>
              <Badge variant="outline">{data.level}</Badge>
              <Badge variant="outline" className="text-success">
                ${data.price}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <BookOpen className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-semibold">{data.lessons.length}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-semibold">
                {(() => {
                  const totalMinutes = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                })()}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
              {(() => {
                const totalMinutes = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
                if (totalMinutes < 60) {
                  return (
                    <div className="text-xs text-amber-600 mt-1">
                      ⚠️ Minimum 1 hour required
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <DollarSign className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-semibold">${data.price}</div>
              <div className="text-sm text-muted-foreground">Price</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-semibold">0</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
          </div>

          {/* Curriculum Preview */}
          <div>
            <h4 className="font-medium mb-3">Curriculum ({data.lessons.length} lessons)</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">
                      {index + 1}.
                    </span>
                    <div>
                      <div className="font-medium text-sm">{lesson.title}</div>
                      {lesson.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {lesson.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {lesson.duration} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publishing Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-course" className="text-base font-medium">
                Make course public
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow students to discover and enroll in your course
              </p>
            </div>
            <Switch
              id="public-course"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-enrollment" className="text-base font-medium">
                Enable enrollment
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow new students to enroll in this course
              </p>
            </div>
            <Switch
              id="enable-enrollment"
              checked={enableEnrollment}
              onCheckedChange={setEnableEnrollment}
            />
          </div>
        </CardContent>
      </Card>

      {/* Publishing Checklist */}
      <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20">
        <CardHeader>
          <CardTitle className="text-success">Ready to Publish! ✓</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Course title and description completed
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              {data.lessons.length} lessons added to curriculum
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Category and level selected
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Course price set
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Course duration: {(() => {
                const totalMinutes = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
              })()} (minimum 1 hour)
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Publish Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePublish}
          disabled={isPublishing || (() => {
            const totalMinutes = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
            return totalMinutes < 60;
          })()}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-glow px-8 py-3 text-lg"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isPublic ? "Publishing Course..." : "Creating Course..."}
            </>
          ) : (
            <>
              {isPublic ? "Publish Course" : "Create Draft"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PublishStep;