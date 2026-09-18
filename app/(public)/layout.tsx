import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header siteName={settings.name} />
      <main>{children}</main>
      <Footer name={settings.name} tagline={settings.tagline} />
      <WhatsAppButton name={settings.name} whatsapp={settings.whatsapp} />
    </>
  );
}
