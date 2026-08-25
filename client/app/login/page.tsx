import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm border-white/5 bg-black/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/10">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-xl font-bold tracking-wide text-zinc-100">
            Sign In
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
