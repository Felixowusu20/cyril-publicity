import Link from "next/link";
import type { Service } from "@/lib/data";

type ServiceCardProps = {
  service: Service;
  href?: string;
};

export function ServiceCard({ service, href }: ServiceCardProps) {
  const content = (
    <article
      className="service-card"
      style={{ backgroundImage: `url('${service.image}')` }}
    >
      <div className="service-content">
        <span className="service-line" />
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        {href ? <span className="service-view">View designs</span> : null}
      </div>
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} className="service-card-link">
      {content}
    </Link>
  );
}
