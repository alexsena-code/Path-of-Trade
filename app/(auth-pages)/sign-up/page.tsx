import { signUpAction, signWithDiscord, signWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button";

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
    <main>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto gap-2 mt-10 mb-4">
        <h1 className="text-3xl font-bold mb-2">Sign up</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 ">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
        <p className="text-sm text text-foreground ">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </form>

      <div className="relative text-center text-sm my-4">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
        <div className="absolute inset-0 top-1/2 border-t border-border" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full " onClick={signWithGoogle}>
          <img
            alt="Google logo"
            width={24}
            height={24}
            src="/images/google-logo.svg"
          ></img>
          <span className="sr-only">Sign in with Google</span>
        </Button>
        <Button variant="outline" className="w-full" onClick={signWithDiscord}>
          <img
            alt="Discord logo"
            width={24}
            height={24}
            src="/images/Discord-Symbol-White.svg"
          ></img>
          <span className="sr-only">Sign in with Discord</span>
        </Button>
      </div>
    </main>
  );
}
