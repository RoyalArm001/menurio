export const PUBLIC_LANGUAGES = ["hy", "en", "ru"] as const;
export type PublicLanguage = string;

export const PUBLIC_LANGUAGE_META: Record<
  PublicLanguage,
  { prefix: string; label: string; native: string }
> = {
  en: { prefix: "GB", label: "English", native: "English" },
  hy: { prefix: "AM", label: "Armenian", native: "Հայերեն" },
  ru: { prefix: "RU", label: "Russian", native: "Русский" },
};

export type PublicSiteUi = {
  home: string;
  menu: string;
  open: string;
  viewMenu: string;
  orderAtTable: string;
  dineIn: string;
  pickup: string;
  delivery: string;
  available: string;
  notAvailable: string;
  featured: string;
  address: string;
  phone: string;
  search: string;
  all: string;
  soldOut: string;
  addToCart: string;
  cart: string;
  openCart: string;
  emptyCart: string;
  checkout: string;
  noDishes: string;
  emptyMenu: string;
  viewCart: string;
  total: string;
  submitOrder: string;
  ingredients: string;
  allergens: string;
  noMajorAllergens: string;
  caloriesSuffix: string;
  demoCheckoutNote: string;
  table: string;
  callWaiter: string;
  requestBill: string;
  orderType: string;
  orderTable: string;
  orderPickup: string;
  orderDelivery: string;
  name: string;
  notes: string;
  placeOrder: string;
  submitting: string;
  subtotal: string;
  remove: string;
  orderingDisabled: string;
  orderSubmitted: string;
  orderFailed: string;
  gallery: string;
  about: string;
  contact: string;
  signatureDishes: string;
  fromKitchen: string;
  fullMenu: string;
  visitUs: string;
  openingHours: string;
  openInMaps: string;
  poweredBy: string;
  createRestaurant: string;
  onlineOrdering: string;
};

export const PUBLIC_SITE_UI: Record<string, PublicSiteUi> = {
  en: {
    home: "Home",
    menu: "Menu",
    open: "Open",
    viewMenu: "View Menu",
    orderAtTable: "Order at Table",
    dineIn: "Dine in",
    pickup: "Pickup",
    delivery: "Delivery",
    available: "Available",
    notAvailable: "Not available",
    featured: "Featured",
    address: "Address",
    phone: "Phone",
    search: "Search dishes...",
    all: "All",
    soldOut: "Sold out",
    addToCart: "Add to cart",
    cart: "Your order",
    openCart: "Open cart",
    emptyCart: "Cart is empty.",
    checkout: "Complete your order",
    noDishes: "No dishes match your search.",
    emptyMenu: "Menu is being prepared. Check back soon.",
    viewCart: "View cart",
    total: "Total",
    submitOrder: "Submit order",
    ingredients: "Ingredients",
    allergens: "Allergens",
    noMajorAllergens: "No major allergens listed",
    caloriesSuffix: "kcal",
    demoCheckoutNote: "Demo checkout — order API integration coming soon",
    table: "Table",
    callWaiter: "Call waiter",
    requestBill: "Request bill",
    orderType: "Order type",
    orderTable: "Table",
    orderPickup: "Pickup",
    orderDelivery: "Delivery",
    name: "Name",
    notes: "Notes",
    placeOrder: "Place order",
    submitting: "Submitting…",
    subtotal: "Subtotal",
    remove: "Remove",
    orderingDisabled: "Online ordering is not enabled for this restaurant.",
    orderSubmitted: "Order submitted!",
    orderFailed: "Order failed",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    signatureDishes: "Signature dishes",
    fromKitchen: "From our kitchen",
    fullMenu: "Full menu →",
    visitUs: "Visit us",
    openingHours: "Opening hours",
    openInMaps: "Open in Google Maps",
    poweredBy: "Powered by",
    createRestaurant: "Create your restaurant",
    onlineOrdering: "Checkout",
  },
  hy: {
    home: "Գլխավոր",
    menu: "Մենյու",
    open: "Բաց է",
    viewMenu: "Դիտել մենյուն",
    orderAtTable: "Պատվիրել սեղանից",
    dineIn: "Սրահում",
    pickup: "Վերցնել",
    delivery: "Առաքում",
    available: "Հասանելի",
    notAvailable: "Անհասանելի",
    featured: "Ընտրյալ",
    address: "Հասցե",
    phone: "Հեռախոս",
    search: "Որոնել ճաշատեսակ...",
    all: "Բոլորը",
    soldOut: "Ավարտված",
    addToCart: "Ավելացնել",
    cart: "Պատվերը",
    openCart: "Զամբյուղ",
    emptyCart: "Զամբյուղը դատարկ է։",
    checkout: "Ավարտել պատվերը",
    noDishes: "Համընկնող ճաշատեսակ չկա։",
    emptyMenu: "Մենյուն պատրաստվում է։ Շուտով կլինի։",
    viewCart: "Դիտել զամբյուղը",
    total: "Ընդամենը",
    submitOrder: "Ուղարկել պատվերը",
    ingredients: "Բաղադրիչներ",
    allergens: "Ալերգեններ",
    noMajorAllergens: "Խոշոր ալերգեններ նշված չեն",
    caloriesSuffix: "կկալ",
    demoCheckoutNote: "Դեմո checkout — պատվերների API ինտեգրումը կմիանա backend փուլում",
    table: "Սեղան",
    callWaiter: "Կանչել մատուցողին",
    requestBill: "Հաշիվ խնդրել",
    orderType: "Պատվերի տեսակ",
    orderTable: "Սեղան",
    orderPickup: "Վերցնել",
    orderDelivery: "Առաքում",
    name: "Անուն",
    notes: "Նշումներ",
    placeOrder: "Պատվիրել",
    submitting: "Ուղարկվում է…",
    subtotal: "Ընդամենը",
    remove: "Հեռացնել",
    orderingDisabled: "Առցանց պատվերը ակտիվ չէ։",
    orderSubmitted: "Պատվերը ուղարկված է։",
    orderFailed: "Պատվերը չհաջողվեց",
    gallery: "Պատկերասրահ",
    about: "Մեր մասին",
    contact: "Կապ",
    signatureDishes: "Հատուկ ճաշատեսակներ",
    fromKitchen: "Մեր խոհանոցից",
    fullMenu: "Ամբողջ մենյու →",
    visitUs: "Այցելեք մեզ",
    openingHours: "Աշխատանքային ժամեր",
    openInMaps: "Բացել Google Maps-ում",
    poweredBy: "Ստեղծված է",
    createRestaurant: "Ստեղծել ձեր ռեստորանը",
    onlineOrdering: "Վճարել",
  },
  ru: {
    home: "Главная",
    menu: "Меню",
    open: "Открыто",
    viewMenu: "Смотреть меню",
    orderAtTable: "Заказать за столом",
    dineIn: "В зале",
    pickup: "Самовывоз",
    delivery: "Доставка",
    available: "Доступно",
    notAvailable: "Недоступно",
    featured: "Избранное",
    address: "Адрес",
    phone: "Телефон",
    search: "Поиск блюд...",
    all: "Все",
    soldOut: "Нет в наличии",
    addToCart: "В корзину",
    cart: "Ваш заказ",
    openCart: "Корзина",
    emptyCart: "Корзина пуста.",
    checkout: "Оформить заказ",
    noDishes: "Блюда не найдены.",
    emptyMenu: "Меню скоро будет готово.",
    viewCart: "Открыть корзину",
    total: "Итого",
    submitOrder: "Отправить заказ",
    ingredients: "Состав",
    allergens: "Аллергены",
    noMajorAllergens: "Основные аллергены не указаны",
    caloriesSuffix: "ккал",
    demoCheckoutNote: "Демо checkout — API заказов будет подключён на backend этапе",
    table: "Стол",
    callWaiter: "Позвать официанта",
    requestBill: "Попросить счёт",
    orderType: "Тип заказа",
    orderTable: "Стол",
    orderPickup: "Самовывоз",
    orderDelivery: "Доставка",
    name: "Имя",
    notes: "Заметки",
    placeOrder: "Оформить",
    submitting: "Отправка…",
    subtotal: "Итого",
    remove: "Удалить",
    orderingDisabled: "Онлайн-заказ недоступен.",
    orderSubmitted: "Заказ отправлен!",
    orderFailed: "Не удалось оформить заказ",
    gallery: "Галерея",
    about: "О нас",
    contact: "Контакты",
    signatureDishes: "Фирменные блюда",
    fromKitchen: "Из нашей кухни",
    fullMenu: "Полное меню →",
    visitUs: "Как нас найти",
    openingHours: "Часы работы",
    openInMaps: "Открыть в Google Maps",
    poweredBy: "Работает на",
    createRestaurant: "Создать ресторан",
    onlineOrdering: "Оформить",
  },
};

export function resolvePublicLanguage(
  code: string | null | undefined,
  supportedLanguages: string[] = [...PUBLIC_LANGUAGES],
  defaultLanguage = "hy",
): PublicLanguage {
  const normalized = code?.trim().toLowerCase();
  const supported = supportedLanguages.map((language) => language.trim());
  const matchingLanguage = normalized
    ? supported.find((language) => language.toLowerCase() === normalized)
    : undefined;
  const defaultSupportedLanguage = supported.find(
    (language) => language.toLowerCase() === defaultLanguage.toLowerCase(),
  );

  if (matchingLanguage) return matchingLanguage;
  if (defaultSupportedLanguage) return defaultSupportedLanguage;
  return supported[0] ?? "hy";
}

export function getPublicSiteUi(language: string | null | undefined): PublicSiteUi {
  return PUBLIC_SITE_UI[language?.toLowerCase() ?? ""] ?? PUBLIC_SITE_UI.hy;
}

/** @deprecated use getPublicSiteUi */
export function getMenuUi(language: string | null | undefined): PublicSiteUi {
  return getPublicSiteUi(language);
}

export function withLangParam(href: string, lang: string | null): string {
  if (!lang) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}lang=${lang}`;
}
