import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Globe2,
  Languages,
  LayoutTemplate,
  Palette,
  PlugZap,
  QrCode,
  SearchCheck,
  ShoppingBag,
} from "lucide-react";

export type FeatureVisual =
  | "website"
  | "qr-menu"
  | "orders"
  | "analytics"
  | "integrations"
  | "custom";

export type MarketingFeature = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  visual: FeatureVisual;
  benefits: string[];
  steps: Array<{ title: string; description: string }>;
};

export const marketingFeatures: MarketingFeature[] = [
  {
    slug: "restaurant-website",
    name: "Restaurant website",
    eyebrow: "Restaurant website",
    title: "A proper home for your restaurant online.",
    description:
      "Tell your story, show the atmosphere and give guests everything they need before they decide to visit.",
    icon: LayoutTemplate,
    visual: "website",
    benefits: [
      "A polished multi-page restaurant presence",
      "Hours, contact details, gallery and directions in one place",
      "Fast, responsive pages that look considered on every screen",
    ],
    steps: [
      { title: "Choose your structure", description: "Start with the pages your guests expect: home, menu, story and contact." },
      { title: "Make it yours", description: "Add your logo, photography, colors and restaurant voice." },
      { title: "Publish with confidence", description: "Share one clear destination across Google, social and QR." },
    ],
  },
  {
    slug: "qr-menu",
    name: "QR menu",
    eyebrow: "QR menu",
    title: "A menu made for appetite, not spreadsheets.",
    description:
      "Give guests a fast, visual mobile menu with clear choices, useful dietary details and a permanent QR destination.",
    icon: QrCode,
    visual: "qr-menu",
    benefits: [
      "Permanent QR links that continue working as you evolve",
      "Search, categories, product photography and dietary tags",
      "Clear availability so guests only see what can be ordered",
    ],
    steps: [
      { title: "Build your menu", description: "Organize dishes into categories and add descriptions, images and prices." },
      { title: "Set guest-friendly details", description: "Add allergens, calories, tags and availability where they matter." },
      { title: "Place your QR", description: "Print once and let each scan open the current menu." },
    ],
  },
  {
    slug: "online-orders",
    name: "Online orders",
    eyebrow: "Online orders",
    title: "Turn intent into an order with less friction.",
    description:
      "Bring pickup, delivery and table ordering into one calm guest experience and one clear team view.",
    icon: ShoppingBag,
    visual: "orders",
    benefits: [
      "Pickup, delivery and table-service options",
      "A simple cart that works naturally on mobile",
      "Order status visibility for guests and staff",
    ],
    steps: [
      { title: "Choose how you serve", description: "Enable the service options that make sense for your restaurant." },
      { title: "Set your menu availability", description: "Control which dishes and order methods are available now." },
      { title: "Keep service moving", description: "Give your team a focused view of incoming and active orders." },
    ],
  },
  {
    slug: "themes",
    name: "Custom themes",
    eyebrow: "Custom themes",
    title: "A digital experience that feels unmistakably yours.",
    description:
      "Choose a professional starting point, then shape the logo, color, type and menu style around your restaurant.",
    icon: Palette,
    visual: "custom",
    benefits: [
      "Professional restaurant themes, not generic templates",
      "Brand color, logo, font and cover controls",
      "A consistent visual system across your website and menu",
    ],
    steps: [
      { title: "Pick a starting point", description: "Choose a theme that matches your cuisine, atmosphere and service style." },
      { title: "Set your identity", description: "Apply your visual language without needing a designer for every change." },
      { title: "Preview before publishing", description: "See the website and mobile menu together before guests do." },
    ],
  },
  {
    slug: "multilingual-menu",
    name: "Multilingual menu",
    eyebrow: "Multilingual menu",
    title: "Welcome every guest in a language they understand.",
    description:
      "Manage one menu in multiple languages without breaking the visual experience or creating duplicate work.",
    icon: Languages,
    visual: "custom",
    benefits: [
      "Language switching designed for mobile guests",
      "Translations stay attached to the right menu item",
      "One menu structure to maintain as your audience grows",
    ],
    steps: [
      { title: "Choose your languages", description: "Enable the languages your guests and team actually use." },
      { title: "Translate with context", description: "Keep item names, descriptions and dietary information easy to understand." },
      { title: "Let guests switch", description: "Guests can explore in their preferred language without losing their place." },
    ],
  },
  {
    slug: "custom-domain",
    name: "Custom domain",
    eyebrow: "Custom domain",
    title: "Make every link feel like your restaurant.",
    description:
      "Connect your own web address so the journey from search to menu feels continuous, trusted and recognizably yours.",
    icon: Globe2,
    visual: "custom",
    benefits: [
      "A memorable, restaurant-owned web address",
      "One consistent brand across website, menu and social links",
      "A clear route from local search to your front door",
    ],
    steps: [
      { title: "Choose your address", description: "Use a domain that is easy for regulars and new guests to remember." },
      { title: "Connect it", description: "Follow a guided domain setup designed for restaurant owners." },
      { title: "Share everywhere", description: "Use the same address across your print, social and search presence." },
    ],
  },
  {
    slug: "seo",
    name: "SEO",
    eyebrow: "SEO foundation",
    title: "Help nearby guests find you at the right moment.",
    description:
      "Start with a restaurant website structure that gives search engines the details guests are looking for: your menu, location, hours and story.",
    icon: SearchCheck,
    visual: "custom",
    benefits: [
      "Structured pages for menu, location and contact information",
      "Fast public pages that are pleasant for people and crawlers",
      "A clearer local search foundation as your content grows",
    ],
    steps: [
      { title: "Complete the essentials", description: "Add your restaurant name, location, opening hours and menu." },
      { title: "Publish useful pages", description: "Give guests distinct, focused destinations instead of one long page." },
      { title: "Keep it current", description: "Update seasonal menus and service details whenever your restaurant changes." },
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    eyebrow: "Analytics",
    title: "See what attracts guests and what they choose next.",
    description:
      "Track menu interest, QR scans and orders in a clear restaurant-focused view, so you can make decisions with context.",
    icon: BarChart3,
    visual: "analytics",
    benefits: [
      "Views, menu views and QR scans in one place",
      "Popular products and order patterns at a glance",
      "A simpler way to understand guest attention over time",
    ],
    steps: [
      { title: "See the overview", description: "Start with the measures that reveal how guests are finding and using your menu." },
      { title: "Spot patterns", description: "Identify popular dishes and high-intent moments in your service." },
      { title: "Act on insight", description: "Use what you learn to refine your menu and guest journey." },
    ],
  },
  {
    slug: "integrations",
    name: "Integrations",
    eyebrow: "Integrations",
    title: "A restaurant presence built to connect as you grow.",
    description:
      "Keep your website, menu and orders at the center today, with clearly communicated future connections for the tools your team relies on.",
    icon: PlugZap,
    visual: "integrations",
    benefits: [
      "One dependable public destination for guests",
      "Connections presented clearly as they become available",
      "A platform designed for future POS and iiko workflows",
    ],
    steps: [
      { title: "Keep the essentials together", description: "Make Menurio the current source of truth for your public presence." },
      { title: "Choose useful connections", description: "Adopt integrations only where they serve a real restaurant workflow." },
      { title: "Grow without rebuilding", description: "Add new capabilities without splitting your guest experience apart." },
    ],
  },
];

export const featuredMarketingFeatureSlugs = [
  "restaurant-website",
  "qr-menu",
  "online-orders",
  "analytics",
] as const;

export function getMarketingFeature(slug: string) {
  return marketingFeatures.find((feature) => feature.slug === slug);
}
