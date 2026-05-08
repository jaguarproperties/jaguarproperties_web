import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { canEditContent } from "@/lib/permissions";
import { saveTestimonialImageToMongo } from "@/lib/testimonial-images";

export const runtime = "nodejs";

function isAllowedTestimonialImageType(file: File) {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"].includes(file.type);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !(await canEditContent(session.user.role as UserRole))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!isAllowedTestimonialImageType(file)) {
      return NextResponse.json(
        { error: "Please upload JPG, PNG, WebP, or GIF images for testimonials." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Testimonial images must be smaller than 8 MB each." }, { status: 400 });
    }

    const url = await saveTestimonialImageToMongo(file);

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload testimonial image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
