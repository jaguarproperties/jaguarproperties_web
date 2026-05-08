"use client";

import { useCallback } from "react";
import { useFormStatus } from "react-dom";

import { createOrUpdateProject } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyImageFields } from "@/components/admin/property-image-fields";
import { toast } from "@/components/ui/sonner";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-fit" disabled={pending}>
      {pending ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
    </Button>
  );
}

export function ProjectForm({ project }: { project?: Record<string, any> }) {
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const existingCoverImage = (form.elements.namedItem("existingCoverImage") as HTMLInputElement | null)?.value.trim();
    const mainImageFileInput = form.elements.namedItem("mainImageFile") as HTMLInputElement | null;
    const hasNewCoverImage = Boolean(mainImageFileInput?.files?.length);

    if (!existingCoverImage && !hasNewCoverImage) {
      event.preventDefault();
      toast.error("Please upload a main image before saving this project.");
    }
  }, []);

  const completionDateValue =
    project?.completionDate instanceof Date
      ? project.completionDate.toISOString().slice(0, 10)
      : typeof project?.completionDate === "string"
        ? project.completionDate.slice(0, 10)
        : "";

  return (
    <form
      action={createOrUpdateProject}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
      <input type="hidden" name="id" defaultValue={project?.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" placeholder="Project title" defaultValue={project?.title} required />
        <Input name="priceRange" placeholder="Price range" defaultValue={project?.priceRange} required />
      </div>
      <Textarea name="summary" placeholder="Short summary" defaultValue={project?.summary} required rows={3} />
      <Textarea name="description" placeholder="Full description" defaultValue={project?.description} required rows={6} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="city" placeholder="City" defaultValue={project?.city} required />
        <Input name="location" placeholder="Location" defaultValue={project?.location} required />
        <Input name="country" placeholder="Country" defaultValue={project?.country} required />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <Select name="status" defaultValue={project?.status ?? "LAUNCHING"}>
          <option value="UPCOMING" className="bg-zinc-950">UPCOMING</option>
          <option value="LAUNCHING" className="bg-zinc-950">LAUNCHING</option>
          <option value="COMPLETED" className="bg-zinc-950">COMPLETED</option>
        </Select>
        <Input name="completionDate" type="date" defaultValue={completionDateValue} />
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
          <Checkbox name="featured" defaultChecked={project?.featured} />
          Featured
        </label>
      </div>
      <PropertyImageFields
        coverImage={project?.coverImage}
        gallery={project?.gallery}
        title={project?.title}
        entityLabel="project"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="seoTitle" placeholder="SEO title (optional)" defaultValue={project?.seoTitle ?? ""} />
        <Input name="seoDescription" placeholder="SEO description (optional)" defaultValue={project?.seoDescription ?? ""} />
      </div>
      <SubmitButton isEditing={Boolean(project)} />
    </form>
  );
}
