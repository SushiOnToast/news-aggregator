export { cn } from "cn"

export function relativeTime(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // returns in seconds

    if (diff < 60) return "just now";

    const units = [
        { label: "yr", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "w", seconds: 604800 },
        { label: "d", seconds: 86400 },
        { label: "hr", seconds: 3600 },
        { label: "min", seconds: 60 },
    ];

    for (const unit of units) {
        const value = Math.floor(diff / unit.seconds);

        if (value >= 1) {
            return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}
