import { site, whatsappUrl } from "@/lib/site";

export function WhatsAppButton({
  name = site.name,
  whatsapp = site.whatsapp,
}: {
  name?: string;
  whatsapp?: string;
}) {
  return (
    <a
      className="whatsapp-button"
      href={whatsappUrl(`Hello ${name}, I would like to order a design.`, whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 1 0 20.5 3.5zm-8.5 18a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9.1 9.1 0 1 1 12 21.5zm5.3-6.8c-.3-.1-1.7-.8-2-.9s-.5-.2-.7.1-.8.9-1 1.1-.4.2-.7.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.1-.3 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 .2.3 2 3.2a13.7 13.7 0 0 0 5.3 3.1c.7.2 1.3.2 1.8.1s1.7-.7 1.9-1.4.2-1.3.2-1.4-.2-.2-.5-.3z"
        />
      </svg>
    </a>
  );
}
