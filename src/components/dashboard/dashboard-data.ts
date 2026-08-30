import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  Globe2,
  LayoutDashboard,
  MenuSquare,
  Palette,
  QrCode,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const dashboardNavigation: Array<{
  label: string;
  items: DashboardNavItem[];
}> = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Restaurant", href: "/dashboard/restaurant", icon: Store },
      { label: "Menu", href: "/dashboard/menu", icon: MenuSquare },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: "6" },
    ],
  },
  {
    label: "Grow",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "QR Codes", href: "/dashboard/qr", icon: QrCode },
      { label: "Themes", href: "/dashboard/themes", icon: Palette },
      { label: "SEO", href: "/dashboard/seo", icon: Search },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Domains", href: "/dashboard/domains", icon: Globe2 },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Branches", href: "/dashboard/branches", icon: Building2 },
      { label: "Team", href: "/dashboard/team", icon: Users },
      { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export const studioSectionSlugs = [
  "restaurant",
  "orders",
  "analytics",
  "qr",
  "domains",
  "branches",
  "team",
  "subscription",
  "settings",
] as const;

export type StudioSectionSlug = (typeof studioSectionSlugs)[number];

export function isStudioSectionSlug(value: string): value is StudioSectionSlug {
  return studioSectionSlugs.includes(value as StudioSectionSlug);
}

export const overviewStats = [
  {
    label: "Website views",
    value: "8,492",
    change: "+18.2%",
    comparison: "vs. previous 30 days",
    series: [26, 34, 29, 48, 42, 61, 70, 65, 82, 78, 96, 88],
  },
  {
    label: "Menu views",
    value: "6,148",
    change: "+12.7%",
    comparison: "vs. previous 30 days",
    series: [20, 27, 36, 30, 44, 53, 49, 62, 59, 75, 73, 84],
  },
  {
    label: "QR scans",
    value: "3,804",
    change: "+24.1%",
    comparison: "vs. previous 30 days",
    series: [16, 24, 21, 39, 44, 38, 57, 63, 55, 72, 81, 90],
  },
  {
    label: "Orders",
    value: "284",
    change: "+8.4%",
    comparison: "vs. previous 30 days",
    series: [26, 31, 25, 39, 45, 41, 53, 48, 61, 58, 68, 74],
  },
];

export const overviewTraffic = [
  34, 48, 39, 62, 55, 75, 69, 91, 72, 88, 81, 103, 96, 119,
];

export const popularProducts = [
  { name: "Market Burrata", category: "Small plates", orders: 86, revenue: "421,400 ֏", image: "/images/burrata.png" },
  { name: "Lamb Manti", category: "Mains", orders: 64, revenue: "358,400 ֏", image: "/images/manti.png" },
  { name: "Charcoal Trout", category: "Mains", orders: 51, revenue: "367,200 ֏", image: "/images/trout.png" },
  { name: "Apricot Pavlova", category: "Desserts", orders: 43, revenue: "137,600 ֏", image: "/images/pavlova.png" },
];

export const dashboardActivity = [
  { title: "New order #1048", description: "Table 8 · 18,400 ֏", time: "2 min", tone: "brand" },
  { title: "Menu published", description: "English and Armenian", time: "24 min", tone: "green" },
  { title: "Market Burrata updated", description: "Price changed to 4,900 ֏", time: "1 hr", tone: "amber" },
  { title: "QR code scanned", description: "Main dining room", time: "2 hrs", tone: "blue" },
];

export type EditorProduct = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  translations: { hy: string; ru: string };
};

export type EditorCategory = {
  id: string;
  name: string;
  description: string;
};

export const editorCategories: EditorCategory[] = [
  { id: "breakfast", name: "Breakfast", description: "Served daily until 13:00" },
  { id: "small-plates", name: "Small plates", description: "Made for the table" },
  { id: "mains", name: "Mains", description: "From our charcoal kitchen" },
  { id: "desserts", name: "Desserts", description: "A sweet finish" },
  { id: "drinks", name: "Drinks", description: "Coffee, wine and seasonal pours" },
];

export const editorProducts: EditorProduct[] = [
  {
    id: "p1",
    name: "Market Burrata",
    categoryId: "small-plates",
    description: "Heirloom tomatoes, basil oil, toasted lavash and pomegranate.",
    price: 4900,
    image: "/images/burrata.png",
    available: true,
    featured: true,
    translations: { hy: "Բուրատա լոլիկով", ru: "Буррата с томатами" },
  },
  {
    id: "p2",
    name: "Roasted Cauliflower",
    categoryId: "small-plates",
    description: "Tahini, preserved lemon, herbs and toasted sesame.",
    price: 3900,
    image: "/images/trout.png",
    available: true,
    featured: false,
    translations: { hy: "Տապակած ծաղկակաղամբ", ru: "Запечённая цветная капуста" },
  },
  {
    id: "p3",
    name: "Lamb Manti",
    categoryId: "mains",
    description: "Crisp dumplings, garlic yogurt, paprika butter and herbs.",
    price: 5600,
    image: "/images/manti.png",
    available: true,
    featured: true,
    translations: { hy: "Գառան մանթի", ru: "Манты с ягнёнком" },
  },
  {
    id: "p4",
    name: "Charcoal Trout",
    categoryId: "mains",
    description: "Wilted greens, capers, lemon beurre blanc and dill.",
    price: 7200,
    image: "/images/trout.png",
    available: false,
    featured: true,
    translations: { hy: "Իշխան կրակի վրա", ru: "Форель на углях" },
  },
  {
    id: "p5",
    name: "Apricot Pavlova",
    categoryId: "desserts",
    description: "Roasted apricot, mountain honey, pistachio and soft cream.",
    price: 3200,
    image: "/images/pavlova.png",
    available: true,
    featured: false,
    translations: { hy: "Ծիրանի պավլովա", ru: "Павлова с абрикосом" },
  },
];

export const dashboardThemes = [
  { id: "editorial", name: "Editorial", description: "Warm, story-led and refined", color: "#D95532", font: "Fraunces", style: "Spacious cards", image: "/images/avena-interior.png" },
  { id: "nocturne", name: "Nocturne", description: "Dark, intimate and cinematic", color: "#B79557", font: "DM Sans", style: "Full-bleed list", image: "/images/manti.png" },
  { id: "garden", name: "Garden", description: "Fresh, organic and generous", color: "#66715C", font: "Fraunces", style: "Photo grid", image: "/images/trout.png" },
  { id: "atelier", name: "Atelier", description: "Minimal, precise and modern", color: "#252525", font: "DM Sans", style: "Compact list", image: "/images/burrata.png" },
];

export const activityIcon = Activity;
