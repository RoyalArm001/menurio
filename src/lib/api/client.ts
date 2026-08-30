export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Request failed",
      res.status,
    );
  }

  return data as T;
}

export const api = {
  createRestaurant: (body: {
    name: string;
    description?: string;
    defaultLanguage?: string;
    supportedLanguages?: string[];
    slug?: string;
    address?: string;
    phone?: string;
    email?: string;
    instagram?: string;
    brandPrimaryColor?: string;
  }) =>
    apiFetch<{ restaurant: { id: string; slug: string }; qrPermanentId: string }>(
      "/api/restaurants",
      { method: "POST", body: JSON.stringify(body) },
    ),

  listRestaurants: () =>
    apiFetch<{ restaurants: Array<{ restaurant: { id: string; slug: string; name: string }; role: string }> }>(
      "/api/restaurants",
    ),

  getRestaurant: (id: string) =>
    apiFetch<{ restaurant: unknown; subscription: unknown; entitlements: unknown }>(
      `/api/restaurants/${id}`,
    ),

  updateRestaurant: (id: string, body: Record<string, unknown>) =>
    apiFetch(`/api/restaurants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getMenuTree: (id: string) =>
    apiFetch<{ menus: unknown[] }>(`/api/restaurants/${id}/menu`),

  createCategory: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/menu`, {
      method: "POST",
      body: JSON.stringify({ type: "category", ...body as object }),
    }),

  createProduct: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/menu`, {
      method: "POST",
      body: JSON.stringify({ type: "product", ...body as object }),
    }),

  patchProduct: (restaurantId: string, productId: string, body: unknown) =>
    apiFetch(`/api/restaurants/${restaurantId}/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteProduct: (restaurantId: string, productId: string) =>
    apiFetch(`/api/restaurants/${restaurantId}/products/${productId}`, {
      method: "DELETE",
    }),

  listOrders: (id: string) =>
    apiFetch<{ orders: unknown[] }>(`/api/restaurants/${id}/orders`),

  updateOrderStatus: (
    id: string,
    orderId: string,
    status: string,
    note?: string,
  ) =>
    apiFetch(`/api/restaurants/${id}/orders`, {
      method: "PATCH",
      body: JSON.stringify({ orderId, status, note }),
    }),

  getAnalytics: (id: string) =>
    apiFetch<{ analytics: unknown }>(`/api/restaurants/${id}/analytics`),

  getSettings: (id: string) =>
    apiFetch<{ settings: unknown }>(`/api/restaurants/${id}/settings`),

  updateSettings: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/settings`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getDesign: (id: string) =>
    apiFetch<{
      design: Record<string, unknown>;
      resolved: Record<string, unknown>;
      plan: string;
      entitlements: Record<string, boolean | number>;
    }>(`/api/restaurants/${id}/design`),

  updateDesign: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/design`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  listMembers: (id: string) =>
    apiFetch<{ members: unknown[] }>(`/api/restaurants/${id}/members`),

  addMember: (id: string, email: string, role: string) =>
    apiFetch(`/api/restaurants/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }),

  listBranches: (id: string) =>
    apiFetch<{ branches: unknown[] }>(`/api/restaurants/${id}/branches`),

  createBranch: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/branches`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listQrCodes: (id: string) =>
    apiFetch<{ qrCodes: unknown[] }>(`/api/restaurants/${id}/qr`),

  createQrCode: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/qr`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  presignUpload: (id: string, body: unknown) =>
    apiFetch<{ uploadUrl: string; key: string; publicUrl: string }>(
      `/api/restaurants/${id}/uploads/presign`,
      { method: "POST", body: JSON.stringify(body) },
    ),

  submitPublicOrder: (slug: string, body: unknown) =>
    apiFetch(`/api/public/restaurants/${slug}/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPublicRestaurant: (slug: string) =>
    apiFetch<{ restaurant: unknown; menus: unknown[] }>(
      `/api/public/restaurants/${slug}`,
    ),

  listDomains: (id: string) =>
    apiFetch<{ domains: Array<{ id: string; hostname: string; verified: boolean; verificationToken: string }> }>(
      `/api/restaurants/${id}/domains`,
    ),

  addDomain: (id: string, hostname: string) =>
    apiFetch(`/api/restaurants/${id}/domains`, {
      method: "POST",
      body: JSON.stringify({ hostname }),
    }),

  verifyDomain: (restaurantId: string, domainId: string) =>
    apiFetch(`/api/restaurants/${restaurantId}/domains/${domainId}/verify`, {
      method: "POST",
    }),

  updateBranch: (restaurantId: string, branchId: string, body: unknown) =>
    apiFetch(`/api/restaurants/${restaurantId}/branches/${branchId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  listWaiterRequests: (id: string) =>
    apiFetch<{ requests: unknown[] }>(`/api/restaurants/${id}/waiter`),

  acknowledgeWaiter: (restaurantId: string, requestId: string) =>
    apiFetch(`/api/restaurants/${restaurantId}/waiter`, {
      method: "PATCH",
      body: JSON.stringify({ requestId }),
    }),

  submitPublicWaiter: (slug: string, body: unknown) =>
    apiFetch(`/api/public/restaurants/${slug}/waiter`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  registerUpload: (
    restaurantId: string,
    body: {
      key: string;
      url: string;
      mimeType: string;
      sizeBytes: number;
      purpose: string;
      originalFilename?: string;
    },
  ) =>
    apiFetch<{ asset: { id: string } }>(
      `/api/restaurants/${restaurantId}/uploads/register`,
      { method: "POST", body: JSON.stringify(body) },
    ),

  createImport: (restaurantId: string, fileAssetId: string, type: string) =>
    apiFetch<{ job: unknown; preview?: unknown[] }>(
      `/api/restaurants/${restaurantId}/imports`,
      {
        method: "POST",
        body: JSON.stringify({ action: "create", type, fileAssetId }),
      },
    ),

  confirmImport: (restaurantId: string, jobId: string) =>
    apiFetch(`/api/restaurants/${restaurantId}/imports`, {
      method: "POST",
      body: JSON.stringify({ action: "confirm", jobId }),
    }),

  getAuditLogs: (id: string) =>
    apiFetch<{ logs: Array<{ action: string; createdAt: string }> }>(
      `/api/restaurants/${id}/audit`,
    ),

  listNotificationCampaigns: (id: string) =>
    apiFetch<{ campaigns: unknown[] }>(
      `/api/restaurants/${id}/notifications/campaigns`,
    ),

  createNotificationCampaign: (
    id: string,
    body: {
      title: string;
      message: string;
      imageUrl?: string | null;
      targetUrl?: string;
      sendNow?: boolean;
      scheduledAt?: string;
    },
  ) =>
    apiFetch<{ campaign: unknown }>(`/api/restaurants/${id}/notifications/campaigns`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getSeoSettings: (id: string) =>
    apiFetch<{ plan: string; settings: unknown; translations: unknown[]; canEdit: boolean }>(
      `/api/restaurants/${id}/seo`,
    ),

  updateSeoSettings: (id: string, body: unknown) =>
    apiFetch(`/api/restaurants/${id}/seo`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  async uploadFile(
    restaurantId: string,
    file: File,
    purpose: string,
  ): Promise<{ publicUrl: string; assetId?: string }> {
    const presign = await api.presignUpload(restaurantId, {
      restaurantId,
      filename: file.name,
      contentType: file.type,
      purpose,
      sizeBytes: file.size,
    });
    const upload = await fetch(presign.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!upload.ok) {
      throw new Error("Image upload failed");
    }
    const reg = await api.registerUpload(restaurantId, {
      key: presign.key,
      url: presign.publicUrl,
      mimeType: file.type,
      sizeBytes: file.size,
      purpose,
      originalFilename: file.name,
    });
    return { publicUrl: presign.publicUrl, assetId: reg.asset.id };
  },
};
