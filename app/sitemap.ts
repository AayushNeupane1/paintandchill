import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/** Every indexable route. Add new pages here when you add them. */
const routes = ["", "/sessions", "/gallery", "/story", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
