import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-card/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-5">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
