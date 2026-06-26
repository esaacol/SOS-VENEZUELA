import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-rescue-500 text-black hover:bg-rescue-600",
  secondary: "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]",
  ghost: "text-zinc-300 hover:bg-white/[0.08]"
};

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button className={cn("inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50", variants[variant], className)} {...props} />;
}

export function LinkButton({ className, href, variant = "primary", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: keyof typeof variants; children: ReactNode }) {
  return <Link href={href} className={cn("inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition", variants[variant], className)} {...props}>{children}</Link>;
}
