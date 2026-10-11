"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import api from "@/lib/api";
import { setStoredUser, setTokens, type User } from "@/lib/auth";
import AuthField from "@/components/auth/AuthField";

type RegisterResponse = {
  token: string;
  refresh_token: string;
  user: User;
};

const PASSWORD_REQUIREMENTS = [
  "At least 8 characters",
  "An uppercase and a lowercase letter",
  "A digit and a special character",
];

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<RegisterResponse>("/auth/register", {
        username,
        email,
        password,
      });

      setTokens(response.data.token, response.data.refresh_token);
      setStoredUser(response.data.user);

      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === "string") {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AuthField
        label="Username · required"
        placeholder="alice_01"
        hint="3–50 characters. Letters, numbers, and underscores only."
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          setError("");
        }}
        autoComplete="username"
      />

      <AuthField
        label="Email · required"
        type="email"
        placeholder="alice@example.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
        }}
        autoComplete="email"
      />

      <AuthField
        label="Password · required"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setError("");
        }}
        autoComplete="new-password"
      />

      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-medium text-zinc-400">
          Your password must include:
        </p>
        {PASSWORD_REQUIREMENTS.map((requirement) => (
          <div key={requirement} className="flex items-center gap-1.5">
            <Check size={12} className="text-green-400" />
            <p className="text-[11px] text-zinc-400">{requirement}</p>
          </div>
        ))}
      </div>

      <AuthField
        label="Confirm password · required"
        type="password"
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          setError("");
        }}
        autoComplete="new-password"
      />

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 disabled:opacity-50"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-[11px] text-zinc-600">
        You&apos;ll be signed in automatically after creating your account.
      </p>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-blue-300 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
