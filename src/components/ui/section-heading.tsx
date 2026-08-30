import { cx } from "@/components/ui/button";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className={cx("mb-4 text-xs font-bold uppercase tracking-[0.22em]", invert ? "text-white/55" : "text-brand")}>{eyebrow}</p>
      <h2 className={cx("display-font text-balance text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl", invert && "text-white")}>{title}</h2>
      {description ? <p className={cx("mt-5 max-w-2xl text-base leading-7 sm:text-lg", align === "center" && "mx-auto", invert ? "text-white/65" : "text-muted")}>{description}</p> : null}
    </div>
  );
}
