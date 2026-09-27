import { Check } from "lucide-react";

import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Visual step-by-step tracker: Placed → Accepted → Preparing → Ready → Completed. */
export function OrderProgress({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(status);

  return (
    <div className="flex items-start">
      {ORDER_STATUSES.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "bg-transparent" : i <= currentIndex ? "bg-primary" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check size={15} /> : i + 1}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === ORDER_STATUSES.length - 1
                    ? "bg-transparent"
                    : i < currentIndex
                      ? "bg-primary"
                      : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 text-center text-[11px] font-medium sm:text-xs",
                done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
