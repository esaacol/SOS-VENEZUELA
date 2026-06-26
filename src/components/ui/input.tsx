import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-zinc-200">{label}{children}</label>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("min-h-10 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none ring-rescue-500/30 placeholder:text-zinc-500 focus:ring-4", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("min-h-10 rounded-lg border border-white/10 bg-carbon-900 px-3 text-sm text-white outline-none ring-rescue-500/30 focus:ring-4", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none ring-rescue-500/30 placeholder:text-zinc-500 focus:ring-4", className)} {...props} />;
}
