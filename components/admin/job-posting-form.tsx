"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type JobPostingFormValues = {
  id?: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  openings: number;
  qualification: string;
  experience: string;
  salary: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  postedAt: string;
  isActive: boolean;
};

export function JobPostingForm({ posting, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState<JobPostingFormValues>(
    posting || {
      title: "",
      department: "",
      location: "",
      description: "",
      requirements: "",
      openings: 1,
      qualification: "",
      experience: "",
      salary: "",
      type: "FULL_TIME",
      postedAt: new Date().toISOString().split("T")[0],
      isActive: true
    }
  );

  return (
    <form action={onSubmit} className="space-y-6">
      {formData.id ? <input type="hidden" name="id" value={formData.id} /> : null}

      <div>
        <label className="block text-sm font-medium text-zinc-200">Job Title</label>
        <Input
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Senior React Developer"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-200">Department</label>
          <Input
            name="department"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g., Engineering"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Location</label>
          <Input
            name="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Bengaluru, India"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Job Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the role and responsibilities..."
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Requirements</label>
        <Textarea
          name="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="Write each requirement on a new line."
          rows={5}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-zinc-200">Openings</label>
          <Input
            name="openings"
            type="number"
            min={1}
            value={formData.openings}
            onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value || 1) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Qualification</label>
          <Input
            name="qualification"
            type="text"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g., Bachelor's degree"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Experience</label>
          <Input
            name="experience"
            type="text"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="e.g., 2+ years"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-zinc-200">Salary Range</label>
          <Input
            name="salary"
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="e.g., 50K - 80K USD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Employment Type</label>
          <Select
            name="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as JobPostingFormValues["type"]
              })
            }
          >
            <option value="FULL_TIME" className="bg-zinc-950">
              Full Time
            </option>
            <option value="PART_TIME" className="bg-zinc-950">
              Part Time
            </option>
            <option value="CONTRACT" className="bg-zinc-950">
              Contract
            </option>
            <option value="INTERNSHIP" className="bg-zinc-950">
              Internship
            </option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Status</label>
          <Select
            name="isActive"
            value={String(formData.isActive)}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
          >
            <option value="true" className="bg-zinc-950">
              Active
            </option>
            <option value="false" className="bg-zinc-950">
              Inactive
            </option>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : posting ? "Update Job Posting" : "Create Job Posting"}
      </Button>
    </form>
  );
}
