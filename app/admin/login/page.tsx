import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loginAction } from "@/lib/auth-actions";
import { getCurrentAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const { error, next } = await searchParams;

  return (
    <section className="admin-login">
      <div className="admin-login-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="small-title">CyrilPublicity</p>
          <ThemeToggle />
        </div>
        <h1>Admin login</h1>
        <p>Sign in to update the website content.</p>
        {!isDatabaseConfigured() ? (
          <p className="form-status">
            Add your Neon database URL to `.env`, then run `npx prisma migrate deploy`
            and `npx prisma db seed`.
          </p>
        ) : null}
        <form action={loginAction} className="admin-form">
          <input type="hidden" name="next" value={next || "/admin"} />
          <label>
            Email
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="form-status">{error}</p> : null}
          <button type="submit" className="primary-btn">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
