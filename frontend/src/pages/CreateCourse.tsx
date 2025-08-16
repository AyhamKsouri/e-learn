import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "@/components/course-creation/BasicInfoStep";
import CurriculumStep from "@/components/course-creation/CurriculumStep";
import MediaStep from "@/components/course-creation/MediaStep";
import PublishStep from "@/components/course-creation/PublishStep";

const steps = [
  { id: 1, name: "Basic Info", description: "Course title, description, and details" },
  { id: 2, name: "Curriculum", description: "Add and organize your lessons" },
  { id: 3, name: "Media", description: "Upload thumbnail and videos" },
  { id: 4, name: "Publish", description: "Review and publish your course" }
];

export interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    duration: number;
    videoUrl?: string;
    resources?: File[];
  }>;
  thumbnail?: File;
  previewVideo?: File;
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    lessons: []
  });

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={courseData} updateData={updateCourseData} />;
      case 2:
        return <CurriculumStep data={courseData} updateData={updateCourseData} />;
      case 3:
        return <MediaStep data={courseData} updateData={updateCourseData} />;
      case 4:
        return <PublishStep data={courseData} updateData={updateCourseData} onPublish={() => {}} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return courseData.title && courseData.description && courseData.category && courseData.level;
      case 2:
        return courseData.lessons.length > 0;
      case 3:
        return true; // Media is optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard/teacher")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Create New Course
          </h1>
          <p className="text-muted-foreground">
            Follow the steps to create and publish your course
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Course Creation Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  step.id === currentStep
                    ? "bg-primary/10 border border-primary/20"
                    : step.id < currentStep
                    ? "bg-success/10 border border-success/20"
                    : "bg-muted/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id < currentStep
                      ? "bg-success text-success-foreground"
                      : step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-sm">{step.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={!isStepValid()}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCourse;