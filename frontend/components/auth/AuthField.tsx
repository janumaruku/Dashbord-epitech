"use client";

import { useId, type InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export default function AuthField({
  label,
  hint,
  id,
  ...inputProps
}: AuthFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-xs font-medium text-zinc-400">
        {label}
      </label>
      <input
        id={fieldId}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
        {...inputProps}
      />
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}
