"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Product } from "@/lib/interface";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Force redirect to home page
  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signWithGoogle = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Add log to help diagnose performance
  console.log("Connecting to Google OAuth...");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?redirect_to=/`,
    },
  }) 
  if (data.url) {
    redirect(data.url)
  }
}

export const signWithDiscord = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Add log to help diagnose performance
  console.log("Connecting to Discord OAuth...");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/auth/callback?redirect_to=/`,
    }
  })
  if (data.url) {
    redirect(data.url)
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error.message);
    throw new Error('Could not fetch products');
  }

  return data as Product[];
};

export const getProductsByVersionAndLeague = async (
  gameVersion: string,
  league: string,
  difficulty: string
): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('gameVersion', gameVersion)
    .eq('league', league)
    .eq('difficulty', difficulty);

  if (error) {
    console.error('Error fetching filtered products:', error.message);
    throw new Error('Could not fetch filtered products');
  }

  return data as Product[];
};

export const newProduct = async (product: Product) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      category: product.category,
      gameVersion: product.gameVersion,
      league: product.league,
      price: product.price,
      imgUrl: product.imgUrl,
      difficulty: product.difficulty
    });

  if (error) {
    throw new Error(error.message);
  }
};

export const getLeagues = async (gameVersion: 'path-of-exile-1' | 'path-of-exile-2') => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('gameVersion', gameVersion)

  if (error) {
    console.error('Error fetching leagues:', error.message);
    throw new Error('Could not fetch leagues');
  }

  return data;
};


