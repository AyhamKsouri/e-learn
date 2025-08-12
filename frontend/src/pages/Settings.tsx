import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  updateUserProfile,
  changePassword,
  updateUserPreferences,
  toggleTwoFactor,
  logoutAllDevices,
  clearUserProgress,
  deleteUserAccount,
 type  UserPreferences,
} from '@/api/user';
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
} from '@/components/ui/alert-dialog';
import {
  User,
  Shield,
  Settings as SettingsIcon,
  AlertTriangle,
  Upload,
  Camera,
  Smartphone,
  Monitor,
  Globe,
  Bell,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Clock,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, updateUser } = useUser();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  
  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  // Preferences states
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [courseRecommendations, setCourseRecommendations] = useState(user?.preferences?.courseRecommendations ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(user?.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : new Date().toLocaleString());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update local states when user data changes
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setProfileImage(user.profileImage || '');
      setEmailNotifications(user.preferences?.emailNotifications ?? true);
      setCourseRecommendations(user.preferences?.courseRecommendations ?? true);
      setTwoFactorEnabled(user.twoFactorEnabled ?? false);
      setLastUpdated(user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : new Date().toLocaleString());
    }
  }, [user]);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('settings.profile.toasts.imageTooLarge'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await updateUserProfile({
        name: fullName,
        profileImage: profileImage
      });
      // Extract user from API response and update context
      updateUser(response.user);
      setLastUpdated(new Date().toLocaleString());
      toast.success(t('settings.profile.toasts.profileUpdated'));
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('settings.profile.toasts.profileUpdateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('settings.security.changePassword.toasts.passwordsNoMatch'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('settings.security.changePassword.toasts.passwordTooShort'));
      return;
    }
    
    setIsLoading(true);
    try {
      await changePassword({
        oldPassword,
        newPassword
      });
      toast.success(t('settings.security.changePassword.toasts.passwordChanged'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(t('settings.security.changePassword.toasts.passwordChangeFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteUserAccount();
      toast.success(t('settings.danger.deleteAccount.toast'));
      // User will be logged out and redirected by the UserContext
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error(t('settings.danger.deleteAccount.toastError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProgress = async () => {
    setIsLoading(true);
    try {
      await clearUserProgress();
      toast.success(t('settings.danger.clearProgress.toast'));
      // Refresh user data to reflect cleared progress
      // Note: The user context's refreshUser should be called, not updateUser
      // This is left as is since the actual refresh mechanism depends on the UserContext implementation
    } catch (error) {
      console.error('Clear progress error:', error);
      toast.error(t('settings.danger.clearProgress.toastError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setIsLoading(true);
    try {
      await logoutAllDevices();
      toast.success(t('settings.security.sessions.toasts.loggedOutAll'));
    } catch (error) {
      console.error('Logout all devices error:', error);
      toast.error(t('settings.security.sessions.toasts.logoutAllFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.security')}</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.preferences')}</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.danger')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('settings.profile.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.profile.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage} alt={user?.name} />
                    <AvatarFallback className="text-xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <Label>{t('settings.profile.fields.profilePicture')}</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {t('settings.profile.actions.uploadNew')}
                    </Button>
                    {profileImage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfileImage('')}
                        className="text-muted-foreground"
                      >
                        {t('settings.profile.actions.remove')}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.profile.hints.imageFormat')}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('settings.profile.fields.fullName')}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('settings.profile.fields.fullNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.profile.fields.email')}</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="pr-16"
                    />
                    <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
                      {t('settings.profile.hints.readOnly')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('settings.profile.fields.role')}</Label>
                  <div className="relative">
                    <Input
                      id="role"
                      value={t('nav.student')}
                      disabled
                      className="pr-16 capitalize"
                    />
                    <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
                      {t('settings.profile.hints.readOnly')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t('settings.profile.fields.lastUpdated')}</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {lastUpdated}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      {t('settings.profile.actions.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('settings.profile.actions.saveChanges')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Security */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings.security.changePassword.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.security.changePassword.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">{t('settings.security.changePassword.fields.currentPassword')}</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords.old ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('settings.security.changePassword.fields.newPassword')}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('settings.security.changePassword.fields.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {t('settings.security.changePassword.action')}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.security.twoFactor.title')}</CardTitle>
              <CardDescription>
                {t('settings.security.twoFactor.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('settings.security.twoFactor.enable')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled 
                      ? t('settings.security.twoFactor.enabled')
                      : t('settings.security.twoFactor.disabled')
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={async (checked) => {
                      setIsLoading(true);
                      try {
                        const response = await toggleTwoFactor(checked);
                        setTwoFactorEnabled(checked);
                        // Update only the twoFactorEnabled field
                        updateUser({ twoFactorEnabled: response.twoFactorEnabled });
                        toast.success(checked ? 
                          t('settings.security.twoFactor.enabledToast') : 
                          t('settings.security.twoFactor.disabledToast')
                        );
                      } catch (error) {
                        console.error('2FA toggle error:', error);
                        toast.error(t('settings.security.twoFactor.toggleError'));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  />
                  {twoFactorEnabled && (
                    <Badge variant="secondary" className="text-green-600 border-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      {t('settings.security.twoFactor.status')}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.security.sessions.title')}</CardTitle>
              <CardDescription>
                {t('settings.security.sessions.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Session */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settings.security.sessions.currentSession')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.security.sessions.deviceInfo')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {t('settings.security.sessions.status.active')}
                </Badge>
              </div>

              {/* Mobile Session Example */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settings.security.sessions.mobileDevice')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.security.sessions.lastSeen')}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {t('settings.security.sessions.status.inactive')}
                </Badge>
              </div>

              <Separator />

              <Button 
                variant="outline" 
                onClick={handleLogoutAllDevices}
                disabled={isLoading}
                className="w-full"
              >
                {t('settings.security.sessions.actions.logoutAll')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('settings.preferences.language.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.preferences.language.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('settings.preferences.language.field')}</Label>
                <Select value={i18n.language} onValueChange={async (value) => {
                  setIsLoading(true);
                  try {
                    const newPreferences: UserPreferences = {
                      language: value as 'en' | 'fr',
                      theme: user?.preferences?.theme || 'system',
                      emailNotifications,
                      courseRecommendations
                    };
                    const response = await updateUserPreferences(newPreferences);
                    // Update user preferences in context
                    updateUser({ preferences: response.preferences });
                    i18n.changeLanguage(value);
                    toast.success(t('settings.preferences.language.updateSuccess'));
                  } catch (error) {
                    console.error('Language update error:', error);
                    toast.error(t('settings.preferences.language.updateError'));
                  } finally {
                    setIsLoading(false);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('settings.preferences.language.options.english')}</SelectItem>
                    <SelectItem value="fr">{t('settings.preferences.language.options.french')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.preferences.display.title')}</CardTitle>
              <CardDescription>
                {t('settings.preferences.display.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('settings.preferences.display.theme.label')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.preferences.display.theme.description')}
                  </p>
                </div>
                <Select value={theme} onValueChange={async (value) => {
                  setIsLoading(true);
                  try {
                    const newPreferences: UserPreferences = {
                      language: user?.preferences?.language || 'en',
                      theme: value as 'light' | 'dark' | 'system',
                      emailNotifications,
                      courseRecommendations
                    };
                    const response = await updateUserPreferences(newPreferences);
                    // Update user preferences in context
                    updateUser({ preferences: response.preferences });
                    setTheme(value);
                    toast.success(t('settings.preferences.display.theme.updateSuccess'));
                  } catch (error) {
                    console.error('Theme update error:', error);
                    toast.error(t('settings.preferences.display.theme.updateError'));
                  } finally {
                    setIsLoading(false);
                  }
                }}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('settings.preferences.display.theme.options.light')}</SelectItem>
                    <SelectItem value="dark">{t('settings.preferences.display.theme.options.dark')}</SelectItem>
                    <SelectItem value="system">{t('settings.preferences.display.theme.options.system')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.preferences.notifications.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.preferences.notifications.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('settings.preferences.notifications.email.label')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.preferences.notifications.email.description')}
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={async (checked) => {
                    setIsLoading(true);
                    try {
                      const newPreferences: UserPreferences = {
                        language: user?.preferences?.language || 'en',
                        theme: user?.preferences?.theme || 'system',
                        emailNotifications: checked,
                        courseRecommendations
                      };
                      const response = await updateUserPreferences(newPreferences);
                      // Update user preferences in context
                      updateUser({ preferences: response.preferences });
                      setEmailNotifications(checked);
                      toast.success(t('settings.preferences.notifications.email.updateSuccess'));
                    } catch (error) {
                      console.error('Email notifications update error:', error);
                      toast.error(t('settings.preferences.notifications.email.updateError'));
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('settings.preferences.notifications.recommendations.label')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.preferences.notifications.recommendations.description')}
                  </p>
                </div>
                <Switch 
                  checked={courseRecommendations}
                  onCheckedChange={async (checked) => {
                    setIsLoading(true);
                    try {
                      const newPreferences: UserPreferences = {
                        language: user?.preferences?.language || 'en',
                        theme: user?.preferences?.theme || 'system',
                        emailNotifications,
                        courseRecommendations: checked
                      };
                      const response = await updateUserPreferences(newPreferences);
                      // Update user preferences in context
                      updateUser({ preferences: response.preferences });
                      setCourseRecommendations(checked);
                      toast.success(t('settings.preferences.notifications.recommendations.updateSuccess'));
                    } catch (error) {
                      console.error('Course recommendations update error:', error);
                      toast.error(t('settings.preferences.notifications.recommendations.updateError'));
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                {t('settings.danger.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.danger.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clear Progress */}
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                <div>
                  <h4 className="font-medium">{t('settings.danger.clearProgress.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.danger.clearProgress.description')}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t('settings.danger.clearProgress.action')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.danger.clearProgress.confirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('settings.danger.clearProgress.confirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('settings.danger.clearProgress.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleClearProgress}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('settings.danger.clearProgress.confirmAction')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                <div>
                  <h4 className="font-medium">{t('settings.danger.deleteAccount.title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.danger.deleteAccount.description')}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('settings.danger.deleteAccount.action')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.danger.deleteAccount.confirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('settings.danger.deleteAccount.confirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('settings.danger.deleteAccount.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('settings.danger.deleteAccount.confirmAction')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
