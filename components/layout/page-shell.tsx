import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

export async function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteHeader />
      <main className="relative">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
