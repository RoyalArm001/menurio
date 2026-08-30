export type RestaurantThemeId = "modern" | "elegant" | "minimal" | "dark-premium";
export type ThemeTier = "basic" | "professional" | "advanced";

export type ButtonStyle = "rounded" | "pill" | "square";
export type CardStyle = "elevated" | "flat" | "outlined" | "compact";
export type NavigationStyle = "sticky" | "solid" | "transparent" | "minimal";
export type MenuLayout = "cards" | "list" | "grid" | "editorial";
export type ImageStyle = "cover" | "rounded" | "contain" | "square";
export type FooterStyle = "simple" | "branded" | "minimal";
export type FontToken = "display" | "sans" | "serif";

export type RestaurantTheme = {
  id: RestaurantThemeId;
  name: string;
  description: string;
  preview: string;
  tier: ThemeTier;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: FontToken;
    body: FontToken;
  };
  buttonStyle: ButtonStyle;
  cardStyle: CardStyle;
  navigationStyle: NavigationStyle;
  menuLayout: MenuLayout;
  imageStyle: ImageStyle;
  footerStyle: FooterStyle;
};

export const restaurantThemes: RestaurantTheme[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Warm terracotta accents, generous spacing, photo-forward cards.",
    preview: "from-[#fbf8f2] to-[#f3eee5]",
    tier: "basic",
    colors: {
      primary: "#D95532",
      secondary: "#8D3D32",
      accent: "#66715C",
      background: "#FBF8F2",
      surface: "#FFFFFF",
      text: "#1D1B18",
      muted: "#706C65",
    },
    fonts: { heading: "display", body: "sans" },
    buttonStyle: "pill",
    cardStyle: "elevated",
    navigationStyle: "sticky",
    menuLayout: "cards",
    imageStyle: "cover",
    footerStyle: "simple",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined serif typography, gold accents, classic fine-dining feel.",
    preview: "from-[#faf7f2] to-[#ede5d8]",
    tier: "professional",
    colors: {
      primary: "#9A7B4F",
      secondary: "#2A241C",
      accent: "#C4A574",
      background: "#FAF7F2",
      surface: "#FFFCF8",
      text: "#2A241C",
      muted: "#7A7064",
    },
    fonts: { heading: "display", body: "serif" },
    buttonStyle: "rounded",
    cardStyle: "outlined",
    navigationStyle: "solid",
    menuLayout: "editorial",
    imageStyle: "rounded",
    footerStyle: "branded",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean lines, monochrome palette, typography-led menu lists.",
    preview: "from-white to-[#f5f5f5]",
    tier: "professional",
    colors: {
      primary: "#111111",
      secondary: "#444444",
      accent: "#444444",
      background: "#FFFFFF",
      surface: "#FAFAFA",
      text: "#111111",
      muted: "#666666",
    },
    fonts: { heading: "sans", body: "sans" },
    buttonStyle: "square",
    cardStyle: "flat",
    navigationStyle: "minimal",
    menuLayout: "list",
    imageStyle: "square",
    footerStyle: "minimal",
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Cinematic dark mode with luminous accents for bars and lounges.",
    preview: "from-[#141210] to-[#1f1b18]",
    tier: "advanced",
    colors: {
      primary: "#E8C07A",
      secondary: "#D95532",
      accent: "#D95532",
      background: "#141210",
      surface: "#1F1B18",
      text: "#F5F0E8",
      muted: "#A69E92",
    },
    fonts: { heading: "display", body: "sans" },
    buttonStyle: "pill",
    cardStyle: "elevated",
    navigationStyle: "transparent",
    menuLayout: "grid",
    imageStyle: "cover",
    footerStyle: "branded",
  },
];

export function getTheme(id: string | null | undefined): RestaurantTheme {
  return restaurantThemes.find((t) => t.id === id) ?? restaurantThemes[0]!;
}

export function isRestaurantThemeId(id: string): id is RestaurantThemeId {
  return restaurantThemes.some((t) => t.id === id);
}
