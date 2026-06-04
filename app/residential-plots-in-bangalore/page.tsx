import { SeoLandingPageContent, generateSeoLandingMetadata } from "@/components/site/seo-landing-page";

const slug = "residential-plots-in-bangalore";

export const generateMetadata = () => generateSeoLandingMetadata(slug);

export default async function ResidentialPlotsInBangalorePage() {
  return SeoLandingPageContent({ slug });
}
