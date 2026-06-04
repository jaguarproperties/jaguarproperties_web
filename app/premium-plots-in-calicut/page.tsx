import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "premium-plots-in-calicut";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function PremiumPlotsInCalicutPage() {
  return SeoLandingPageContent({ slug });
}
