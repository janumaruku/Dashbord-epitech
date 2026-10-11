"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import api from "@/lib/api";
import { setStoredUser, setTokens, type User } from "@/lib/auth";
import AuthField from "@/components/auth/AuthField";

type LoginResponse = {
  token: string;
  refresh_token: string;
  user: User;
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      setTokens(response.data.token, response.data.refresh_token);
      setStoredUser(response.data.user);

      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (
        axios.isAxiosError(err) &&
        typeof err.response?.data?.message === "string"
      ) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        autoComplete="current-password"
      />

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-400">
        New to Epitech Dashboard?{" "}
        <Link href="/auth/register" className="font-semibold text-blue-300 hover:underline">
          Create an account
        </Link>
      </p>

      <div className="flex items-center justify-center gap-2 border-t border-zinc-800 pt-5">
        <Lock size={13} className="text-zinc-600" />
        <p className="text-xs text-zinc-600">
          Your dashboard is private to your account.
        </p>
      </div>
    </form>
  );
}
