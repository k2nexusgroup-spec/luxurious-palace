import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFloatingButton from "@/components/layout/WhatsappFloatingButton";
import { getCategories, getSettings } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const categories = await getCategories();
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <Header shopName={settings.shopName} whatsappLink={settings.whatsappLink} categories={navCategories} />
      <main>{children}</main>
      <Footer settings={settings} categories={navCategories} />
      <WhatsappFloatingButton whatsappLink={settings.whatsappLink} />
    </>
  );
}
