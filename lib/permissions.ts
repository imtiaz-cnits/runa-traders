/**
 * Shared Role & Module Permission Definitions
 * Used by User Role management UI and Signup registration defaults.
 */

export interface SubmenuDef {
  key: string;
  label: string;
  desc: string;
}

export interface ModuleDef {
  key: string;
  label: string;
  desc: string;
  submenus?: SubmenuDef[];
}

export const PERMISSION_MODULES: ModuleDef[] = [
  {
    key: "dashboard",
    label: "Dashboard (ড্যাশবোর্ড)",
    desc: "Main dashboard overview & business metrics (মূল সার্বিক ড্যাশবোর্ড ওভারভিউ ও ব্যবসায়িক তথ্য)",
  },
  {
    key: "sales",
    label: "Sales Portal (বিক্রয় পোর্টাল)",
    desc: "Product selection, cash sales & billing (পণ্য নির্বাচন, নগদ বিক্রয় ও দ্রুত ক্যাশ বিলিং)",
    submenus: [
      { key: "pos", label: "POS Terminal (পজ টার্মিনাল)", desc: "Counter billing & instant invoice (কাউন্টার বিলিং ও দ্রুত বিক্রয় রশিদ তৈরি)" },
      { key: "invoices", label: "Invoice List (ইনভয়েস তালিকা)", desc: "Completed sales invoices & print (বিক্রিত চালানের পূর্ণাঙ্গ তালিকা ও প্রিন্ট)" },
      { key: "challans", label: "Delivery Challans (চালান তালিকা)", desc: "Delivery challan dispatch & print (ডেলিভারি চালান তৈরি ও প্রিন্ট)" },
      { key: "returns", label: "Sales Return (সেলস রিটার্ন)", desc: "Customer returned items adjustment (গ্রাহকের ফেরত আইটেম সমন্বয়)" },
    ],
  },
  {
    key: "products",
    label: "Stock & Products (স্টক ও প্রডাক্ট)",
    desc: "Tiles catalog, categories, brands & stock adjustments (টাইলস ক্যাটালগ, ক্যাটাগরি, ব্র্যান্ড ও স্টক সমন্বয়)",
    submenus: [
      { key: "inventory", label: "Stock Overview (স্টক ওভারভিউ)", desc: "Warehouse & showroom stock balance (গুদাম ও শো-রুমের বর্তমান স্টক ব্যালেন্স)" },
      { key: "product_list", label: "Product List (পণ্য তালিকা)", desc: "All tiles & sanitary catalog info (সকল টাইলস ও স্যানিটারি সামগ্রীর তথ্য)" },
      { key: "categories_brands", label: "Categories & Brands (ক্যাটাগরি ও ব্র্যান্ড)", desc: "Product classification & branding (পণ্য শ্রেণীবিন্যাস ও ব্র্যান্ডিং)" },
      { key: "barcode_print", label: "Barcode Print (বারকোড প্রিন্ট)", desc: "Product & cartoon barcode label generator (পণ্য ও কার্টুন বারকোড লেবেল তৈরি)" },
    ],
  },
  {
    key: "purchases",
    label: "Purchases & Suppliers (ক্রয় ও সরবরাহকারী)",
    desc: "Goods inward, purchase orders & vendor bills (মাল ক্রয়, ইনওয়ার্ড ও মহাজন বিলিং)",
    submenus: [
      { key: "purchase_list", label: "Purchase List (ক্রয় তালিকা)", desc: "Inward purchases from suppliers (সরবরাহকারীর নিকট থেকে নতুন মাল ক্রয়)" },
      { key: "suppliers", label: "Suppliers (সরবরাহকারী তালিকা)", desc: "Vendor & manufacturer profiles (মহাজন ও ডিলারদের পরিচিতি)" },
      { key: "supplier_dues", label: "Supplier Due Pay (মহাজন বাকি পরিশোধ)", desc: "Supplier debt payments & ledger (সরবরাহকারীর দেনা পরিশোধ ও খাতা)" },
      { key: "purchase_returns", label: "Purchase Returns (ক্রয় রিটার্ন)", desc: "Damaged/excess goods return to vendor (ত্রুটিপূর্ণ মাল মহাজনকে ফেরত)" },
    ],
  },
  {
    key: "customers",
    label: "Customers & Dues (গ্রাহক ও বাকি খাতা)",
    desc: "Customer database & accounts ledger (কাস্টমার ডাটাবেস ও লেজার সমন্বয়)",
    submenus: [
      { key: "customer_list", label: "Customer List (গ্রাহক তালিকা)", desc: "Retail & wholesale customer directory (খুচরা ও পাইকারী গ্রাহকদের ডাটাবেস)" },
      { key: "customer_dues", label: "Customer Due (বাকি আদায় ও জমা)", desc: "Customer due collection & ledger (কাস্টমারের বকেয়া আদায় ও হিসাব খাতা)" },
    ],
  },
  {
    key: "expenses",
    label: "Accounts & Expenses (হিসাব ও খরচ)",
    desc: "Daily operational costs & staff payroll (দোকানের দৈনিক খরচ ও স্টাফ বেতন)",
    submenus: [
      { key: "daily_expenses", label: "Daily Expenses (দৈনিক খরচ)", desc: "Daily petty cash & overhead vouchers (দোকানের প্রাত্যহিক বিভিন্ন খরচের ভাউচার)" },
      { key: "expense_types", label: "Expense Categories (খরচের খাত)", desc: "Office rent, utilities, entertainment categories (অফিস, ভাড়া, আপ্যায়ন ইত্যাদি খাত)" },
      { key: "staff_payroll", label: "Staff & Payroll (স্টাফ ও বেতন)", desc: "Employee attendance & monthly salary ledger (কর্মচারী হাজিরা ও মাসিক বেতন খাতা)" },
    ],
  },
  {
    key: "reports",
    label: "Reports & Analytics (রিপোর্ট ও বিবরণী)",
    desc: "Financial analytics, ledger & stock reports (ব্যবসার সামগ্রিক হিসাব ও স্টক রিপোর্ট)",
    submenus: [
      { key: "report_sales", label: "Sales Report (সেলস রিপোর্ট)", desc: "Sales & collection statements (বিক্রয় ও আদায়কৃত টাকার স্টেটমেন্ট)" },
      { key: "report_ledger", label: "Daily Ledger (দৈনিক লেজার)", desc: "Daily debit-credit cashbook ledger (প্রতিদিনের ডেবিট-ক্রেডিট হিসাব খাতা)" },
      { key: "report_income_expense", label: "Income & Expense (আয়-ব্যয় বিবরণী)", desc: "Profit & loss financial statements (ব্যবসার লাভ-লোকসান ও আর্থিক চিত্র)" },
      { key: "report_stock_out", label: "Stock-Out Report (স্টক-আউট রিপোর্ট)", desc: "Low stock & out of stock alerts (ঘাটতি ও কম স্টক পণ্য সতর্কতা)" },
    ],
  },
  {
    key: "users",
    label: "User Roles & Permissions (ব্যবহারকারী ও রোল)",
    desc: "System users & access control settings (সিস্টেম ব্যবহারকারী তৈরি ও পারমিশন নিয়ন্ত্রণ)",
  },
];

export const ALL_PERMISSION_KEYS: string[] = [];
PERMISSION_MODULES.forEach((m) => {
  ALL_PERMISSION_KEYS.push(m.key);
  if (m.submenus) {
    m.submenus.forEach((s) => ALL_PERMISSION_KEYS.push(s.key));
  }
});

export function getAllPermissionsObject(val: boolean): Record<string, boolean> {
  const obj: Record<string, boolean> = {};
  ALL_PERMISSION_KEYS.forEach((k) => {
    obj[k] = val;
  });
  return obj;
}

export const ALLOWED_SIGNUP_ROLES = ["staff", "manager", "admin"] as const;
export type AllowedSignupRole = (typeof ALLOWED_SIGNUP_ROLES)[number];

export const ALL_SYSTEM_ROLES = ["super_admin", "admin", "manager", "staff"] as const;
export type SystemRole = (typeof ALL_SYSTEM_ROLES)[number];

export const ROLE_PRESETS: Record<string, Record<string, boolean>> = {
  super_admin: getAllPermissionsObject(true),
  admin: getAllPermissionsObject(true),
  manager: {
    ...getAllPermissionsObject(true),
    users: false,
  },
  staff: {
    ...getAllPermissionsObject(false),
    dashboard: true,
    sales: true,
    pos: true,
    invoices: true,
    challans: true,
    returns: true,
    products: true,
    inventory: true,
    product_list: true,
    categories_brands: true,
    barcode_print: true,
    customers: true,
    customer_list: true,
    customer_dues: true,
  },
};

export function getRolePresetPermissions(role: string): Record<string, boolean> {
  const normalized = role.toLowerCase();
  return { ...(ROLE_PRESETS[normalized] || ROLE_PRESETS.staff) };
}

export const TOP_SUPER_ADMIN_EMAIL = "dev@runatraders.com";

export const STAFF_EXCLUDED_EMAILS = [
  TOP_SUPER_ADMIN_EMAIL,
  "admin2@runatraders.com",
  "warehouse@runatraders.com",
] as const;

export function normalizeEmail(email?: string | null): string {
  return (email || "").trim().toLowerCase();
}

export function isTopSuperAdminEmail(email?: string | null): boolean {
  return normalizeEmail(email) === TOP_SUPER_ADMIN_EMAIL;
}

export function isTopSuperAdmin(
  user?: { email?: string | null; role?: string | null } | null
): boolean {
  return isTopSuperAdminEmail(user?.email);
}

export function isSuperAdminRole(role?: string | null): boolean {
  return (role || "").toLowerCase() === "super_admin";
}

export function isStaffExcludedUser(
  user?: { email?: string | null; role?: string | null } | null
): boolean {
  if (!user) return false;
  const email = normalizeEmail(user.email);
  if (email && (STAFF_EXCLUDED_EMAILS as readonly string[]).includes(email)) {
    return true;
  }
  return isSuperAdminRole(user.role);
}

/**
 * Prisma AND conditions to completely hide top-level super admin activity logs
 * from non-top-level users while preserving normal logs that have NULL email/user_id.
 */
export function buildHiddenTopAdminLogConditions(hiddenUserIds: bigint[] = []) {
  const conditions: Record<string, unknown>[] = [
    {
      OR: [
        { user_email: null },
        { NOT: { user_email: TOP_SUPER_ADMIN_EMAIL } },
      ],
    },
    {
      NOT: { user_role: "super_admin" },
    },
    {
      NOT: { description: { contains: TOP_SUPER_ADMIN_EMAIL } },
    },
  ];

  if (hiddenUserIds.length > 0) {
    conditions.push({
      OR: [
        { user_id: null },
        { user_id: { notIn: hiddenUserIds } },
      ],
    });
  }

  return conditions;
}

export function isAdminOrSuperAdmin(role?: string | null): boolean {
  const normalized = (role || "").toLowerCase();
  return normalized === "admin" || normalized === "super_admin";
}

export function formatRoleLabel(role?: string | null): string {
  const normalized = (role || "").toLowerCase();
  if (normalized === "super_admin") return "Super Admin";
  if (normalized === "admin") return "Admin";
  if (normalized === "manager") return "Manager";
  if (normalized === "staff") return "Staff";
  return normalized ? normalized.replace(/_/g, " ") : "User";
}
