"use client";

import { useState, useTransition } from "react";

type ConfirmDeleteProps = {
  name: string;
  label?: string;
  action: (formData: FormData) => Promise<void>;
  hiddenFields?: Record<string, string>;
};

export function ConfirmDelete({
  name,
  label = "item",
  action,
  hiddenFields = {},
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        className="admin-danger-btn"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>
      {open ? (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="small-title">Please confirm</p>
            <h3 id="delete-title">Delete this {label}?</h3>
            <p>
              This will permanently remove <strong>{name}</strong> from the
              website. Visitors will no longer see it, and this cannot be
              undone.
            </p>
            <form
              action={(formData) => {
                startTransition(async () => {
                  await action(formData);
                  setOpen(false);
                });
              }}
              className="admin-modal-actions"
            >
              {Object.entries(hiddenFields).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Keep it
              </button>
              <button type="submit" className="admin-danger-btn" disabled={pending}>
                {pending ? "Deleting…" : "Yes, delete"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
