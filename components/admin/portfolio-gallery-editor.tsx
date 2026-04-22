"use client";

import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseGalleryItems } from "@/lib/site-content";

type GalleryRow = {
  image: string;
  title: string;
  text: string;
};

function serializeRows(rows: GalleryRow[]) {
  return rows
    .map((row) => [row.image.trim(), row.title.trim(), row.text.trim()].join("|"))
    .filter((line) => line !== "||")
    .join("\n");
}

export function PortfolioGalleryEditor({ defaultValue }: { defaultValue?: string | null }) {
  const initialRows = parseGalleryItems(defaultValue).length
    ? parseGalleryItems(defaultValue)
    : [{ image: "", title: "", text: "" }];

  const [rows, setRows] = useState<GalleryRow[]>(initialRows);
  const [serializedValue, setSerializedValue] = useState(serializeRows(initialRows));
  const baseId = useId();

  useEffect(() => {
    setSerializedValue(serializeRows(rows));
  }, [rows]);

  function updateRow(index: number, field: keyof GalleryRow, value: string) {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, { image: "", title: "", text: "" }]);
  }

  function removeRow(index: number) {
    setRows((currentRows) => {
      if (currentRows.length === 1) {
        return [{ image: "", title: "", text: "" }];
      }

      return currentRows.filter((_, rowIndex) => rowIndex !== index);
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="portfolioGallery" value={serializedValue} />

      {rows.map((row, index) => {
        const imageInputId = `${baseId}-portfolio-gallery-image-${index}`;

        return (
          <div key={imageInputId} className="rounded-[24px] border border-white/10 bg-black/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Gallery image {index + 1}</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(index)}>
                Remove
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <Input
                id={imageInputId}
                value={row.image}
                placeholder="Image path or URL"
                onChange={(event) => updateRow(index, "image", event.target.value)}
              />
              <Input
                value={row.title}
                placeholder="Gallery title"
                onChange={(event) => updateRow(index, "title", event.target.value)}
              />
              <Textarea
                value={row.text}
                placeholder="Gallery description"
                rows={3}
                onChange={(event) => updateRow(index, "text", event.target.value)}
              />
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={addRow}>
          Add gallery image
        </Button>
        <p className="text-xs leading-6 text-zinc-400">
          Each card updates the public Portfolio page. Use a static path like `/images/example.jpg` or a full URL, then add the title and description.
        </p>
      </div>
    </div>
  );
}
