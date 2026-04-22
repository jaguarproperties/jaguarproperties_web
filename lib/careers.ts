import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type StaticCareer = {
  title: string;
  openings: number;
  requirements: string[];
  qualification: string;
  experience: string;
};

export type CareerOpening = StaticCareer & {
  slug: string;
};

export const careerOpenings: CareerOpening[] = [
  {
    title: "Team Leader",
    openings: 10,
    requirements: [
      "Managing the day-to-day activities of the team.",
      "Motivating the team to achieve organizational goals.",
      "Developing and implementing a timeline to achieve targets."
    ],
    qualification: "High school diploma or similar.",
    experience: "2 years experience"
  },
  {
    title: "Sales Telecallers",
    openings: 60,
    requirements: [
      "Strong communication abilities.",
      "Exceptional communication and the capacity to switch up speaking approach.",
      "The capacity to adjust to challenging circumstances."
    ],
    qualification: "High school diploma or similar.",
    experience: "Fresher or experienced"
  },
  {
    title: "Sales Managers",
    openings: 5,
    requirements: [
      "Develop and implement sales strategies to achieve targets.",
      "Lead and motivate sales team to meet and exceed sales goals.",
      "Provide regular reports on sales performance to senior management."
    ],
    qualification: "Bachelor's degree in Business Administration.",
    experience: "5 years of experience"
  },
  {
    title: "Branch Manager",
    openings: 1,
    requirements: [
      "Ensure compliance with company policies and procedures.",
      "Build and maintain strong relationships with customers and key stakeholder.",
      "Oversee daily operations of the branch, including staff management and customer service."
    ],
    qualification: "Bachelor's degree in Business Administration.",
    experience: "3-5 years of experience"
  },
  {
    title: "HR Recruiter",
    openings: 2,
    requirements: [
      "Source, screen, and recruit candidates for various positions within the organization.",
      "Conduct interviews and assessments to evaluate candidate qualifications.",
      "Coordinate with hiring managers to understand staffing needs and requirements."
    ],
    qualification: "Any Bachelor's degree.",
    experience: "1 year experience"
  },
  {
    title: "Digital Marketing",
    openings: 2,
    requirements: [
      "Develop and implement digital marketing strategies to drive online traffic to the company's website and social media platforms.",
      "Create and manage online advertising campaigns across digital channels such as Google Ads, social media ads, and email marketing."
    ],
    qualification: "Any Bachelor's degree.",
    experience: "Minimum 1 year experience"
  }
].map((item) => ({
  ...item,
  slug: slugify(item.title)
}));

type JobPostingSource = {
  title: string;
  requirements: string | string[];
  openings?: number | null;
  qualification?: string | null;
  experience?: string | null;
};

function normalizeCareerJob(job: JobPostingSource): CareerOpening {
  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : String(job.requirements)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    ...job,
    openings: job.openings ?? 1,
    qualification: job.qualification ?? "Qualification details will be shared during screening.",
    experience: job.experience ?? "Experience requirements will be shared during screening.",
    requirements,
    slug: slugify(job.title)
  };
}

function canQueryCareerOpenings() {
  return Boolean(process.env.DATABASE_URL && prisma.jobPosting);
}

export async function getCareerOpenings() {
  if (canQueryCareerOpenings()) {
    try {
      const jobPostings = await prisma.jobPosting.findMany({
        where: { isActive: true },
        orderBy: { postedAt: "desc" }
      });
      return jobPostings.map(normalizeCareerJob);
    } catch {
      return careerOpenings;
    }
  }

  return careerOpenings;
}

export async function getCareerBySlug(slug: string) {
  if (canQueryCareerOpenings()) {
    try {
      const jobPostings = await prisma.jobPosting.findMany({ where: { isActive: true } });
      const job = jobPostings.find((item) => slugify(item.title) === slug);
      return job ? normalizeCareerJob(job) : null;
    } catch {
      return careerOpenings.find((job) => job.slug === slug) ?? null;
    }
  }

  return careerOpenings.find((job) => job.slug === slug) ?? null;
}
