import { signInAction, signWithDiscord, signWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className=" min-h-screen  ">
      
      <form className="flex-1 flex flex-col min-w-64 mt-10 mb-4  mx-auto">
        <h1 className="text-3xl font-bold">Sign in</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>

        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </form>

      <div className="relative text-center text-sm my-4">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
        <div className="absolute inset-0 top-1/2 border-t border-border" />
      </div>

      <div className="grid grid-cols-2 gap-2 ">
        <Button variant="outline" className="w-full " onClick={signWithGoogle}>
          <Image
            alt="Google logo"
            width={24}
            height={24}
            src="/images/google-logo.svg"
          ></Image>
          <span className="sr-only">Sign in with Google</span>
        </Button>
        <Button variant="outline" className="w-full" onClick={signWithDiscord}>
          <Image
            alt="Discord logo"
            width={24}
            height={24}
            src="/images/Discord-Symbol-White.svg"
          ></Image>
          <span className="sr-only">Sign in with Discord</span>
        </Button>
      </div>

    </main>
  );
}
