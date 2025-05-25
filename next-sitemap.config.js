const {
  getSitemapPosts,
  getSitemapProducts,
  getSitemapLeagues
} = require('./lib/sitemap-data-fetchers.js');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pathoftrade.net',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const paths = [];
    const defaultLastMod = new Date().toISOString();

    const [posts, products, leaguePoe1, leaguePoe2] = await Promise.all([
      getSitemapPosts(),
      getSitemapProducts(),
      getSitemapLeagues("path-of-exile-1"),
      getSitemapLeagues("path-of-exile-2"),
    ]);

    products.forEach((product) => {
      if (product && product.name && product.gameVersion && product.league) {
        const productPath = `/products/${encodeURIComponent(product.gameVersion)}/${encodeURIComponent(product.league)}/${encodeURIComponent(product.name)}`;
        paths.push({
          loc: productPath,
          lastmod: product.lastmod || defaultLastMod,
          changefreq: 'weekly',
          priority: 0.7,
        });
      }
    });

    posts.forEach((post) => {
      if (post && post.slug) {
        const postPath = `/blog/${encodeURIComponent(post.slug)}`;
        paths.push({
          loc: postPath,
          lastmod: post.lastmod || defaultLastMod,
          changefreq: 'daily',
          priority: 0.8,
        });
      }
    });

    leaguePoe1.forEach((league) => {
      if (league && league.name && league.gameVersion && league.difficulty) {
        const leaguePath = `/products/${encodeURIComponent(league.gameVersion)}?league=${encodeURIComponent(league.name)}&difficulty=${encodeURIComponent(league.difficulty)}`;
        paths.push({
          loc: leaguePath,
          lastmod: league.lastmod || defaultLastMod,
          changefreq: 'weekly',
          priority: 0.6,
        });
      }
    });

    leaguePoe2.forEach((league) => {
      if (league && league.name && league.gameVersion && league.difficulty) {
        const leaguePath = `/products/${encodeURIComponent(league.gameVersion)}?league=${encodeURIComponent(league.name)}&difficulty=${encodeURIComponent(league.difficulty)}`;
        paths.push({
          loc: leaguePath,
          lastmod: league.lastmod || defaultLastMod,
          changefreq: 'weekly',
          priority: 0.6,
        });
      }
    });

    return paths;
  }
};