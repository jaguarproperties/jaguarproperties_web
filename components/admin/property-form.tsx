import { createOrUpdateProperty } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyImageFields } from "@/components/admin/property-image-fields";

export function PropertyForm({
  property,
  projects
}: {
  property?: Record<string, any>;
  projects: Array<{ id: string; title: string }>;
}) {
  return (
    <form
      action={createOrUpdateProperty}
      encType="multipart/form-data"
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
      <input type="hidden" name="id" defaultValue={property?.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" placeholder="Title" defaultValue={property?.title} required />
        <Input name="price" placeholder="Price" defaultValue={property?.price} required />
      </div>
      <Textarea name="description" placeholder="Description" defaultValue={property?.description} required />
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="city" placeholder="City" defaultValue={property?.city} required />
        <Input name="location" placeholder="Location" defaultValue={property?.location} required />
        <Input name="address" placeholder="Address" defaultValue={property?.address} required />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Input name="bedrooms" type="number" placeholder="Bedrooms" defaultValue={property?.bedrooms} />
        <Input name="bathrooms" type="number" placeholder="Bathrooms" defaultValue={property?.bathrooms} />
        <Input name="areaSqFt" type="number" placeholder="Area (sq ft)" defaultValue={property?.areaSqFt} />
        <Select name="status" defaultValue={property?.status ?? "AVAILABLE"}>
          <option className="bg-zinc-950">AVAILABLE</option>
          <option className="bg-zinc-950">SOLD</option>
          <option className="bg-zinc-950">HOLD</option>
        </Select>
      </div>
      <PropertyImageFields
        coverImage={property?.coverImage}
        gallery={property?.gallery}
        title={property?.title}
      />
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Select name="projectId" defaultValue={property?.projectId ?? ""}>
          <option value="" className="bg-zinc-950">
            No linked project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id} className="bg-zinc-950">
              {project.title}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
          <Checkbox name="featured" defaultChecked={property?.featured} />
          Featured
        </label>
      </div>
      <Button type="submit" className="w-fit">
        {property ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
}
