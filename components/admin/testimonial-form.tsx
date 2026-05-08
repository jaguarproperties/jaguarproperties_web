"use client";

import { useState } from "react";

import { createOrUpdateTestimonial } from "@/app/actions";
import { SingleImageUploadField } from "@/components/admin/single-image-upload-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TestimonialForm({ testimonial }: { testimonial?: Record<string, any> }) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  return (
    <form action={createOrUpdateTestimonial} className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6">
      <input type="hidden" name="id" defaultValue={testimonial?.id} />
      <Input name="name" placeholder="Client name" defaultValue={testimonial?.name} required />
      <Textarea
        name="message"
        placeholder="Client message"
        defaultValue={testimonial?.message}
        required
        className="min-h-[160px]"
      />
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
        <Checkbox name="published" defaultChecked={testimonial?.published ?? true} />
        Published on homepage
      </label>
      <SingleImageUploadField
        existingImage={testimonial?.image}
        existingInputName="existingImage"
        fileInputName="imageFile"
        label="Client image"
        description="Shown on the testimonial card on the homepage."
        emptyText="No client image selected"
        alt="Client testimonial image preview"
        uploadEndpoint="/api/testimonials/upload"
        onUploadStateChange={setIsUploadingImage}
      />
      <Button type="submit" className="w-fit" disabled={isUploadingImage}>
        {isUploadingImage
          ? "Uploading image..."
          : testimonial
            ? "Update Testimonial"
            : "Add Testimonial"}
      </Button>
    </form>
  );
}
