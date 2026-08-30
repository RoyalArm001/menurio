export type MemberRole =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "EDITOR"
  | "ORDER_OPERATOR";

export const ROLE_HIERARCHY: Record<MemberRole, number> = {
  OWNER: 100,
  ADMIN: 80,
  MANAGER: 60,
  EDITOR: 40,
  ORDER_OPERATOR: 20,
};

/** Permissions mapped to minimum required role */
export const PERMISSIONS = {
  "restaurant:read": "ORDER_OPERATOR",
  "restaurant:update": "ADMIN",
  "restaurant:delete": "OWNER",
  "member:manage": "ADMIN",
  "menu:read": "ORDER_OPERATOR",
  "menu:write": "EDITOR",
  "menu:delete": "MANAGER",
  "order:read": "ORDER_OPERATOR",
  "order:update": "ORDER_OPERATOR",
  "order:cancel": "MANAGER",
  "analytics:read": "MANAGER",
  "analytics:advanced": "MANAGER",
  "domain:manage": "ADMIN",
  "subscription:manage": "OWNER",
  "qr:manage": "MANAGER",
  "branch:manage": "ADMIN",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function roleMeetsMinimum(
  role: MemberRole,
  minimum: MemberRole,
): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimum];
}

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  const minimum = PERMISSIONS[permission];
  return roleMeetsMinimum(role, minimum);
}

export class AuthorizationError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertPermission(role: MemberRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError(
      `Role ${role} lacks permission ${permission}`,
    );
  }
}
