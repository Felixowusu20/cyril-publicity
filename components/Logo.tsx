import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ name = site.name }: { name?: string }) {
  const mark = name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "CP";
  const split = name.match(/^(Cyril)(Publicity)$/i);

  return (
    <Link href="/" className="logo" aria-label={`${name} home`}>
      <span className="logo-mark" aria-hidden="true">
        {mark}
      </span>
      <span className="logo-text">
        {split ? (
          <>
            {split[1]}
            <span>{split[2]}</span>
          </>
        ) : (
          name
        )}
      </span>
    </Link>
  );
}
