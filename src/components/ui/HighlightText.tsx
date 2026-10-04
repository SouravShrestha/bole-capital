type Props = {
  text: string;
  query: string;
};

const MARK_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(var(--fg-rgb), 0.15)",
  color: "var(--fg)",
  fontWeight: 700,
  fontStyle: "italic",
  borderRadius: "2px",
  padding: "0 2px",
};

/** Renders `text` with every case-insensitive match of `query` wrapped in a bold, italic <mark>. */
export function HighlightText({ text, query }: Props) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} style={MARK_STYLE}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
