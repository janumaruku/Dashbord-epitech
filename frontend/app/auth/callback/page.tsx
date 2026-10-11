"use client";

import axios from "axios";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { consumeGithubState } from "@/lib/github";
import type { Service } from "@/hooks/useServices";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-[11px] font-bold text-white">
        e_
      </span>
      <span className="text-xs font-semibold text-white">
        Epitech Dashboard
      </span>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function completeConnection() {
      const providerError = searchParams.get("error");
      if (providerError) {
        setError("GitHub authorization was cancelled.");
        return;
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      if (!code || !state) {
        setError("Missing authorization code from GitHub.");
        return;
      }

      const expectedState = consumeGithubState();
      if (!expectedState || expectedState !== state) {
        setError("Could not verify this request. Please try connecting again.");
        return;
      }

      if (!getAccessToken()) {
        router.replace("/auth/login");
        return;
      }

      try {
        const services = await api.get<Service[]>("/api/services");
        const github = services.data.find(
          (service) => service.oauth_provider === "github",
        );
        if (!github) {
          setError("The GitHub service isn't available right now.");
          return;
        }

        await api.post(`/api/services/${github.id}/subscribe`, { code });
        router.replace("/services");
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response?.data?.code === "ALREADY_SUBSCRIBED"
        ) {
          router.replace("/services");
          return;
        }
        if (
          axios.isAxiosError(err) &&
          typeof err.response?.data?.message === "string"
        ) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong while connecting GitHub.");
        }
      }
    }

    completeConnection();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-400/10 text-rose-400">
          <AlertTriangle size={24} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-white">Connection failed</h1>
          <p className="max-w-xs text-sm text-zinc-400">{error}</p>
        </div>
        <Link
          href="/services"
          className="text-[13px] font-semibold text-blue-300 hover:underline"
        >
          Back to services
        </Link>
        <Logo />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="h-14 w-14 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-white">Connecting GitHub</h1>
        <p className="text-sm text-zinc-400">
          Please wait while we securely process your connection.
        </p>
        <p className="text-xs text-zinc-600">
          You can safely leave this page if the connection takes too long.
        </p>
      </div>
      <Logo />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <Suspense fallback={null}>
        <CallbackContent />
      </Suspense>
    </main>
  );
}
