import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "investment-plots-in-bangalore";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function InvestmentPlotsInBangalorePage() {
  return SeoLandingPageContent({ slug });
}
