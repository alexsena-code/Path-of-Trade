import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="container max-w-md mx-auto pt-10 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg">
        <form className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new password for your account
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your new password"
                required
                className="bg-white/5 border-white/10 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                required
                className="bg-white/5 border-white/10 focus:border-indigo-500"
              />
            </div>

            <SubmitButton 
              pendingText="Updating..." 
              formAction={resetPasswordAction}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
            >
              Reset Password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Remember your password?{" "}
            <Link
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
} 