import type { Metadata, Route } from "next";
import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthScene } from "@/features/auth/components/auth-scene";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthScene
      characters={[
        {
          src: "/auth-img/first-lady-character.png",
          width: 2464,
          height: 1938,
          // ~29% transparent padding on the right of this PNG.
          positionClassName: "right-[calc(50%+180px-21vh)]",
          renderedWidth: "74vh",
        },
        {
          src: "/auth-img/yellow-haired-character.png",
          width: 1532,
          height: 2230,
          // ~17% transparent padding on the left.
          positionClassName: "left-[calc(50%+212px-7vh)]",
          renderedWidth: "40vh",
        },
      ]}
    >
      <AuthCard
        title="Welcome back"
        description="Please enter your details to login."
        footer={
          <>
            New to TRACE?{" "}
            <Link href={"/signup" as Route} className="font-semibold text-accent hover:underline">
              Sign up
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthScene>
  );
}
