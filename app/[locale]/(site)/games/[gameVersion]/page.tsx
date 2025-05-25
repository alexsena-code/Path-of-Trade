import { CurrencyInfo } from "@/components/currency-info";
import { LeagueSelectionPage } from "@/components/league-selection";
import { PatchInfo } from "@/components/PatchInfo";
import { Metadata } from "next";

// Generate metadata based on game version
export async function generateMetadata(
  props: {
    params: Promise<{ gameVersion: "path-of-exile-1" | "path-of-exile-2" }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const isPoe2 = params.gameVersion === "path-of-exile-2";
  const gameTitle = isPoe2 ? "Path of Exile 2" : "Path of Exile";
  const shortGameName = isPoe2 ? "PoE 2" : "PoE"; // Shorter version for concise text

  // More engaging and keyword-rich descriptions
  const description = isPoe2
    ? `Dive into Path of Exile 2 trading with Path of Trade Net! Securely buy and sell ${shortGameName} currency, items, and orbs. Experience instant transactions, competitive prices, and dedicated 24/7 support for all your ${gameTitle} needs.`
    : `Your premier Path of Exile trading hub is Path of Trade Net. Effortlessly buy and sell ${shortGameName} currency, orbs, and unique items. Benefit from lightning-fast delivery, unbeatable prices, and round-the-clock customer assistance for ${gameTitle}.`;

  const pageTitle = `Buy ${gameTitle} Currency & Items | Safe ${shortGameName} Trading | Path of Trade Net`;
  const canonicalUrl = `https://pathoftrade.net/${params.gameVersion}`; // Adjust path as per your routing
  const socialImageUrl = isPoe2
    ? `https://pathoftrade.net/images/social-poe2.png`
    : `https://pathoftrade.net/images/social-poe1.png`; // Create these images

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl, // Use the canonical URL here
      type: "website",
      siteName: "Path of Trade Net",
      images: [
        {
          url: socialImageUrl,
          width: 1200, // Standard OG image width
          height: 630, // Standard OG image height
          alt: `${gameTitle} Currency Trading - Path of Trade Net`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [socialImageUrl], // Twitter also uses og:image if twitter:image is not set, but explicit is better
      // site: "@YourTwitterHandle", // Optional: Add your Twitter username
    },
    // Meta keywords are generally ignored by Google, so they are omitted.
    // Focus on high-quality content and natural keyword integration.
  };
}

export default async function Page({
  params,
}: {
  params: { gameVersion: "path-of-exile-1" | "path-of-exile-2" };
}) {
  const { gameVersion } = await params;
  const patchVersion = gameVersion === "path-of-exile-2" ? "poe2" : "3.25";
  const isPoe2 = gameVersion === "path-of-exile-2";
  const gameTitle = isPoe2 ? "Path of Exile 2" : "Path of Exile";
  const shortGameName = isPoe2 ? "PoE 2" : "PoE";

  // Structured data for rich results


  return (
    <>

      <main className="container mx-auto min-h-screen space-y-8 py-8">
        <section className="mb-12">
          <LeagueSelectionPage gameVersion={gameVersion} />
        </section>

        <article className="space-y-8">
          <header>
            <h2 className="text-4xl font-bold">{gameTitle}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              PathofTrade.net is your trusted source for {gameTitle} currency
              trading. Buysafely and instantly. Get the best prices and fast
              delivery.
            </p>
          </header>
          <PatchInfo gameVersion={patchVersion} />

          <section className="mt-8 border-t pt-6 dark:border-gray-700 ">
            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Why Trade with Path of Trade Net?
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Unmatched Security:</strong> Your transactions and
                account safety are our top priority.
              </li>
              <li>
                <strong>Lightning-Fast Delivery:</strong> Get your currency and
                items typically within minutes.
              </li>
              <li>
                <strong>Competitive Pricing:</strong> We constantly monitor the
                market to offer you the best deals.
              </li>
              <li>
                <strong>24/7 Customer Support:</strong> Our dedicated team is
                always here to assist you.
              </li>
              <li>
                <strong>Wide Selection:</strong> A vast inventory of orbs,
                currency, and items for {gameTitle}.
              </li>
            </ul>
          </section>
          <CurrencyInfo gameVersion={gameVersion} />
        </article>
      </main>
    </>
  );
}
