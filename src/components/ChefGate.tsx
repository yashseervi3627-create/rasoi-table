import { Link } from "@tanstack/react-router";
import { ChefHat } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { EmptyState, PageShell } from "@/components/ui-kit";
import type { Chef } from "@/lib/types";

type LoggedInUser = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "chef";
};

export function ChefGate({
  children,
}: {
  children: (chef: Chef) => ReactNode;
}) {
  const [loggedInUser, setLoggedInUser] =
    useState<LoggedInUser | null>(null);

  useEffect(() => {
    const updateUser = () => {
      const savedUser = localStorage.getItem("rasoihubUser");

      if (!savedUser) {
        setLoggedInUser(null);
        return;
      }

      try {
        const user = JSON.parse(savedUser);

        if (user.role === "chef") {
          setLoggedInUser(user);
        } else {
          setLoggedInUser(null);
        }
      } catch {
        setLoggedInUser(null);
      }
    };

    updateUser();

    window.addEventListener("rasoihub-auth", updateUser);

    return () => {
      window.removeEventListener("rasoihub-auth", updateUser);
    };
  }, []);

  if (!loggedInUser) {
    return (
      <PageShell>
        <EmptyState
          icon={<ChefHat size={24} />}
          title="Chef sign-in required"
          description="Please sign in with a chef account to open this page."
          action={
            <Link
              to="/login"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Go to Login
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <>
      {children(loggedInUser as unknown as Chef)}
    </>
  );
}