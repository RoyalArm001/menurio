import type { MetadataRoute } from "next";
import { getPlatformBaseUrl } from "@/lib/utils/slug";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPlatformBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/r/", "/pricing", "/features/"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/login",
          "/register",
          "/onboarding/",
          "/marketing-preview/",
          "/setup-preview",
          "/studio-preview/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
