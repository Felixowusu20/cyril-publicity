import Link from "next/link";
import { CoverImage } from "@/components/CoverImage";
import type { Service } from "@/lib/data";

type ServiceCardProps = {
  service: Service;
  href?: string;
};

export function ServiceCard({ service, href }: ServiceCardProps) {
  const content = (
    <article className="service-card">
      <CoverImage src={service.image} alt="" className="service-card-image" />
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
