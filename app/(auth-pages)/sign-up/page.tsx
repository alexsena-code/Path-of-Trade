import { signUpAction, signWithDiscord, signWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <main className="container max-w-md mx-auto pt-10 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg">
        <form className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Sign up to get started
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                name="email" 
                placeholder="you@example.com" 
                required 
                className="bg-white/5 border-white/10 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                minLength={6}
                required
                className="bg-white/5 border-white/10 focus:border-indigo-500"
              />
            </div>

            <SubmitButton 
              formAction={signUpAction} 
              pendingText="Signing up..."
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
            >
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full bg-white/5 border-white/10 hover:bg-white/10" 
            onClick={signWithGoogle}
          >
            <Image
              alt="Google logo"
              width={20}
              height={20}
              src="/images/google-logo.svg"
              className="mr-2"
            />
            <span>Google</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/5 border-white/10 hover:bg-white/10" 
            onClick={signWithDiscord}
          >
            <Image
              alt="Discord logo"
              width={20}
              height={20}
              src="/images/Discord-Symbol-White.svg"
              className="mr-2"
            />
            <span>Discord</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
