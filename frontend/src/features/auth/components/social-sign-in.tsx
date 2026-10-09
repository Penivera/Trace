"use client";

import { XLogo } from "@/components/icons/x-logo";
import { Button } from "@/components/ui/button";

type SocialSignInProps = {
  label: string;
  onUnavailable: (message: string) => void;
};

/** "Continue with X". The OAuth flow lives on the backend; until it exists, explain instead of failing silently. */
export function SocialSignIn({ label, onUnavailable }: SocialSignInProps) {
  return (
    <Button
      variant="light"
      className="w-full"
      onClick={() => onUnavailable("Signing in with X isn't available yet.")}
    >
      {label}
      <XLogo className="size-4" />
    </Button>
  );
}
