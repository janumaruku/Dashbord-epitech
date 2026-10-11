"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export default function AuthField({
  label,
  hint,
  id,
  type,
  ...inputProps
}: AuthFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-xs font-medium text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={resolvedType}
          className={`w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none ${
            isPassword ? "pr-10" : ""
          }`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((show) => !show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}
