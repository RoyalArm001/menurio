import type { PublicLanguage } from "@/lib/i18n/public-languages";

export type MarketingUi = {
  banner: string;
  nav: { product: string; howItWorks: string; pricing: string; faq: string };
  signIn: string;
  createRestaurant: string;
  viewDemo: string;
  startFree: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroDemo: string;
  heroBullets: [string, string, string];
  promiseStats: Array<[string, string]>;
  howItWorks: { eyebrow: string; title: string; description: string };
  platformJourney: { eyebrow: string; title: string; description: string };
  platformSteps: Array<{ title: string; description: string; features: string[] }>;
  finalCta: { eyebrow: string; title: string; subtitle: string; primary: string; secondary: string };
  product: {
    eyebrow: string;
    title: string;
    description: string;
    browseAll: string;
    exploreFeature: string;
    items: Array<{ slug: string; eyebrow: string; name: string; description: string }>;
  };
  faq: {
    eyebrow: string;
    title: string;
    contactPrefix: string;
    items: Array<[string, string]>;
  };
  footerTagline: string;
  footerCta: string;
  footerGroups: { explore: string; account: string };
  footerDashboard: string;
};

const MARKETING: Record<PublicLanguage, MarketingUi> = {
  hy: {
    banner: "12 ամիս անվճար · Քարտի կարիք չկա",
    nav: {
      product: "Ապրանք",
      howItWorks: "Ինչպես է աշխատում",
      pricing: "Գնացուցակ",
      faq: "ՀՏՀ",
    },
    signIn: "Մուտք",
    createRestaurant: "Ստեղծել ռեստորան",
    viewDemo: "Դիտել դեմո",
    startFree: "Սկսել անվճար",
    heroBadge: "12 ամիս անվճար · Քարտի կարիք չկա",
    heroTitle: "Ձեր ռեստորանի թվային տունը մեկ տեղում",
    heroSubtitle:
      "Կայք, բազմալեզու մենյու, մշտական QR և պատվերներ՝ ձեր բրենդով, առանց բարդ տեխնիկայի.",
    heroCta: "Ստեղծել ռեստորան — անվճար",
    heroDemo: "Դիտել դեմո",
    heroBullets: [
      "Պատրաստ րոպեներում",
      "Տեխնիկական գիտելիքներ պետք չեն",
      "Չեղարկեք ցանկացած ժամանակ",
    ],
    promiseStats: [
      ["Մեկ տեղ", "Կայք, մենյու և պատվերներ"],
      ["Միշտ բաց", "Ձեր թվային դուռը"],
      ["Միայն ձերը", "Բրենդ, գույներ, domain"],
      ["Տեղական", "Հյուրերի լեզուներով"],
    ],
    howItWorks: {
      eyebrow: "Ինչ ենք առաջարկում",
      title: "Բոլոր գործիքները մեկ հարթակում",
      description:
        "Կայք, QR մենյու, պատվերներ, SEO, domain և անալիտիկա — ամեն ինչ, ինչ ձեր ռեստորանին է պետք.",
    },
    platformJourney: {
      eyebrow: "Ինչպես է աշխատում",
      title: "Հինգ քայլ — ամբողջ հարթակ",
      description:
        "Յուրաքանչյուր քայլ բացում է Menurio-ի նոր գործիքներ. Հարթակը ավտոմատ ցույց է տալիս բոլոր առաջարկները.",
    },
    platformSteps: [
      {
        title: "Ստեղծեք թվային տուն",
        description:
          "Կայք, պատմություն, gallery, ժամեր և կոնտակտ — հյուրերը գտնում են ձեզ առցանց.",
        features: ["Ռեստորանի կայք"],
      },
      {
        title: "Կառուցեք մենյու",
        description:
          "QR մենյու, լուսանկարներ, բաժիններ և մինչև 8 լեզվով թարգմանություններ.",
        features: ["QR մենյու", "Բազմալեզու մենյու"],
      },
      {
        title: "Դարձրեք ձեր բրենդը",
        description: "Թեմաներ, գույներ, լոգո և ձեր domain-ը — ամբողջությամբ ձեր տեսքը.",
        features: ["Անհատական թեմաներ", "Custom domain"],
      },
      {
        title: "Ընդունեք պատվերներ",
        description:
          "Սեղան, վերցնելու և առաքում — հյուրերը պատվիրում են ուղղակի մենյուից.",
        features: ["Առցանց պատվերներ"],
      },
      {
        title: "Աճացրեք և գտնվելիություն",
        description: "SEO, անալիտիկա և POS ինտեգրացիաներ — աճեք առանց հարթակը փոխելու.",
        features: ["SEO", "Անալիտիկա", "Ինտեգրացիաներ"],
      },
    ],
    finalCta: {
      eyebrow: "12 ամիս անվճար",
      title: "Ձեր հաջորդ հյուրը արդեն փնտրում է ձեզ",
      subtitle: "Տվեք նրանց կայք, մենյու և պատվերի փորձ, որը արժե գտնել.",
      primary: "Ստեղծել ռեստորան — անվճար",
      secondary: "Դիտել դեմո",
    },
    product: {
      eyebrow: "Հարթակ",
      title: "Menurio-ի ամբողջական toolkit-ը",
      description:
        "Յուրաքանչյուր գործիք՝ ձեր ռեստորանի թվային ներկայության, մենյուի և պատվերների համար.",
      browseAll: "Բոլոր հնարավորությունները",
      exploreFeature: "Դիտել մանրամասն",
      items: [
        {
          slug: "restaurant-website",
          eyebrow: "Կայք",
          name: "Ռեստորանի կայք",
          description:
            "Պատմեք ձեր պատմությունը, ցույց տվեք մթնոլորտը և տվեք հյուրերին ամեն ինչ այցելությունից առաջ.",
        },
        {
          slug: "qr-menu",
          eyebrow: "QR մենյու",
          name: "QR մենյու",
          description:
            "Արագ, տեսողական մոբայլ մենյու՝ հստակ ընտրություններով և մշտական QR հղումով.",
        },
        {
          slug: "online-orders",
          eyebrow: "Պատվերներ",
          name: "Առցանց պատվերներ",
          description:
            "Հյուրերը պատվիրում են սեղանից, վերցնելու կամ առաքման համար՝ առանց ավելորդ քայլերի.",
        },
        {
          slug: "themes",
          eyebrow: "Թեմաներ",
          name: "Անհատական թեմաներ",
          description:
            "Գույներ, լոգո և տառատեսակներ՝ ձեր բրենդին համապատասխան պրոֆեսիոնալ թեմաներ.",
        },
        {
          slug: "multilingual-menu",
          eyebrow: "Բազմալեզու",
          name: "Բազմալեզու մենյու",
          description:
            "Մեկ մենյու՝ մինչև 8 լեզվով. Հյուրերը լեզուն փոխում են անմիջապես.",
        },
        {
          slug: "custom-domain",
          eyebrow: "Domain",
          name: "Անհատական domain",
          description:
            "menu.restaurant.am կամ restaurant.am — ձեր բրենդը, ձեր հղումը, PRO+ պլանով.",
        },
        {
          slug: "seo",
          eyebrow: "SEO",
          name: "SEO",
          description:
            "Sitemap, structured data, hreflang և meta tags — որոնիչներում գտնվելու համար.",
        },
        {
          slug: "analytics",
          eyebrow: "Անալիտիկա",
          name: "Անալիտիկա",
          description:
            "Դիտեք մենյուի դիտումները, QR սկաները և հանրաճանաչ ապրանքները մեկ վահանակում.",
        },
        {
          slug: "integrations",
          eyebrow: "Ինտեգրացիաներ",
          name: "Ինտեգրացիաներ",
          description:
            "POS, iiko և kitchen printer-ների հետ ապագա կապեր՝ առանց հարթակը փոխելու.",
        },
      ],
    },
    faq: {
      eyebrow: "ՀՏՀ",
      title: "Հարցեր, պարզ պատասխաններ",
      contactPrefix: "Հարցեր ունե՞ք. Գրեք",
      items: [
        [
          "Menurio-ը միայն QR մենյու՞ է",
          "Ոչ. Menurio-ը տալիս է ամբողջական բրենդային կայք, թվային մենյու, պատվերներ, անալիտիկա, SEO և domain.",
        ],
        [
          "Ի՞նչ է լինում 12 անվճար ամիսից հետո",
          "Կարող եք մնալ անվճար սահմաններում կամ անցնել START, PRO կամ PRO+ պլանների: Գինը միշտ ցուցադրվում է նախապես.",
        ],
        [
          "Կարո՞ղ եմ օգտագործել իմ domain-ը",
          "Այո. PRO+ պլանով custom domain-ը կարգավորում եք dashboard-ից.",
        ],
        [
          "Հյուրերը կարո՞ղ են տեսնել մենյուն մի քանի լեզվով",
          "Այո. Ավելացրեք թարգմանություններ յուրաքանչյուր ճաշատեսակի համար, հյուրերը լեզուն կփոխեն անմիջապես.",
        ],
        [
          "Տեխնիկական գիտելիքներ պետք են՞",
          "Ոչ. Onboarding-ը քայլ առ քայլ տանում է մինչև հրապարակված կայք և QR.",
        ],
        [
          "Ե՞րբ կլինի AI մենյուի ներմուծում",
          "Նկար, PDF և Excel ներմուծումը PRO roadmap-ում է. UI-ն արդեն պատրաստ է.",
        ],
      ],
    },
    footerTagline: "Թվային տուն, որը արժանի է ձեր ռեստորանին.",
    footerCta: "Ստեղծել ռեստորան — անվճար",
    footerGroups: { explore: "Բացահայտել", account: "Հաշիվ" },
    footerDashboard: "Գրասենյակ",
  },
  en: {
    banner: "12 months free · No card required",
    nav: {
      product: "Product",
      howItWorks: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
    },
    signIn: "Sign in",
    createRestaurant: "Create your restaurant",
    viewDemo: "View demo",
    startFree: "Start free",
    heroBadge: "12 months free · No card required",
    heroTitle: "The complete digital home for your restaurant.",
    heroSubtitle:
      "Launch a fast website, multilingual menu, permanent QR and orders from one place — all in your restaurant's brand.",
    heroCta: "Create Your Restaurant — Free",
    heroDemo: "View Demo",
    heroBullets: ["Live in minutes", "No technical skills", "Cancel anytime"],
    promiseStats: [
      ["One place", "Website, menu & orders"],
      ["Always open", "Your digital front door"],
      ["Fully yours", "Brand, colors & domain"],
      ["Made local", "Languages guests speak"],
    ],
    howItWorks: {
      eyebrow: "What we offer",
      title: "Every tool your restaurant needs",
      description:
        "Website, menu, orders, SEO, domain and analytics — all in one platform built for hospitality.",
    },
    platformJourney: {
      eyebrow: "How it works",
      title: "Five steps — the full platform",
      description:
        "Each step unlocks new Menurio tools. The journey automatically walks through everything we offer.",
    },
    platformSteps: [
      {
        title: "Build your digital home",
        description:
          "Website, story, gallery, hours and contact — guests find you online.",
        features: ["Restaurant website"],
      },
      {
        title: "Create your menu",
        description:
          "QR menu, photos, categories and translations in up to 8 languages.",
        features: ["QR menu", "Multilingual menu"],
      },
      {
        title: "Make it yours",
        description: "Themes, colors, logo and your own domain — fully on-brand.",
        features: ["Custom themes", "Custom domain"],
      },
      {
        title: "Take orders",
        description: "Dine-in, pickup and delivery — guests order straight from the menu.",
        features: ["Online orders"],
      },
      {
        title: "Grow and get found",
        description: "SEO, analytics and future POS integrations — grow without switching platforms.",
        features: ["SEO", "Analytics", "Integrations"],
      },
    ],
    finalCta: {
      eyebrow: "12 months free",
      title: "Your next guest is already looking for you.",
      subtitle: "Give them a website, menu and ordering experience worth finding.",
      primary: "Create Your Restaurant — Free",
      secondary: "View Demo",
    },
    product: {
      eyebrow: "Platform",
      title: "Menurio's complete toolkit",
      description:
        "Every capability for your restaurant's digital presence, menu and orders — on one platform.",
      browseAll: "Browse all features",
      exploreFeature: "Explore feature",
      items: [
        {
          slug: "restaurant-website",
          eyebrow: "Restaurant website",
          name: "Restaurant website",
          description:
            "Tell your story, show the atmosphere and give guests everything they need before they visit.",
        },
        {
          slug: "qr-menu",
          eyebrow: "QR menu",
          name: "QR menu",
          description:
            "A fast, visual mobile menu with clear choices and a permanent QR destination.",
        },
        {
          slug: "online-orders",
          eyebrow: "Online orders",
          name: "Online orders",
          description:
            "Turn intent into orders for dine-in, pickup or delivery with less friction.",
        },
        {
          slug: "themes",
          eyebrow: "Themes",
          name: "Custom themes",
          description:
            "Professional designs with your colors, logo and typography — unmistakably yours.",
        },
        {
          slug: "multilingual-menu",
          eyebrow: "Multilingual",
          name: "Multilingual menu",
          description:
            "One menu in up to 8 languages. Guests switch language without losing their place.",
        },
        {
          slug: "custom-domain",
          eyebrow: "Domain",
          name: "Custom domain",
          description:
            "menu.restaurant.am or restaurant.am — your brand, your URL, on PRO+.",
        },
        {
          slug: "seo",
          eyebrow: "SEO",
          name: "SEO",
          description:
            "Sitemaps, structured data, hreflang and meta tags so guests find you on Google.",
        },
        {
          slug: "analytics",
          eyebrow: "Analytics",
          name: "Analytics",
          description:
            "Track menu views, QR scans and popular dishes in one restaurant-focused dashboard.",
        },
        {
          slug: "integrations",
          eyebrow: "Integrations",
          name: "Integrations",
          description:
            "Future connections to POS, iiko and kitchen printers — without rebuilding your presence.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Good questions, clear answers.",
      contactPrefix: "Still curious? Write to",
      items: [
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
      ],
    },
    footerTagline: "The digital home your restaurant deserves.",
    footerCta: "Create your restaurant — free",
    footerGroups: { explore: "Explore", account: "Account" },
    footerDashboard: "Dashboard",
  },
  ru: {
    banner: "12 месяцев бесплатно · Без карты",
    nav: {
      product: "Продукт",
      howItWorks: "Как это работает",
      pricing: "Цены",
      faq: "FAQ",
    },
    signIn: "Вход",
    createRestaurant: "Создать ресторан",
    viewDemo: "Смотреть демо",
    startFree: "Начать бесплатно",
    heroBadge: "12 месяцев бесплатно · Без карты",
    heroTitle: "Полный цифровой дом для вашего ресторана",
    heroSubtitle:
      "Сайт, многоязычное меню, постоянный QR и заказы — всё в бренде вашего ресторана.",
    heroCta: "Создать ресторан — бесплатно",
    heroDemo: "Смотреть демо",
    heroBullets: [
      "Запуск за минуты",
      "Без технических навыков",
      "Отмена в любое время",
    ],
    promiseStats: [
      ["Одно место", "Сайт, меню и заказы"],
      ["Всегда открыт", "Ваша цифровая дверь"],
      ["Только ваш", "Бренд, цвета, домен"],
      ["Локально", "Языки гостей"],
    ],
    howItWorks: {
      eyebrow: "Что мы предлагаем",
      title: "Все инструменты для вашего ресторана",
      description:
        "Сайт, меню, заказы, SEO, домен и аналитика — всё на одной платформе для HoReCa.",
    },
    platformJourney: {
      eyebrow: "Как это работает",
      title: "Пять шагов — вся платформа",
      description:
        "Каждый шаг открывает новые инструменты Menurio. Платформа автоматически показывает все возможности.",
    },
    platformSteps: [
      {
        title: "Создайте цифровой дом",
        description:
          "Сайт, история, галерея, часы работы и контакты — гости находят вас онлайн.",
        features: ["Сайт ресторана"],
      },
      {
        title: "Соберите меню",
        description:
          "QR-меню, фото, разделы и переводы на 8 языков.",
        features: ["QR-меню", "Мультиязычное меню"],
      },
      {
        title: "Сделайте своим",
        description: "Темы, цвета, логотип и свой домен — полностью ваш бренд.",
        features: ["Индивидуальные темы", "Собственный домен"],
      },
      {
        title: "Принимайте заказы",
        description: "В зале, на вынос и доставку — гости заказывают прямо из меню.",
        features: ["Онлайн-заказы"],
      },
      {
        title: "Растите и будьте найдены",
        description: "SEO, аналитика и будущие POS-интеграции — без смены платформы.",
        features: ["SEO", "Аналитика", "Интеграции"],
      },
    ],
    finalCta: {
      eyebrow: "12 месяцев бесплатно",
      title: "Ваш следующий гость уже ищет вас",
      subtitle: "Дайте им сайт, меню и заказ, которые стоит найти.",
      primary: "Создать ресторан — бесплатно",
      secondary: "Смотреть демо",
    },
    product: {
      eyebrow: "Платформа",
      title: "Полный набор инструментов Menurio",
      description:
        "Каждая возможность для цифрового присутствия, меню и заказов вашего ресторана.",
      browseAll: "Все функции",
      exploreFeature: "Подробнее",
      items: [
        {
          slug: "restaurant-website",
          eyebrow: "Сайт",
          name: "Сайт ресторана",
          description:
            "Расскажите историю, покажите атмосферу и дайте гостям всё нужное до визита.",
        },
        {
          slug: "qr-menu",
          eyebrow: "QR-меню",
          name: "QR-меню",
          description:
            "Быстрое визуальное мобильное меню с понятным выбором и постоянной QR-ссылкой.",
        },
        {
          slug: "online-orders",
          eyebrow: "Заказы",
          name: "Онлайн-заказы",
          description:
            "Заказы в зале, на вынос или доставку — без лишних шагов для гостя.",
        },
        {
          slug: "themes",
          eyebrow: "Темы",
          name: "Индивидуальные темы",
          description:
            "Профессиональный дизайн, цвета, логотип и шрифты под ваш бренд.",
        },
        {
          slug: "multilingual-menu",
          eyebrow: "Мультиязычность",
          name: "Мультиязычное меню",
          description:
            "Одно меню на 8 языках. Гости переключают язык без перезагрузки.",
        },
        {
          slug: "custom-domain",
          eyebrow: "Домен",
          name: "Собственный домен",
          description:
            "menu.restaurant.am или restaurant.am — ваш бренд, ваш URL, на PRO+.",
        },
        {
          slug: "seo",
          eyebrow: "SEO",
          name: "SEO",
          description:
            "Sitemap, structured data, hreflang и meta tags для поисковых систем.",
        },
        {
          slug: "analytics",
          eyebrow: "Аналитика",
          name: "Аналитика",
          description:
            "Просмотры меню, QR-сканы и популярные блюда в одной панели.",
        },
        {
          slug: "integrations",
          eyebrow: "Интеграции",
          name: "Интеграции",
          description:
            "Будущие подключения к POS, iiko и кухонным принтерам без смены платформы.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Вопросы и понятные ответы",
      contactPrefix: "Остались вопросы? Напишите на",
      items: [
        [
          "Menurio — это только QR-меню?",
          "Нет. Menurio даёт полноценный сайт, цифровое меню, заказы, аналитику, SEO, домены и будущие интеграции с POS.",
        ],
        [
          "Что после 12 бесплатных месяцев?",
          "Можно остаться на бесплатном плане или перейти на START, PRO или PRO+. Цены показываем заранее.",
        ],
        [
          "Можно ли использовать свой домен?",
          "Да. На PRO+ доступны собственные домены с настройкой DNS в панели.",
        ],
        [
          "Можно ли показывать меню на нескольких языках?",
          "Да. Добавляйте переводы блюд — гости переключают язык прямо в меню.",
        ],
        [
          "Нужны ли технические навыки?",
          "Нет. Мастер настройки проведёт от данных ресторана до опубликованного сайта и QR.",
        ],
        [
          "Когда будет AI-импорт меню?",
          "Импорт фото, PDF и Excel в roadmap PRO. Интерфейс уже готов.",
        ],
      ],
    },
    footerTagline: "Цифровой дом, которого заслуживает ваш ресторан.",
    footerCta: "Создать ресторан — бесплатно",
    footerGroups: { explore: "Обзор", account: "Аккаунт" },
    footerDashboard: "Панель",
  },
};

export function getMarketingUi(lang: string): MarketingUi {
  if (lang === "hy" || lang === "ru" || lang === "en") return MARKETING[lang];
  return MARKETING.en;
}

export function marketingHref(href: string, lang: PublicLanguage): string {
  if (href.startsWith("http") || href.startsWith("mailto:")) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}lang=${lang}`;
}
