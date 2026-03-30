import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";
