"use client";

import { useActionState } from "react";
import { saveAccount } from "@/lib/admin-actions";

export function AccountForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(saveAccount, null);

  return (
    <form action={action} className="admin-form">
      <label>
        Admin email
        <input name="email" type="email" defaultValue={email} required />
      </label>
      <label>
        Current password
        <input name="currentPassword" type="password" required autoComplete="current-password" />
      </label>
      <label>
        New password
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Leave blank to keep the current password"
        />
      </label>
      {state?.error ? <p className="form-status">{state.error}</p> : null}
      {state?.ok ? <p className="form-status">Account updated.</p> : null}
      <button type="submit" className="primary-btn" disabled={pending}>
        {pending ? "Saving…" : "Save account"}
      </button>
    </form>
  );
}
