import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const buttonBase =
  "focus-ring motion-hover-lift inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 heading-font";

const buttonVariants = {
  primary: "bg-[#7E1518] text-white hover:bg-[#681114]",
  gold: "bg-[#D6A13A] text-[#241718] hover:bg-[#c28e28]",
  soft: "bg-[#F5E7E8] text-[#7E1518] hover:bg-[#eed6d8]",
  outline:
    "border border-[#7E1518]/25 bg-white text-[#7E1518] hover:bg-[#F5E7E8]",
  ghost: "text-[#7E1518] hover:bg-[#F5E7E8]",
};

type ButtonVariant = keyof typeof buttonVariants;

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  ariaLabel,
  type = "button",
}: ButtonProps) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${className}`;

  if (href) {
    return (
      <a className={classes} href={href} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`motion-hover-lift rounded-3xl border border-[#eadfda] bg-white p-6 card-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  inverse?: boolean;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? (
        <p className="heading-font mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#D6A13A]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`heading-font text-3xl font-extrabold tracking-tight md:text-4xl ${inverse ? "text-white" : "text-[#7E1518]"}`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-lg leading-8 ${inverse ? "text-white/75" : "text-[#5d4b4c]"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "burgundy",
}: {
  children: ReactNode;
  tone?: "burgundy" | "gold" | "rose" | "sage" | "navy" | "sky";
}) {
  const tones = {
    burgundy: "bg-[#F5E7E8] text-[#7E1518]",
    gold: "bg-[#FBF2DF] text-[#7a5311]",
    rose: "bg-[#F8EAEB] text-[#B94A4E]",
    sage: "bg-[#EDF3EB] text-[#486142]",
    navy: "bg-[#E9EDF6] text-[#1F2A44]",
    sky: "bg-[#EFF8FE] text-[#25638e]",
  };

  return (
    <span
      className={`heading-font inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function InputPreview() {
  return (
    <div className="space-y-3">
      <label
        className="heading-font text-sm font-bold text-[#241718]"
        htmlFor="school-email"
      >
        School email
      </label>
      <input
        id="school-email"
        className="focus-ring w-full rounded-2xl border border-[#eadfda] bg-white px-4 py-3 text-[#241718] placeholder:text-[#9b898a]"
        placeholder="name@millennia21.id"
      />
      <p className="text-sm text-[#6f6061]">
        Use clear helper text so users know what to do next.
      </p>
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "burgundy",
}: {
  value: number;
  tone?: "burgundy" | "gold" | "sage" | "rose" | "navy";
}) {
  const tones = {
    burgundy: "bg-[#7E1518]",
    gold: "bg-[#D6A13A]",
    sage: "bg-[#6F8B6A]",
    rose: "bg-[#B94A4E]",
    navy: "bg-[#1F2A44]",
  };

  return (
    <div
      className="h-3 overflow-hidden rounded-full bg-[#f1e7e2]"
      aria-label={`${value}% complete`}
    >
      <div
        className={`motion-progress-grow h-full rounded-full ${tones[tone]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function EmptyStatePreview() {
  return (
    <div className="rounded-3xl border border-dashed border-[#D6A13A]/70 bg-[#FBF2DF]/60 p-6 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white text-[#D6A13A]">
        <CheckCircle2 size={24} />
      </div>
      <h3 className="heading-font text-lg font-bold text-[#7E1518]">
        No reflections yet
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#5d4b4c]">
        Once students begin sharing their check-ins, their wellbeing patterns
        will appear here.
      </p>
    </div>
  );
}

export function LinkButton({ children }: { children: ReactNode }) {
  return (
    <a
      className="heading-font inline-flex items-center gap-2 text-sm font-bold text-[#7E1518]"
      href="#implementation"
    >
      {children} <ArrowRight size={16} />
    </a>
  );
}
