import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";
import { ADMIN_COOKIE } from "@/lib/auth-constants";

export { ADMIN_COOKIE };

const SESSION_DAYS = 7;

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is missing. Add it to your .env file.");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getSessionAdminId() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.AUTH_SECRET) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const id = await getSessionAdminId();
  if (!id) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.admin.findUnique({ where: { id } });
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function loginAdmin(email: string, password: string) {
  const prisma = getPrisma();
  if (!prisma) {
    return { error: "Database is not configured yet. Add DATABASE_URL to .env." };
  }

  const admin = await prisma.admin.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!admin) {
    return { error: "Invalid email or password." };
  }

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) {
    return { error: "Invalid email or password." };
  }

  await createSession(admin.id);
  return { ok: true as const };
}

export async function updateAdminCredentials(input: {
  email: string;
  currentPassword: string;
  newPassword?: string;
}) {
  const admin = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) {
    return { error: "Database is not configured." };
  }

  const matches = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!matches) {
    return { error: "Current password is incorrect." };
  }

  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const taken = await prisma.admin.findFirst({
    where: { email, NOT: { id: admin.id } },
  });
  if (taken) {
    return { error: "That email is already in use." };
  }

  const data: { email: string; passwordHash?: string } = { email };
  if (input.newPassword) {
    if (input.newPassword.length < 8) {
      return { error: "New password must be at least 8 characters." };
    }
    data.passwordHash = await bcrypt.hash(input.newPassword, 12);
  }

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data,
  });

  return { ok: true as const, admin: updated };
}
