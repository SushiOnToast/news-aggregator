import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { style: "short" });

export function relativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // returns in seconds

  if (diff < 60) return "just now";

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ] as const;

  if (Math.abs(diff) < 60) {
    return "just now";
  }

  for (const unit of units) {
    const value = Math.floor(Math.abs(diff) / unit.seconds);

    if (value >= 1) {
      return rtf.format(-value, unit.label);
    }
  }

  return "just now";
}
