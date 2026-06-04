import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "property-investment-dubai";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function PropertyInvestmentDubaiPage() {
  return SeoLandingPageContent({ slug });
}
