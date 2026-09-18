"use server";

import { redirect } from "next/navigation";
import { clearSession, loginAdmin } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");
  const result = await loginAdmin(email, password);
  if ("error" in result && result.error) {
    redirect(`/admin/login?error=${encodeURIComponent(result.error)}&next=${encodeURIComponent(next)}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAdmin() {
  await clearSession();
  redirect("/admin/login");
}
