import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "premium-plots-in-bangalore";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function PremiumPlotsInBangalorePage() {
  return SeoLandingPageContent({ slug });
}
