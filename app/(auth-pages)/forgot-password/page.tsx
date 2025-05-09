import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Path of Trade",
  description: "Reset your Path of Trade account password",
};

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="container max-w-md mx-auto pt-10 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              name="email" 
              placeholder="you@example.com" 
              required 
              className="bg-white/5 border-white/10 focus:border-indigo-500"
              autoFocus
              type="email"
            />
          </div>

          <SubmitButton 
            pendingText="Sending Reset Link..." 
            formAction={forgotPasswordAction}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
          >
            Send Reset Link
          </SubmitButton>
          
          <FormMessage message={searchParams} />
          
          <div className="mt-4 text-center">
            <Link 
              href="/sign-in" 
              className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              prefetch={true}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
      
      <SmtpMessage />
    </main>
  );
}
