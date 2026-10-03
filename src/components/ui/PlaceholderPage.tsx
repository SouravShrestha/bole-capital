type Props = {
  title: string;
  description?: string;
  tag?: string;
};

export function PlaceholderPage({
  title,
  description,
  tag = "Coming Soon",
}: Props) {
  return (
    <main
      className="flex flex-col items-center justify-center px-8 py-24 text-center bg-(--bg)"
      style={{
        minHeight: "calc(100vh - 68px)",
        color: "var(--fg)",
      }}
    >
      <div className="max-w-2xl">
        <p
          className="text-xs tracking-widest uppercase mb-8 opacity-40"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          {tag}
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-uber-bold), sans-serif" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="text-base md:text-lg leading-relaxed opacity-55 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>
    </main>
  );
}
