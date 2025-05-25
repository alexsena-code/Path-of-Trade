// sitemap-fetcher.js

const fetchSitemapData = async () => {
  try {
    // Make sure to use your absolute production URL
    const res = await fetch('https://pathoftrade.net/api/sitemap-data'); // Replace with your production URL
    if (!res.ok) {
        throw new Error(`Failed to fetch sitemap data: ${res.statusText}`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error in fetchSitemapData:", error);
    return null;
  }
};

module.exports = fetchSitemapData;