import Link from "next/link";

type CtaProps = {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
};

export function Cta({
  title = "Have a Design Project in Mind?",
  body = "Let's bring your idea to life.",
  href = "/order",
  label = "Start Your Order",
}: CtaProps) {
  return (
    <section className="cta">
      <h2>{title}</h2>
      <p>{body}</p>
      <Link href={href} className="primary-btn">
        {href === "/order" ? (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M6 7h12l-1 12H7L6 7Z" />
            <path d="M9 7V6a3 3 0 0 1 6 0v1" />
          </svg>
        ) : null}
        {label}
      </Link>
    </section>
  );
}
