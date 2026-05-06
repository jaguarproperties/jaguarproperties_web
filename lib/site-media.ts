export const SITE_MEDIA_BASE_PATH = "/uploads/site-media";
export const SITE_MEDIA_PUBLIC_BASE_PATH = "/media/site-media";

export function toSiteMediaUrl(filename: string) {
  return `${SITE_MEDIA_PUBLIC_BASE_PATH}/${filename}`;
}

export const siteMedia = {
  emiratesCity: toSiteMediaUrl("emirates-city.jpeg"),
  jaguarPropertiesLogo: toSiteMediaUrl("jaguar-properties-logo.svg"),
  jaguarBrochureCover: toSiteMediaUrl("jaguar-brochure-cover.png"),
  jaguarCity: toSiteMediaUrl("jaguar-city.jpeg"),
  jaguarCityCommunity: toSiteMediaUrl("jaguar-city-community.jpeg"),
  jaguarCityCover: toSiteMediaUrl("jaguar-city-cover.png"),
  jaguarCityGrowth: toSiteMediaUrl("jaguar-city-growth.jpeg")
} as const;
