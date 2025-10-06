#!/usr/bin/env node
import { writeFileSync } from "fs";

const baseUrl = "https://flatcher.su";

const routes = [
  "/",
  "/flats",
  "/retail",
  "/services",
  "/company",
  "/contacts",
  "/privacy",
  "/user-agreement",
  "/data-processing",
  "/consent"
];

const today = new Date().toISOString().split("T")[0];

const urlset = routes
  .map(
    (route) =>
      `<url>
  <loc>${baseUrl}${route}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>${route === "/" ? "1.0" : "0.8"}</priority>
</url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

writeFileSync("public/sitemap.xml", sitemap, "utf8");
console.log("sitemap.xml generated");

