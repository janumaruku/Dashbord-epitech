import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Your workspace starts here"
      title="Create your account"
      description="Make room for the things you follow."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
