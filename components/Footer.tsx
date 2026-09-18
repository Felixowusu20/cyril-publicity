import { site } from "@/lib/site";

export function Footer({
  name = site.name,
  tagline = site.tagline,
}: {
  name?: string;
  tagline?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <h3>{name}</h3>
      <p>{tagline}</p>
      <p>
        © {year} {name}. All rights reserved.
      </p>
    </footer>
  );
}
