import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await mockDelay(800);
      toast({ title: "Welcome back!", description: "Signed in successfully (mock)." });
    } catch (e: any) {
      toast({ title: "Sign in failed", description: e.message, variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await mockDelay(800);
      toast({ title: "Account created", description: "Mock sign up complete." });
    } catch (e: any) {
      toast({ title: "Sign up failed", description: e.message, variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 max-w-md">
      <Helmet>
        <title>Login or Register | EduFlow</title>
        <meta name="description" content="Sign in or create your account on EduFlow." />
        <link rel="canonical" href="/auth" />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-6">Welcome to EduFlow</h1>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="space-y-4 mt-6">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleSignIn} disabled={loading} className="w-full">Sign In</Button>
        </TabsContent>
        <TabsContent value="signup" className="space-y-4 mt-6">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleSignUp} disabled={loading} className="w-full">Create Account</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
