import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

export default function StudentWelcome() {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user || user.role !== 'student') return null;

  const enrolledCount = user.enrolledCourses?.length || 0;
  const completedCount = user.completedCourses?.length || 0;
  const totalProgress = user.enrolledCourses?.reduce((sum, course) => sum + course.progress, 0) || 0;
  const averageProgress = enrolledCount > 0 ? Math.round(totalProgress / enrolledCount) : 0;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link to="/dashboard/student">
              Continue Learning
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link to="/my-courses">
              View My Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
