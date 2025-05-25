import { NextResponse } from 'next/server';
import { Product } from '@/lib/interface';
import { Blog } from '@/types/blog';

import { getLeagues, getProducts } from '@/app/actions';
import { getPosts } from '@/sanity/sanity-utils';

export async function GET() {
  try {
    // Call your actions to get the data
    const posts = await getPosts(); // Example action
    const products = await getProducts(); // Example action
    const leaguePoe1 = await getLeagues('path-of-exile-1'); // Example action
    const leaguePoe2 = await getLeagues('path-of-exile-2'); // Example action

    // Combine or format data as needed
    const data = {
      posts: posts.map((post: Blog) => ({ slug: post.slug, updatedAt: post.publishedAt.toString() })),
      products: products.map((product: Product) => ({ name: product.name, gameVersion: product.gameVersion, league: product.league, difficulty: product.difficulty, updatedAt: product.updatedAt?.toString() ?? '' })),
      leaguePoe1: leaguePoe1.map((league: { name: string; gameVersion: string; difficulty: string; updatedAt: string; }) => ({ name: league.name, gameVersion: league.gameVersion, difficulty: league.difficulty, updatedAt: league.updatedAt.toString() })),
      leaguePoe2: leaguePoe2.map((league: { name: string; gameVersion: string; difficulty: string; updatedAt: string; }) => ({ name: league.name, gameVersion: league.gameVersion, difficulty: league.difficulty, updatedAt: league.updatedAt.toString() })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}