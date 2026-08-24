import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm border-zinc-800 bg-card/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-5">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials below to create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
