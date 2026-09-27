import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/** Read-only star display used on cards, chef profiles and reviews. */
export function StarRating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(value) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-border"}
          />
        ))}
      </span>
      <span className="font-medium text-foreground">{value ? value.toFixed(1) : "New"}</span>
      {count !== undefined && count > 0 && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  );
}

/** Interactive 5-star picker used in the review form. */
export function StarPicker({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={i <= value ? "fill-[var(--gold)] text-[var(--gold)]" : "text-border"}
          />
        </button>
      ))}
    </div>
  );
}
