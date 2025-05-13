

module.exports = {
   siteUrl: "https://www.pathoftrade.net",
   generateRobotsTxt: true,
   robotsTxtOptions: {
      policies: [
         {userAgent: "*", disallow: "/orders/*"},
         {userAgent: "*", allow: "/"},
      ],
   },
   exclude: ["/orders/*"]
};