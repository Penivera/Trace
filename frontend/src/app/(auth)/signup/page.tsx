import type { Metadata, Route } from "next";
import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthScene } from "@/features/auth/components/auth-scene";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <AuthScene
      characters={[
        {
          src: "/auth-img/policewoman.png",
          width: 1899,
          height: 2058,
          // ~17% transparent padding on the right of this PNG.
          positionClassName: "right-[calc(50%+200px-9vh)]",
          renderedWidth: "54vh",
        },
      ]}
    >
      <AuthCard
        title="Welcome to TRACE"
        description="Please enter your details to create your account."
        footer={
          <>
            Already have an account?{" "}
            <Link href={"/login" as Route} className="font-semibold text-accent hover:underline">
              Login
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthCard>
    </AuthScene>
  );
}
