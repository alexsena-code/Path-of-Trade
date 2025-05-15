import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { Metadata } from "next";
import { OAuthProviders } from "@/components/oauth-providers";

export const metadata: Metadata = {
  title: "Sign In | Path of Trade",
  description: "Sign in to your Path of Trade account",
};

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="container max-w-md mx-auto pt-10 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to your account to continue
          </p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                name="email"
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  href="/forgot-password"
                  prefetch={true}
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="bg-white/5 border-white/10 focus:border-indigo-500"
              />
            </div>

            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
            >
              Sign in
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              href="/sign-up"
              prefetch={true}
            >
              Sign up
            </Link>
          </p>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <OAuthProviders />
      </div>
    </main>
  );
}
