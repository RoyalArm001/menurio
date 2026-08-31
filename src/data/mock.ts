export type ProductTag = "New" | "Popular" | "Spicy" | "Vegan";

export type MenuProduct = {
  id: string;
  slug: string;
  name: string;
  armenianName: string;
  russianName?: string;
  description: string;
  armenianDescription?: string;
  russianDescription?: string;
  ingredients: string[];
  armenianIngredients?: string[];
  russianIngredients?: string[];
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  tags: ProductTag[];
  allergens: string[];
  calories: number;
  available: boolean;
  featured: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  armenianName?: string;
  russianName?: string;
  count: number;
};

export const demoRestaurant = {
  slug: "demo-restaurant",
  name: "Avena",
  tagline: "Հայկական հոգի, միջերկրածովյան ռիթմ",
  description:
    "Avena-ն Երևանի սրտում գտնվող ռեստորան է՝ սեզոնային ուտեստներով, հայկական հյուրընկալությամբ և մենյուով, որը գեղեցիկ է աշխատում ցանկացած էկրանին։",
  status: "Open" as const,
  logo: "/images/avena-logo.svg",
  cover: "/images/avena-interior.png",
  address: "Աբովյան 12, Երևան 0001",
  phone: "+374 10 58 18 18",
  email: "hello@avena.am",
  instagram: "@avena.yerevan",
  facebook: "Avena Yerevan",
  hours: [
    { days: "Երկուշաբթի – Հինգշաբթի", time: "09:00 – 23:00" },
    { days: "Ուրբաթ – Շաբաթ", time: "09:00 – 00:00" },
    { days: "Կիրակի", time: "10:00 – 23:00" },
  ],
  services: {
    dineIn: true,
    pickup: true,
    delivery: true,
    tableOrdering: true,
  },
  gallery: [
    { id: "g1", title: "Հյուրընկալ սրահ", image: "/images/avena-interior.png" },
    { id: "g2", title: "Սեզոնային ափսեներ", image: "/images/burrata.png" },
    { id: "g3", title: "Կրակից՝ սեղանին", image: "/images/trout.png" },
    { id: "g4", title: "Քաղցր ավարտ", image: "/images/pavlova.png" },
  ],
  about:
    "Avena-ն հիմնադրվել է 2019-ին և ներկայացնում է հայկական մթերքը միջերկրածովյան մոտեցմամբ։ Թիմը աշխատում է տեղական ֆերմաների հետ, լավաշը թխում է տեղում և ստեղծում մենյու, որը նույնքան գեղեցիկ է սրահում, որքան հեռախոսի էկրանին։",
  themeId: "modern",
  languages: [
    { code: "hy", label: "Armenian", flag: "🇦🇲" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Russian", flag: "🇷🇺" },
  ],
};

export const categories: MenuCategory[] = [
  { id: "breakfast", name: "Breakfast", armenianName: "Նախաճաշ", russianName: "Завтрак", count: 2 },
  { id: "small-plates", name: "Small Plates", armenianName: "Փոքր ափսեներ", russianName: "Закуски", count: 2 },
  { id: "mains", name: "Mains", armenianName: "Հիմնական ուտեստներ", russianName: "Основные блюда", count: 2 },
  { id: "desserts", name: "Desserts", armenianName: "Աղանդեր", russianName: "Десерты", count: 2 },
  { id: "drinks", name: "Drinks", armenianName: "Ըմպելիքներ", russianName: "Напитки", count: 1 },
];

export const products: MenuProduct[] = [
  {
    id: "p1",
    slug: "market-burrata",
    name: "Market Burrata",
    armenianName: "Բուրատա լոլիկով",
    russianName: "Бurrata с томатами",
    description:
      "Heirloom tomatoes, basil oil, toasted lavash chips and pomegranate molasses.",
    armenianDescription:
      "Սեզոնային լոլիկ, ռեհանի յուղ, տապակած լավաշի չիպսեր և նռան դոշաբ։",
    ingredients: ["Burrata", "Heirloom tomatoes", "Basil oil", "Lavash", "Pomegranate"],
    armenianIngredients: ["Բուրատա", "սեզոնային լոլիկ", "ռեհանի յուղ", "լավաշ", "նուռ"],
    price: 4900,
    category: "small-plates",
    image: "/images/burrata.png",
    tags: ["Popular"],
    allergens: ["Milk", "Gluten"],
    calories: 420,
    available: true,
    featured: true,
  },
  {
    id: "p2",
    slug: "lamb-manti",
    name: "Lamb Manti",
    armenianName: "Գառան մանթի",
    russianName: "Манты с бараниной",
    description:
      "Crisp dumplings, garlic yogurt, paprika butter and fresh herbs.",
    armenianDescription:
      "Խրթխրթան մանթի, սխտորով մածուն, պապրիկայով կարագ և թարմ կանաչի։",
    ingredients: ["Lamb", "Yogurt", "Paprika butter", "Herbs", "Dough"],
    armenianIngredients: ["Գառան միս", "մածուն", "պապրիկայով կարագ", "կանաչի", "խմոր"],
    price: 5600,
    compareAtPrice: 6200,
    category: "mains",
    image: "/images/manti.png",
    tags: ["Popular", "Spicy"],
    allergens: ["Gluten", "Milk"],
    calories: 680,
    available: true,
    featured: true,
  },
  {
    id: "p3",
    slug: "charcoal-trout",
    name: "Charcoal Trout",
    armenianName: "Իշխան կրակի վրա",
    russianName: "Форель на углях",
    description: "Wilted greens, capers, lemon beurre blanc and dill.",
    armenianDescription:
      "Թեթև շոգեխաշած կանաչի, կապերս, կիտրոնային սոուս և սամիթ։",
    ingredients: ["Trout", "Capers", "Butter", "Dill", "Seasonal greens"],
    armenianIngredients: ["Իշխան", "կապերս", "կարագ", "սամիթ", "սեզոնային կանաչի"],
    price: 7200,
    category: "mains",
    image: "/images/trout.png",
    tags: ["New"],
    allergens: ["Fish", "Milk"],
    calories: 540,
    available: true,
    featured: true,
  },
  {
    id: "p4",
    slug: "apricot-pavlova",
    name: "Apricot Pavlova",
    armenianName: "Ծիրանի պավլովա",
    description:
      "Roasted apricot, whipped cream, mountain honey and pistachio.",
    armenianDescription:
      "Տապակած ծիրան, հարած սերուցք, լեռնային մեղր և պիստակ։",
    ingredients: ["Apricot", "Meringue", "Cream", "Honey", "Pistachio"],
    armenianIngredients: ["Ծիրան", "բեզե", "սերուցք", "մեղր", "պիստակ"],
    price: 3200,
    category: "desserts",
    image: "/images/pavlova.png",
    tags: ["New", "Popular"],
    allergens: ["Egg", "Milk", "Nuts"],
    calories: 390,
    available: true,
    featured: true,
  },
  {
    id: "p5",
    slug: "herb-omelette",
    name: "Garden Herb Omelette",
    armenianName: "Կանաչով ձվածեղ",
    description: "Farm eggs, chanakh cheese, seasonal herbs and sourdough.",
    armenianDescription:
      "Ֆերմերային ձու, չանախ պանիր, սեզոնային կանաչի և թթխմորով հաց։",
    ingredients: ["Eggs", "Chanakh cheese", "Herbs", "Sourdough"],
    armenianIngredients: ["Ձու", "չանախ պանիր", "կանաչի", "թթխմորով հաց"],
    price: 3600,
    category: "breakfast",
    image: "/images/dish-omelette.svg",
    tags: ["New"],
    allergens: ["Egg", "Milk", "Gluten"],
    calories: 510,
    available: true,
    featured: false,
  },
  {
    id: "p6",
    slug: "wild-mushroom-toast",
    name: "Wild Mushroom Toast",
    armenianName: "Սնկով տոստ",
    description: "Forest mushrooms, tarragon, labneh and grilled sourdough.",
    armenianDescription:
      "Անտառային սունկ, թարխուն, լաբնե և խորոված թթխմորով հաց։",
    ingredients: ["Mushrooms", "Labneh", "Tarragon", "Sourdough"],
    armenianIngredients: ["Սունկ", "լաբնե", "թարխուն", "թթխմորով հաց"],
    price: 4100,
    category: "breakfast",
    image: "/images/dish-mushroom.svg",
    tags: [],
    allergens: ["Gluten", "Milk"],
    calories: 460,
    available: false,
    featured: false,
  },
  {
    id: "p7",
    slug: "roasted-cauliflower",
    name: "Roasted Cauliflower",
    armenianName: "Տապակած ծաղկակաղամբ",
    description: "Tahini, preserved lemon, herbs and toasted sesame.",
    armenianDescription:
      "Թահին, պահածոյացված կիտրոն, կանաչի և տապակած քունջութ։",
    ingredients: ["Cauliflower", "Tahini", "Preserved lemon", "Sesame"],
    armenianIngredients: ["Ծաղկակաղամբ", "թահին", "կիտրոն", "քունջութ"],
    price: 3900,
    category: "small-plates",
    image: "/images/dish-cauliflower.svg",
    tags: ["Vegan", "Popular"],
    allergens: ["Sesame"],
    calories: 340,
    available: true,
    featured: false,
  },
  {
    id: "p8",
    slug: "burnt-honey-cheesecake",
    name: "Burnt Honey Cheesecake",
    armenianName: "Մեղրով չիզքեյք",
    description: "Caramelized honey, sea salt and crème fraîche.",
    armenianDescription:
      "Կարամելացված մեղր, ծովի աղ և նուրբ կրեմ-ֆրեշ։",
    ingredients: ["Cream cheese", "Honey", "Pastry", "Crème fraîche"],
    armenianIngredients: ["Կրեմ պանիր", "մեղր", "խմոր", "կրեմ-ֆրեշ"],
    price: 2900,
    category: "desserts",
    image: "/images/dish-cheesecake.svg",
    tags: [],
    allergens: ["Milk", "Egg", "Gluten"],
    calories: 440,
    available: false,
    featured: false,
  },
  {
    id: "p9",
    slug: "armenian-coffee",
    name: "Armenian Coffee",
    armenianName: "Հայկական սուրճ",
    description: "Traditional copper pot service with cardamom and lokum.",
    armenianDescription:
      "Ավանդական հայկական սուրճ՝ պղնձե ջազվեով, հիլով և լոխումով։",
    ingredients: ["Coffee", "Cardamom"],
    armenianIngredients: ["Սուրճ", "հիլ"],
    price: 1200,
    category: "drinks",
    image: "/images/dish-coffee.svg",
    tags: ["Popular"],
    allergens: [],
    calories: 15,
    available: true,
    featured: false,
  },
];

export type PlanFeature = {
  label: string;
  badge?: "Coming Soon" | "Requires Integration" | "Pro+";
};

export type PricingPlan = {
  id: "FREE" | "START" | "PRO" | "PRO_PLUS";
  name: string;
  price: string;
  suffix: string;
  description: string;
  featured?: boolean;
  features: PlanFeature[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "FREE",
    name: "FREE",
    price: "0",
    suffix: "AMD · 12 months free",
    description: "Launch your restaurant online with everything essential.",
    features: [
      { label: "Restaurant public page" },
      { label: "QR menu" },
      { label: "1 theme" },
      { label: "Basic QR" },
      { label: "Restaurant info" },
      { label: "Basic visitor counter" },
      { label: "Basic SEO" },
      { label: "Menurio link on page" },
    ],
  },
  {
    id: "START",
    name: "START",
    price: "2,500",
    suffix: "AMD / month",
    description: "Professional presentation for growing independent venues.",
    features: [
      { label: "Everything in FREE" },
      { label: "Professional themes" },
      { label: "Unlimited menu items" },
      { label: "Photos" },
      { label: "3 languages" },
      { label: "Custom QR design" },
      { label: "Basic analytics" },
      { label: "Promotions" },
      { label: "Menu search" },
      { label: "Sold Out status" },
      { label: "Better branding" },
    ],
  },
  {
    id: "PRO",
    name: "PRO",
    price: "4,900",
    suffix: "AMD / month",
    description: "Ordering, AI tools, and advanced growth features.",
    featured: true,
    features: [
      { label: "Everything in START" },
      { label: "Up to 5 languages" },
      { label: "AI Import", badge: "Coming Soon" },
      { label: "Photo → Menu", badge: "Coming Soon" },
      { label: "PDF → Menu", badge: "Coming Soon" },
      { label: "Excel → Menu", badge: "Coming Soon" },
      { label: "AI Translation", badge: "Coming Soon" },
      { label: "AI Description", badge: "Coming Soon" },
      { label: "Cart & orders" },
      { label: "Advanced analytics" },
      { label: "Advanced SEO tools" },
    ],
  },
  {
    id: "PRO_PLUS",
    name: "PRO+",
    price: "9,900",
    suffix: "AMD / month",
    description: "Multi-branch teams, custom domains, and premium service.",
    features: [
      { label: "Everything in PRO" },
      { label: "Up to 8 languages" },
      { label: "Custom domain", badge: "Pro+" },
      { label: "Multi branch", badge: "Pro+" },
      { label: "Multiple staff users", badge: "Pro+" },
      { label: "Roles & permissions", badge: "Pro+" },
      { label: "Advanced analytics", badge: "Pro+" },
      { label: "Advanced SEO", badge: "Pro+" },
      { label: "Table QR", badge: "Pro+" },
      { label: "Waiter call", badge: "Coming Soon" },
      { label: "Request bill", badge: "Coming Soon" },
      { label: "Security features", badge: "Pro+" },
      { label: "Priority support", badge: "Pro+" },
    ],
  },
];

export const dashboardStats = [
  {
    label: "Page Views",
    value: "8,492",
    change: "+18.2%",
    series: [22, 30, 27, 42, 39, 58, 64],
  },
  {
    label: "Menu Views",
    value: "6,148",
    change: "+12.7%",
    series: [18, 23, 31, 28, 47, 49, 57],
  },
  {
    label: "QR Scans",
    value: "3,804",
    change: "+24.1%",
    series: [15, 22, 18, 36, 41, 52, 61],
  },
  {
    label: "Orders",
    value: "284",
    change: "+8.4%",
    series: [25, 29, 24, 34, 40, 39, 48],
  },
];

export const popularProducts = [
  { name: "Lamb Manti", orders: 86, revenue: "481,600 ֏" },
  { name: "Market Burrata", orders: 72, revenue: "352,800 ֏" },
  { name: "Charcoal Trout", orders: 54, revenue: "388,800 ֏" },
];

export const recentActivity = [
  {
    title: "New order #1048",
    meta: "Table 8 · 18,400 ֏",
    time: "2 min ago",
    tone: "brand" as const,
  },
  {
    title: "Menu published",
    meta: "English & Armenian",
    time: "24 min ago",
    tone: "green" as const,
  },
  {
    title: "Market Burrata updated",
    meta: "Price changed to 4,900 ֏",
    time: "1 hr ago",
    tone: "amber" as const,
  },
  {
    title: "QR code scanned",
    meta: "Main dining room",
    time: "2 hrs ago",
    tone: "blue" as const,
  },
];

export const mockOrders = [
  {
    id: "1048",
    table: "Table 8",
    items: 3,
    total: 18400,
    status: "NEW" as const,
    time: "2 min ago",
  },
  {
    id: "1047",
    table: "Pickup",
    items: 2,
    total: 8500,
    status: "PREPARING" as const,
    time: "8 min ago",
  },
  {
    id: "1046",
    table: "Table 3",
    items: 5,
    total: 31200,
    status: "READY" as const,
    time: "14 min ago",
  },
  {
    id: "1045",
    table: "Delivery",
    items: 4,
    total: 24600,
    status: "COMPLETED" as const,
    time: "32 min ago",
  },
];

export const mockTeam = [
  { name: "Ani Karapetyan", role: "Owner", email: "ani@avena.am" },
  { name: "David Sargsyan", role: "Manager", email: "david@avena.am" },
  { name: "Lilit Hakobyan", role: "Editor", email: "lilit@avena.am" },
];

export const mockQrCodes = [
  { id: "qr1", label: "Main dining room", scans: 1842, type: "Restaurant" },
  { id: "qr2", label: "Terrace tables", scans: 964, type: "Table" },
  { id: "qr3", label: "Takeaway counter", scans: 612, type: "Menu" },
];

export const faqs = [
  [
    "Is Menurio only a QR menu?",
    "No. Menurio gives your restaurant a complete branded website, digital menu, ordering experience, analytics, SEO tools, custom domains, and future POS integrations — far beyond a simple QR menu.",
  ],
  [
    "What happens after the free 12 months?",
    "You can stay within free plan limits or upgrade to START, PRO, or PRO+. We always show pricing before anything changes.",
  ],
  [
    "Can I use my own domain?",
    "Yes. Custom domains are available on PRO+ with guided DNS setup inside your dashboard.",
  ],
  [
    "Can guests view the menu in multiple languages?",
    "Yes. Manage translations per dish and let guests switch languages instantly without leaving the menu.",
  ],
  [
    "Do I need technical experience?",
    "Not at all. Our onboarding wizard guides you from restaurant details to a published website and QR code in minutes.",
  ],
  [
    "When will AI menu import be available?",
    "Photo, PDF, and Excel import are on the PRO roadmap. The UI is ready — backend integration is coming soon.",
  ],
];

export const homepageFeatures = [
  {
    title: "Restaurant Website",
    description:
      "A beautiful standalone website — not a generic menu link. Logo, cover, hours, gallery, and contact in one place.",
    icon: "Globe",
  },
  {
    title: "QR Menu",
    description:
      "Permanent QR codes that survive domain changes. Table, menu, and restaurant QR for every service style.",
    icon: "QrCode",
  },
  {
    title: "Multilingual Menu",
    description:
      "Up to 8 languages with per-dish translations. Guests switch language without reloading.",
    icon: "Languages",
  },
  {
    title: "Custom Domain",
    description:
      "menu.restaurant.am or restaurant.am — your brand, your URL. PRO+ includes guided setup.",
    icon: "Link",
    badge: "Pro+",
  },
  {
    title: "Online Orders",
    description:
      "Cart, table ordering, pickup and delivery requests. Built for the way modern restaurants operate.",
    icon: "ShoppingBag",
  },
  {
    title: "Analytics",
    description:
      "Page views, menu views, QR scans, and popular dishes — privacy-conscious insights that matter.",
    icon: "BarChart3",
  },
  {
    title: "SEO",
    description:
      "Server-rendered pages, structured data, hreflang, and sitemaps so guests find you on Google.",
    icon: "Search",
  },
  {
    title: "Integrations",
    description:
      "Architecture ready for iiko, POS systems, kitchen printers, and the Menurio Restaurant Bridge.",
    icon: "Plug",
    badge: "Requires Integration",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Create your restaurant",
    description: "Add name, logo, branding, and opening hours in a guided onboarding flow.",
  },
  {
    step: "02",
    title: "Build your menu",
    description: "Add categories, photos, prices, allergens, and translations — or import later with AI.",
  },
  {
    step: "03",
    title: "Publish & share",
    description: "Go live with your website, QR codes, and optional custom domain. Start taking orders.",
  },
];

// Legacy exports for compatibility
export const restaurant = demoRestaurant;
