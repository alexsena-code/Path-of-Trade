import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

async function resendVerificationEmail(formData: FormData) {
  "use server";
  
  const email = formData.get('email') as string;
  if (!email) return;
  
  const supabase = await createClient();
  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL;
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('Error resending verification email:', error.message);
    }
  } catch (err) {
    console.error('Failed to resend verification email:', err);
  }
}

export default async function VerifyEmail({ 
  searchParams 
}: { 
  searchParams: { email?: string } 
}) {
  const { email } = await searchParams;

  return (
    <main className="container max-w-md mx-auto pt-10 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent mb-4">
          Verify Your Email
        </h1>
        
        <p className="text-muted-foreground mb-2">
          We've sent a verification link to <span className="text-white font-medium">{email}</span>
        </p>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 w-full mb-6 mt-4">
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
            <p className="text-sm text-white">Check your email inbox</p>
          </div>
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
            <p className="text-sm text-white">Click the verification link in the email</p>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
            <p className="text-sm text-white">Start using Path of Trade</p>
          </div>
        </div>
        
        <div className="space-y-3 w-full">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10" asChild>
            <Link href="/sign-in">
              Sign In
            </Link>
          </Button>

          <form action={resendVerificationEmail}>
            <input type="hidden" name="email" value={email} />
            <Button 
              type="submit" 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend verification email
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
} 