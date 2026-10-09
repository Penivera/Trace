"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, fieldErrorId } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import { login } from "../api";
import { loginSchema } from "../schemas";
import { FormAlert } from "@/components/ui/form-alert";
import { oauthProviderName, SocialSignIn } from "./social-sign-in";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
    // Validate a field once the user leaves it, then live as they fix it.
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      // TODO: redirect once the session flow is defined with the backend.
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={errors.root?.message} />

      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? fieldErrorId("email") : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? fieldErrorId("password") : undefined}
          {...register("password")}
        />
      </Field>

      <div className="flex items-center justify-between gap-4 text-xs">
        <label className="flex items-center gap-2 text-foreground/90">
          <input type="checkbox" className="size-4 accent-accent" {...register("remember")} />
          Remember me
        </label>
        <Link
          href={"/forgot-password" as Route}
          className="text-foreground/90 underline-offset-4 hover:text-accent hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>

      <SocialSignIn
        label="Continue with"
        // TODO: start the OAuth redirect once the backend exposes it.
        onContinue={(provider) =>
          setError("root", {
            message: `Signing in with ${oauthProviderName[provider]} isn't available yet.`,
          })
        }
      />
    </form>
  );
}
