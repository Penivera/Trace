import type { ReactNode } from "react";

/**
 * Splits `"Sent {{20 SOL}} at {{02:43}}"` into plain text and highlighted spans.
 * A tiny markup instead of HTML in data, so content can never inject markup.
 */
export function renderHighlights(text: string, highlightClassName = "text-accent"): ReactNode[] {
  return text.split(/(\{\{.+?\}\})/g).map((part, i) =>
    part.startsWith("{{") && part.endsWith("}}") ? (
      <span key={i} className={highlightClassName}>
        {part.slice(2, -2)}
      </span>
    ) : (
      part
    ),
  );
}
