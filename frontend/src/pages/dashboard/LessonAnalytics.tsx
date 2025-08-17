import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { lessonsAPI, type LessonAnalytics as LessonAnalyticsType } from "@/api/lessons";

const LessonAnalytics = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [analytics, setAnalytics] = useState<LessonAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!lessonId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await lessonsAPI.getAnalytics(lessonId);
        setAnalytics(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
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

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Analytics not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const completionRate = analytics.totalEnrolled > 0
    ? Math.round((analytics.completedCount / analytics.totalEnrolled) * 100)
    : 0;

  const inProgressRate = analytics.totalEnrolled > 0
    ? Math.round((analytics.inProgressCount / analytics.totalEnrolled) * 100)
    : 0;

  const notStartedRate = analytics.totalEnrolled > 0
    ? Math.round((analytics.notStartedCount / analytics.totalEnrolled) * 100)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Lesson Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            {analytics.lessonTitle}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{analytics.totalEnrolled}</div>
                <div className="text-sm text-muted-foreground">Total Enrolled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{analytics.completedCount}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">{analytics.inProgressCount}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-8 h-8 text-info" />
              <div>
                <div className="text-2xl font-bold">{analytics.notStartedCount}</div>
                <div className="text-sm text-muted-foreground">Not Started</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Completed</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.completedCount} of {analytics.totalEnrolled} students
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>In Progress</span>
                <span className="font-medium">{inProgressRate}%</span>
              </div>
              <Progress value={inProgressRate} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.inProgressCount} of {analytics.totalEnrolled} students
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Not Started</span>
                <span className="font-medium">{notStartedRate}%</span>
              </div>
              <Progress value={notStartedRate} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.notStartedCount} of {analytics.totalEnrolled} students
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {analytics.engagementRate}%
              </div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Completion Time</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{analytics.averageCompletionTime} min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Last Accessed</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(analytics.lastAccessed).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Created</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(analytics.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(analytics.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {completionRate < 50 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Low Completion Rate</h4>
              <p className="text-yellow-700 text-sm">
                Only {completionRate}% of students completed this lesson. Consider reviewing the content difficulty,
                adding more interactive elements, or providing additional support materials.
              </p>
            </div>
          )}

          {analytics.engagementRate < 70 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Engagement Opportunity</h4>
              <p className="text-blue-700 text-sm">
                With {analytics.engagementRate}% engagement, this lesson could benefit from more interactive content,
                quizzes, or discussion prompts to increase student participation.
              </p>
            </div>
          )}

          {analytics.averageCompletionTime > 60 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Long Completion Time</h4>
              <p className="text-purple-700 text-sm">
                Students take an average of {analytics.averageCompletionTime} minutes to complete this lesson.
                Consider breaking it into smaller segments or adding progress checkpoints.
              </p>
            </div>
          )}

          {completionRate >= 80 && analytics.engagementRate >= 80 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Excellent Performance</h4>
              <p className="text-green-700 text-sm">
                This lesson is performing exceptionally well! Students are highly engaged and completing the content successfully.
                Consider using this lesson as a template for other lessons.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/teacher/lessons/${lessonId}/edit`)}
        >
          Edit Lesson
        </Button>
        <Button
          onClick={() => navigate(`/dashboard/teacher/courses/${analytics.lessonId}/lessons`)}
        >
          Manage All Lessons
        </Button>
      </div>
    </div>
  );
};

export default LessonAnalytics;
