type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  compact = false,
}: PageHeaderProps) {
  return (
    <section className={`page-header${compact ? " compact" : ""}`}>
      <p className="small-title">{eyebrow}</p>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
}
