import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "property-investment-qatar";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function PropertyInvestmentQatarPage() {
  return SeoLandingPageContent({ slug });
}
