import { forwardRef } from "react";

const variants: Record<string, string> = {
  default: "bg-zinc-100 text-zinc-700",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-900",
  danger: "bg-red-50 text-red-800",
  info: "bg-sky-50 text-sky-900",
};

export const Badge = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: keyof typeof variants;
  }
>(({ className = "", variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${variants[variant]} ${className}`}
    {...props}
  />
));
Badge.displayName = "Badge";
