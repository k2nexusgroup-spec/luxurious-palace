import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFloatingButton from "@/components/layout/WhatsappFloatingButton";
import { getSettings } from "@/lib/queries";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();

  return (
    <>
      <Header shopName={settings.shopName} whatsappLink={settings.whatsappLink} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsappFloatingButton whatsappLink={settings.whatsappLink} />
    </>
  );
}
