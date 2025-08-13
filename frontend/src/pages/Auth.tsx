import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useUser } from "@/contexts/UserContext";
import { registerUser, loginUser, type Login2FAResponse } from "@/api/auth";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  
  const { t } = useTranslation();
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await loginUser({ email: signinEmail, password: signinPassword });

      // If backend indicates 2FA is required, send user to verification page
      if ((res as Login2FAResponse).requires2FA) {
        const data = res as Login2FAResponse;
        toast({ title: "Verification required", description: `We sent a code to ${data.email}` });
        navigate('/verify-2fa', { state: { userId: data.userId, maskedEmail: data.email } });
        return;
      }

      const full = res as any;
      if (full.token) {
        localStorage.setItem('token', full.token);
        login(full, full.token);
        toast({ title: "Signed in successfully", description: `Welcome back ${full.name}` });
        if (full.role === 'student') {
          navigate('/dashboard/student');
        } else if (full.role === 'teacher') {
          navigate('/dashboard/teacher');
        } else if (full.role === 'admin') {
          navigate('/dashboard/admin');
        }
      } else {
        toast({ title: "Sign in failed", description: full.message || "Invalid credentials", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !signupEmail || !signupPassword || !confirmPassword || !role) {
      return toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
    }
    if (signupPassword !== confirmPassword) {
      return toast({ title: "Password mismatch", description: "Passwords do not match", variant: "destructive" });
    }

    try {
      setLoading(true);
      const res = await registerUser({
        name: `${firstName} ${lastName}`,
        email: signupEmail,
        password: signupPassword,
        role
      });

      if (res.token) {
        localStorage.setItem('token', res.token);
        login(res as any, res.token);
        toast({ title: "Account created", description: `Welcome ${res.name}` });
        if (res.role === 'student') {
          navigate('/dashboard/student');
        } else if (res.role === 'teacher') {
          navigate('/dashboard/teacher');
        } else if (res.role === 'admin') {
          navigate('/dashboard/admin');
        }
      } else {
        toast({ title: "Sign up failed", description: (res as any).message || "Could not create account", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 max-w-md">
      <Helmet>
        <title>{t("auth.pageTitle")}</title>
        <meta name="description" content={t("auth.metaDescription") as string} />
        <link rel="canonical" href="/auth" />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-6">{t("auth.welcome")}</h1>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="signin">{t("auth.tabs.signIn")}</TabsTrigger>
          <TabsTrigger value="signup">{t("auth.tabs.signUp")}</TabsTrigger>
        </TabsList>

        {/* Sign In */}
        <TabsContent value="signin" className="space-y-4 mt-6">
          <Input type="email" placeholder={t("auth.inputs.email") as string} value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} />
          <Input type="password" placeholder={t("auth.inputs.password") as string} value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} />
          <Button onClick={handleSignIn} disabled={loading} className="w-full">{t("auth.buttons.signIn")}</Button>
        </TabsContent>

        {/* Sign Up */}
        <TabsContent value="signup" className="space-y-4 mt-6">
          <div className="flex gap-2">
            <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <Input type="email" placeholder={t("auth.inputs.email") as string} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
          <Input type="password" placeholder={t("auth.inputs.password") as string} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
          <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Select onValueChange={(value) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSignUp} disabled={loading} className="w-full">{t("auth.buttons.createAccount")}</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
