import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { verifyTwoFactor, resendTwoFactor } from '@/api/auth';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export default function Verify2FA() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { login } = useUser();

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const userId = location?.state?.userId as string | undefined;
  const maskedEmail = location?.state?.maskedEmail as string | undefined;

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
    }
  }, [userId, navigate]);

  const handleVerify = async () => {
    if (!userId) return;
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    try {
      setSubmitting(true);
      const result = await verifyTwoFactor({ userId, code });
      localStorage.setItem('token', result.token);
      login(result as any, result.token);
      toast.success('Verification successful');
      if (result.role === 'student') navigate('/dashboard/student');
      else if (result.role === 'teacher') navigate('/dashboard/teacher');
      else if (result.role === 'admin') navigate('/dashboard/admin');
      else navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid or expired code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!userId) return;
    try {
      setResending(true);
      const res = await resendTwoFactor(userId);
      toast.success(res.message || 'A new code has been sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Two-Factor Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            Enter the 6-digit code we sent to {maskedEmail || 'your email'}
          </p>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" onClick={handleVerify} disabled={submitting || code.length !== 6}>
              {submitting ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleResend} disabled={resending}>
              {resending ? 'Resending...' : 'Resend Code'}
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>Back to login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
