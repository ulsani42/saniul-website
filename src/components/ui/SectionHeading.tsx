interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 md:mb-16 ${
        align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {eyebrow && (
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
          {eyebrow}
        </p>
      )}
      <h2 className="text-editorial text-3xl md:text-4xl lg:text-5xl text-ink font-medium mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light ${
          align === 'center' ? 'mx-auto' : ''
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
