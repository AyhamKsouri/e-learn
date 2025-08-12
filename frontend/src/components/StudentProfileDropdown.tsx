import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  ChevronDown,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StudentProfileDropdown() {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Calculate student stats
  const enrolledCount = user.enrolledCourses?.length || 0;
  const completedCount = user.completedCourses?.length || 0;
  const totalProgress = user.enrolledCourses?.reduce((sum, course) => sum + course.progress, 0) || 0;
  const averageProgress = enrolledCount > 0 ? Math.round(totalProgress / enrolledCount) : 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent"
        >
          {/* Student Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Student Info */}
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium leading-none">{user.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
          </div>
          
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header with student info */}
        <DropdownMenuLabel className="p-4 border-b">
        <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-xs text-primary font-medium capitalize">{user.role}</div>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Quick Stats */}
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{enrolledCount}</div>
              <div className="text-xs text-muted-foreground">{t("student.profile.enrolled")}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{completedCount}</div>
              <div className="text-xs text-muted-foreground">{t("student.profile.completed")}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{averageProgress}%</div>
              <div className="text-xs text-muted-foreground">{t("student.profile.progress")}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link to="/dashboard/student" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              {t("student.profile.myDashboard")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/my-courses" className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-4 w-4" />
              {t("student.profile.myCourses")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/learning-path" className="flex items-center gap-2 cursor-pointer">
              <GraduationCap className="h-4 w-4" />
              {t("student.profile.learningPath")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/achievements" className="flex items-center gap-2 cursor-pointer">
              <Trophy className="h-4 w-4" />
              {t("student.profile.achievements")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/study-timer" className="flex items-center gap-2 cursor-pointer">
              <Clock className="h-4 w-4" />
              {t("student.profile.studyTimer")}
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Settings & Logout */}
        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              {t("student.profile.settings")}
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            {t("student.profile.signOut")}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
