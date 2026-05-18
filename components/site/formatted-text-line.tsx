import { Fragment } from "react";

import { TranslateText } from "@/components/site/translate-text";
import { parseInlineTextSegments } from "@/lib/site-content";

export function FormattedTextLine({ text }: { text: string }) {
  const segments = parseInlineTextSegments(text);

  if (!segments.length) {
    return null;
  }

  return (
    <>
      {segments.map((segment, index) => {
        const content = <TranslateText text={segment.text} />;

        if (segment.bold) {
          return (
            <strong key={`${segment.text}-${index}`} className="font-semibold text-foreground dark:text-white">
              {content}
            </strong>
          );
        }

        return <Fragment key={`${segment.text}-${index}`}>{content}</Fragment>;
      })}
    </>
  );
}
