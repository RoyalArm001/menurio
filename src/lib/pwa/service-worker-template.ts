/** Generates a restaurant-scoped service worker script (served dynamically). */

export function buildRestaurantServiceWorker(
  slug: string,
  publicBasePath = `/r/${slug}`,
): string {
  const scopePrefix = publicBasePath || "/";
  const menuApiPrefix = `/api/public/restaurants/${slug}`;

  return `/* Menurio restaurant PWA — ${slug} */
const STATIC_CACHE = "menurio-static-v1";
const MENU_CACHE = "menurio-menu-v1";
const SCOPE = ${JSON.stringify(scopePrefix)};
const MENU_API = ${JSON.stringify(menuApiPrefix)};

const NEVER_CACHE = [
  "/dashboard",
  "/admin",
  "/login",
  "/onboarding",
  "/api/auth",
  "/api/restaurants/",
  "/api/admin/",
];

function shouldNeverCache(url) {
  return NEVER_CACHE.some((p) => url.pathname.startsWith(p));
}

function inRestaurantScope(url) {
  return SCOPE === "/" || url.pathname === SCOPE || url.pathname.startsWith(SCOPE + "/");
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Offline");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (shouldNeverCache(url)) return;

  if (url.pathname.startsWith(MENU_API)) {
    event.respondWith(networkFirst(event.request, MENU_CACHE));
    return;
  }

  if (!inRestaurantScope(url)) return;

  const dest = event.request.destination;
  if (dest === "style" || dest === "script" || dest === "font" || dest === "image") {
    event.respondWith(cacheFirst(event.request));
  }
});

self.addEventListener("push", (event) => {
  let payload = { title: "Notification", body: "", icon: "", image: "", url: SCOPE };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || undefined,
      image: payload.image || undefined,
      data: { url: payload.url || SCOPE },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || SCOPE;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ((SCOPE === "/" || client.url.includes(SCOPE)) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
`;
}
