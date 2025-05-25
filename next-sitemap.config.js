// next-sitemap.config.js

// Assume you have functions to fetch all product/category slugs/paths
// These would typically hit your database or API.
// IMPORTANT: These functions MUST run in a Node.js environment,
const fetchSitemapData = require('./lib/sitemap-fetcher.js');



module.exports = {
   siteUrl: 'https://pathoftrade.net', // Your site's base URL
   generateRobotsTxt: true, // Optional: Creates a robots.txt
   changefreq: 'daily',
   priority: 0.7,
   sitemapSize: 7000, // Optional: Splits sitemap if > 7000 URLs (Max 50k)
   exclude: ['/server-sitemap.xml', '/api/*', '/auth/*', '/admin/*', '/support/*', '/orders/*', '/cart/*', '/checkout/*', '/account/*'], // Exclude paths, /server-sitemap.xml is for server-side generated sitemaps
   // Optional: Add custom rules for robots.txt
   robotsTxtOptions: {
      policies: [
         { userAgent: '*', allow: '/' },
         // Example: Disallow crawling of cart or account pages
         { userAgent: '*', disallow: '/cart' },
         { userAgent: '*', disallow: '/account' },
         { userAgent: '*', disallow: '/admin' },
         { userAgent: '*', disallow: '/support' },
         { userAgent: '*', disallow: '/orders' },
         { userAgent: '*', disallow: '/checkout' },
         { userAgent: '*', disallow: '/cart' },
         { userAgent: '*', disallow: '/account' },
         { userAgent: '*', disallow: '/auth' },
         { userAgent: '*', disallow: '/api' },

      ],
      additionalSitemaps: [
         // If you use a server-side sitemap (Option 2b), list it here
        //'https://pathoftrade.net/server-sitemap.xml',
      ],
   },
   // Function to add dynamic paths (products, categories)
   // This is often the most complex part.
   // An alternative is server-side sitemap generation (see Option 2b).
   // This example assumes you can fetch all slugs efficiently.
   additionalPaths: async (config) => {
      const data = await fetchSitemapData();
      console.log(data)

      // Check if data fetching was successful
      if (!data) {
          console.error("Failed to fetch sitemap data, returning empty paths.");
          return [];
      }
  
      // ✅ Access data using 'data.products', 'data.leaguePoe1', etc.
      const productsUrls = (data.products || []).map(product =>
          `/products/${encodeURIComponent(product.name)}?gameVersion=${encodeURIComponent(product.gameVersion)}&league=${encodeURIComponent(product.league)}&difficulty=${encodeURIComponent(product.difficulty)}`
      );
  
      // Combine both league arrays
      const allLeagues = [...(data.leaguePoe1 || []), ...(data.leaguePoe2 || [])];
  
      const leaguesUrls = allLeagues.map(league =>
          `/products?gameVersion=${encodeURIComponent(league.gameVersion)}&league=${encodeURIComponent(league.name)}&difficulty=${encodeURIComponent(league.difficulty)}`
      );
  
      const blogUrls = (data.posts || []).map(post =>
          `/blog/${encodeURIComponent(post.slug)}`
          
      );
  
      // ✅ Use the generated URLs
      const productPaths = productsUrls.map((url) => ({
          loc: url,
          // Use actual updatedAt if available, otherwise use current date
          lastmod: data.products.find(p => url.includes(p.name))?.updatedAt
                     ? new Date(data.products.find(p => url.includes(p.name)).updatedAt).toISOString()
                     : new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
      }));
  
      const leaguePaths = leaguesUrls.map((url) => ({
          loc: url,
          lastmod: data.leaguePoe1.find(p => url.includes(p.name))?.updatedAt
                     ? new Date(data.leaguePoe1.find(p => url.includes(p.name)).updatedAt).toISOString()
                     : new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.9,
      }));
  
      const blogPaths = (posts || []).map(post => ({
         loc: `/blog/${encodeURIComponent(post.slug)}`,
         // Use the *actual* date property from your 'post' object
         lastmod: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
         changefreq: 'daily',
         priority: 0.9,
     }));
  
      return [...productPaths, ...leaguePaths, ...blogPaths];
   }
}