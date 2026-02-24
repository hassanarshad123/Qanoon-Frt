/**
 * Strip common markdown formatting from text.
 * Acts as a safety net for residual markdown from Claude output.
 */
export function stripMarkdown(text: string): string {
  return (
    text
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      // Italic: *text* or _text_ (but not mid-word underscores like case_number)
      .replace(/(?<!\w)\*(.+?)\*(?!\w)/g, "$1")
      .replace(/(?<!\w)_(.+?)_(?!\w)/g, "$1")
      // Headings: ## heading
      .replace(/^#{1,6}\s+/gm, "")
      // Inline code: `code`
      .replace(/`([^`]+)`/g, "$1")
      // Code fences: ```...```
      .replace(/```[\s\S]*?```/g, (match) =>
        match.replace(/^```\w*\n?/, "").replace(/\n?```$/, "")
      )
  );
}
