import type { ComponentType } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function DynamicIcon({
  name,
  className,
  ...rest
}: { name: string } & LucideProps) {
  const Icon = (
    LucideIcons as unknown as Record<string, ComponentType<LucideProps>>
  )[name];
  if (!Icon) {
    const Fallback = LucideIcons.Circle;
    return <Fallback className={className} {...rest} />;
  }
  return <Icon className={className} {...rest} />;
}
