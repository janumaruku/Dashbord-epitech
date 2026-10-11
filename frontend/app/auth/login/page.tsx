import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your dashboard"
      description="Pick up where you left off."
    >
      <LoginForm />
    </AuthLayout>
  );
}
