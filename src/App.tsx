import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Heart,
  Image,
  Leaf,
  Lightbulb,
  Menu,
  Moon,
  Palette,
  Search,
  Sun,
  X,
} from "lucide-react";
import {
  agentDecisionFlow,
  agentDoDont,
  aiAgentBrief,
  animationGuidelines,
  animationPatterns,
  checklist,
  colors,
  componentGroups,
  foundations,
  metricCards,
  pageTemplates,
  productExamples,
  statuses,
  values,
} from "./data/uiKit";
import { headerBackdropClassName } from "./components/classNames";
import {
  CommandPalette,
  type CommandPaletteItem,
} from "./components/CommandPalette";
import {
  Badge,
  Button,
  Card,
  EmptyStatePreview,
  InputPreview,
  ProgressBar,
  SectionHeader,
} from "./components/UIPrimitives";
import { MwsLogo } from "./components/MwsLogo";

const foundationThemes = [
  "bg-brand-rose-soft text-brand-rose",
  "bg-brand-sky-soft text-brand-sky",
  "bg-brand-navy-soft text-brand-navy",
  "bg-brand-sage-soft text-status-success",
];

const componentGroupThemes = [
  "border-status-error bg-brand-rose-soft text-brand-rose",
  "border-status-success bg-brand-sage-soft text-status-success",
  "border-brand bg-brand-navy-soft text-brand-navy",
  "border-status-info bg-brand-sky-soft text-brand-sky",
];

const productBackgrounds = [
  "var(--mws-color-brand-sky-soft)",
  "var(--mws-color-brand-rose-soft)",
  "var(--mws-color-brand-sage-soft)",
  "var(--mws-color-brand-navy-soft)",
];
const templateIconThemes = [
  "text-brand-rose",
  "text-brand-sage",
  "text-brand-navy",
  "text-brand-gold-strong",
  "text-brand-sky",
  "text-brand",
];
const metricIconThemes = [
  "text-brand-sky",
  "text-brand-gold-strong",
  "text-brand-sage",
];

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mws-theme", theme);
  }, [theme]);

  const jumpToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  const commandItems: CommandPaletteItem[] = [
    {
      id: "top",
      label: "Go to hero",
      description: "Jump to the top of the UI kit homepage",
      keywords: ["home", "start", "intro"],
      group: "Navigate",
      icon: <Compass className="size-4" />,
      onSelect: () => jumpToSection("top"),
    },
    {
      id: "ai-guide",
      label: "Open AI guide",
      description: "Read the coding agent quick start",
      keywords: ["agent", "rules", "llm"],
      group: "Navigate",
      icon: <Bot className="size-4" />,
      onSelect: () => jumpToSection("ai-guide"),
    },
    {
      id: "foundations",
      label: "Open foundations",
      description: "Review design direction and values",
      keywords: ["principles", "values"],
      group: "Navigate",
      icon: <Heart className="size-4" />,
      onSelect: () => jumpToSection("foundations"),
    },
    {
      id: "logo",
      label: "Open logo guidelines",
      description: "Review the official MWS logo configurations",
      keywords: ["brand", "crest", "wordmark", "identity"],
      group: "Navigate",
      icon: <Image className="size-4" />,
      onSelect: () => jumpToSection("logo"),
    },
    {
      id: "tokens",
      label: "Open tokens",
      description: "View color and brand token guidance",
      keywords: ["brand", "color", "design tokens"],
      group: "Navigate",
      icon: <Palette className="size-4" />,
      onSelect: () => jumpToSection("tokens"),
    },
    {
      id: "components",
      label: "Open components",
      description: "Explore reusable component guidance",
      keywords: ["primitives", "patterns"],
      group: "Navigate",
      icon: <BookOpen className="size-4" />,
      onSelect: () => jumpToSection("components"),
    },
    {
      id: "motion",
      label: "Open motion",
      description: "Review animation principles and previews",
      keywords: ["animation", "movement"],
      group: "Navigate",
      icon: <Lightbulb className="size-4" />,
      onSelect: () => jumpToSection("motion"),
    },
    {
      id: "examples",
      label: "Open examples",
      description: "See product references and school contexts",
      keywords: ["products", "apps"],
      group: "Navigate",
      icon: <ClipboardCheck className="size-4" />,
      onSelect: () => jumpToSection("examples"),
    },
    {
      id: "consumers",
      label: "Open consumer guide",
      description: "Review v0.2.0 package usage and release notes",
      keywords: ["package", "exports", "release", "semver", "modal"],
      group: "Navigate",
      icon: <BookOpen className="size-4" />,
      onSelect: () => jumpToSection("consumers"),
    },
  ];

  return (
    <main className="min-h-screen bg-surface-base text-primary">
      <Navigation
        theme={theme}
        onToggleTheme={() =>
          setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
          )
        }
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        items={commandItems}
      />
      <Hero />
      <AiAgentGuide />
      <Foundations />
      <LogoGuidelines />
      <BrandTokens />
      <TypographySection />
      <ComponentSystem />
      <AnimationKit />
      <PatternsPreview />
      <ProductExamples />
      <Templates />
      <ConsumerGuidance />
      <FinalChecklist />
      <Footer />
    </main>
  );
}

function Navigation({
  theme,
  onToggleTheme,
  onOpenCommandPalette,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    "AI Guide",
    "Foundations",
    "Logo",
    "Tokens",
    "Components",
    "Motion",
    "Examples",
    "Consumers",
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--mws-color-border-subtle)_80%,transparent)] ${headerBackdropClassName}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-surface-card p-1 shadow-lg shadow-brand">
            <MwsLogo
              variant="crest"
              className="h-full w-auto object-contain"
              loading="eager"
            />
          </div>
          <div>
            <p className="heading-font text-sm font-extrabold tracking-wide text-brand">
              MWS
            </p>
            <p className="text-xs text-tertiary">Heart & Purpose UI Kit</p>
          </div>
        </a>
        <div className="hidden items-center gap-4 xl:flex">
          {links.map((link) => (
            <a
              key={link}
              className="heading-font text-sm font-bold text-secondary transition hover:text-brand"
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-subtle bg-surface-card text-secondary transition hover:bg-brand-primary-soft hover:text-brand"
            type="button"
            aria-label="Dark theme"
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
          >
            {theme === "light" ? (
              <Moon size={18} aria-hidden="true" />
            ) : (
              <Sun size={18} aria-hidden="true" />
            )}
          </button>
          <button
            className="focus-ring heading-font inline-flex min-h-11 items-center gap-2 rounded-full border border-subtle bg-surface-card px-3 text-sm font-bold text-secondary transition hover:bg-brand-primary-soft hover:text-brand"
            type="button"
            aria-label="Search and navigate"
            aria-haspopup="dialog"
            onClick={onOpenCommandPalette}
          >
            <Search size={18} aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden rounded-lg border border-subtle bg-surface-base px-2 py-1 text-xs text-tertiary xl:inline">
              ⌘K
            </kbd>
          </button>
          <button
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-subtle bg-surface-card text-brand xl:hidden"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-subtle bg-surface-base px-5 py-4 xl:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            {links.map((link) => (
              <a
                key={link}
                className="focus-ring heading-font rounded-2xl px-4 py-3 text-sm font-bold text-secondary hover:bg-surface-card hover:text-brand"
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const [selectedEmotion, setSelectedEmotion] = useState("🙂");

  return (
    <section id="top" className="relative px-5 py-16 md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative">
          <Badge tone="gold">
            Millennia World School digital design system
          </Badge>
          <h1 className="heading-font mt-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-[-0.04em] text-primary md:text-7xl">
            Growing with <span className="text-brand">heart</span>,{" "}
            <span className="text-brand-sage">purpose</span>, and{" "}
            <span className="text-brand-gold-strong">joy</span> across every MWS app.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-secondary">
            A warm, accessible, developer-ready UI kit for MAD Labs products:
            reading, wellbeing, student support, performance, communication, and
            future school systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#components">
              Explore components <ArrowRight size={18} />
            </Button>
            <Button href="#tokens" variant="outline">
              View brand tokens
            </Button>
            <Button href="#motion" variant="soft">
              See motion kit
            </Button>
          </div>
          <blockquote className="quote-font mt-10 max-w-2xl border-l-4 border-[var(--mws-color-brand-gold)] pl-5 text-2xl leading-10 text-primary">
            “Every design should help people feel that MWS is a place where
            goodness grows.”
          </blockquote>
        </div>
        <div className="relative motion-fade-up">
          <div className="soft-shadow rounded-[2rem] border border-subtle bg-surface-card p-4">
            <div className="rounded-[1.5rem] border border-status-info bg-gradient-to-br from-[var(--mws-color-brand-sky-soft)] via-[var(--mws-color-surface-card)] to-[var(--mws-color-brand-sage-soft)] p-5 text-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="heading-font text-sm font-bold text-brand">
                      MWS Dashboard
                    </p>
                    <Badge tone="navy">Sample data</Badge>
                  </div>
                  <h2 className="heading-font mt-2 text-2xl font-extrabold text-brand-navy">
                    Welcome back, Ms. Sarah
                  </h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-gold-soft text-brand-gold-strong">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-4 leading-7 text-secondary">
                Today’s focus: guide with compassion, review evidence, and
                celebrate meaningful growth.
              </p>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-3">
              {metricCards.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-3xl bg-surface-base p-5"
                  >
                    <Icon className={metricIconThemes[index]} size={24} />
                    <p className="heading-font mt-4 text-3xl font-extrabold text-brand">
                      {metric.value}
                    </p>
                    <p className="heading-font mt-1 text-sm font-bold text-primary">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-tertiary">
                      {metric.detail}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-4 px-4 pb-4 md:grid-cols-[1fr_0.8fr]">
              <Card className="shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge tone="sage">Growing support</Badge>
                    <h3 className="heading-font mt-4 text-xl font-bold text-primary">
                      Student support plan
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-tertiary">
                      Mentor check-in, reading reflection, and classroom
                      strategy review.
                    </p>
                  </div>
                  <Leaf className="text-brand-sage" />
                </div>
                <div className="mt-5 space-y-3">
                  <ProgressBar value={68} tone="sage" />
                  <p className="text-sm text-tertiary">
                    68% review cycle complete
                  </p>
                </div>
              </Card>
              <Card className="shadow-none">
                <Badge tone="rose">Wellbeing</Badge>
                <h3 className="heading-font mt-4 text-xl font-bold">
                  How are you feeling today?
                </h3>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xl">
                  {["😊", "🙂", "😐", "😟"].map((emotion) => (
                    <button
                      key={emotion}
                      className={`focus-ring rounded-2xl p-3 transition hover:bg-[var(--mws-color-brand-primary-softer)] ${
                        selectedEmotion === emotion
                          ? "bg-brand-primary text-inverse"
                          : "bg-brand-rose-soft"
                      }`}
                      type="button"
                      aria-pressed={selectedEmotion === emotion}
                      aria-label={`Select ${emotion} feeling`}
                      onClick={() => setSelectedEmotion(emotion)}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
                <p
                  className="mt-3 text-sm leading-6 text-tertiary"
                  aria-live="polite"
                >
                  Selected feeling: {selectedEmotion}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiAgentGuide() {
  return (
    <section id="ai-guide" className="bg-surface-card px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <Badge tone="navy">AI agent quick start</Badge>
            <h2 className="heading-font mt-5 text-4xl font-extrabold tracking-tight text-brand">
              Build from the compact rules first
            </h2>
            <p className="mt-5 text-lg leading-8 text-secondary">
              This UI kit is expected to be read by coding agents as much as
              humans. Use this section as the fastest path to the right files,
              decisions, and guardrails before changing any product screen.
            </p>
          </div>
          <div className="rounded-3xl border border-subtle bg-surface-base p-5">
            <p className="heading-font text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Canonical agent path
            </p>
            <ol className="mt-4 grid gap-3">
              {agentDecisionFlow.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-2xl bg-surface-card p-4"
                >
                  <span className="heading-font flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy-soft text-sm font-extrabold text-brand-navy">
                    {index + 1}
                  </span>
                  <p className="leading-7 text-secondary">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-brand bg-brand-navy-soft shadow-none" padding="spacious">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-surface-card text-brand-navy">
                <Bot size={24} />
              </div>
              <Badge tone="navy">{aiAgentBrief[0].label}</Badge>
            </div>
            <h3 className="heading-font mt-6 text-3xl font-extrabold text-primary">
              {aiAgentBrief[0].title}
            </h3>
            <p className="mt-4 max-w-2xl leading-7 text-secondary">
              {aiAgentBrief[0].detail}
            </p>
            <code className="mt-6 block rounded-2xl bg-code px-4 py-3 text-sm leading-6 text-on-dark">
              {aiAgentBrief[0].source}
            </code>
          </Card>
          <div className="grid gap-3">
            {aiAgentBrief.slice(1).map((item) => (
              <div
                key={item.title}
                className="grid gap-3 rounded-3xl border border-subtle bg-surface-base p-5 sm:grid-cols-[auto_1fr]"
              >
                <Badge tone="sky" className="self-start">
                  {item.label}
                </Badge>
                <div>
                  <h3 className="heading-font font-bold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-tertiary">
                    {item.detail}
                  </p>
                  <code className="mt-3 block text-xs font-semibold text-brand">
                    {item.source}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card className="shadow-none">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="text-brand-sage" size={24} />
              <h3 className="heading-font text-2xl font-bold text-primary">
                Agent do
              </h3>
            </div>
            <div className="mt-5 grid gap-3">
              {agentDoDont.do.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-brand-sage-soft p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-brand-sage"
                    size={19}
                  />
                  <p className="leading-7 text-status-success">{item}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="shadow-none">
            <div className="flex items-center gap-3">
              <X className="text-brand-rose" size={24} />
              <h3 className="heading-font text-2xl font-bold text-primary">
                Agent do not
              </h3>
            </div>
            <div className="mt-5 grid gap-3">
              {agentDoDont.dont.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-brand-rose-soft p-4"
                >
                  <X className="mt-0.5 shrink-0 text-brand-rose" size={18} />
                  <p className="leading-7 text-brand">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Foundations() {
  return (
    <section id="foundations" className="px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Design direction"
        title="Compassionate, clear, and school-ready"
        description="The UI kit turns MWS values into reusable product decisions: warm tone, calm layouts, meaningful color, and evidence-based workflows."
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {foundations.map((item, index) => {
          const Icon = item.icon;
          if (index === 0) {
            return (
              <Card
                key={item.title}
                className="border-brand bg-brand-primary-soft lg:row-span-3"
                padding="spacious"
              >
                <div
                  className={`mb-8 flex size-16 items-center justify-center rounded-3xl ${foundationThemes[index]}`}
                >
                  <Icon size={30} />
                </div>
                <p className="heading-font text-sm font-bold uppercase tracking-[0.18em] text-brand">
                  Lead principle
                </p>
                <h3 className="heading-font mt-4 text-3xl font-extrabold text-primary">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-xl text-lg leading-8 text-secondary">
                  {item.description}
                </p>
              </Card>
            );
          }

          return (
            <div
              key={item.title}
              className="flex gap-5 rounded-3xl border border-subtle bg-surface-card p-6"
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${foundationThemes[index]}`}
              >
                <Icon size={24} />
              </div>
              <div>
                <h3 className="heading-font text-xl font-bold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 leading-7 text-tertiary">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LogoGuidelines() {
  const logoVariants = [
    {
      variant: "vertical" as const,
      name: "Vertical lockup",
      description:
        "Use for covers, welcome screens, posters, formal documents, and centered compositions with generous vertical space.",
      previewClassName: "mx-auto h-80 max-w-full",
      frameClassName: "min-h-[25rem]",
    },
    {
      variant: "horizontal" as const,
      name: "Horizontal lockup",
      description:
        "Preferred for website headers, navigation, presentations, email signatures, and other wide layouts.",
      previewClassName: "w-full max-w-3xl",
      frameClassName: "min-h-64",
    },
    {
      variant: "crest" as const,
      name: "Crest mark",
      description:
        "Use in compact spaces such as app icons, avatars, badges, profile marks, and square identity placements.",
      previewClassName: "h-72 max-w-full",
      frameClassName: "min-h-[25rem]",
    },
  ];

  return (
    <section id="logo" className="bg-surface-card px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Brand identity"
        title="The official MWS logo system"
        description="Choose the configuration that best fits the available space. Keep the artwork proportional, preserve clear space around it, and never redraw, stretch, recolor, crop, or rearrange its elements."
      />

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        {logoVariants.map((logo, index) => (
          <Card
            key={logo.variant}
            className={`overflow-hidden shadow-none ${
              index === 1 ? "lg:col-span-2" : ""
            }`}
          >
            <div
              className={`flex ${logo.frameClassName} items-center justify-center rounded-[1.75rem] border border-subtle bg-white p-6 md:p-10`}
            >
              <MwsLogo
                variant={logo.variant}
                title={`Millennia World School ${logo.name}`}
                className={`${logo.previewClassName} object-contain`}
              />
            </div>
            <div className="mt-6 flex items-start gap-4">
              <span className="heading-font flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-extrabold text-inverse">
                {index + 1}
              </span>
              <div>
                <h3 className="heading-font text-xl font-bold text-primary">
                  {logo.name}
                </h3>
                <p className="mt-2 leading-7 text-tertiary">
                  {logo.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-5 md:grid-cols-3">
        {[
          ["Clear space", "Keep clear space around every logo at least equal to the height of the word MILLENNIA in the crest."],
          ["Minimum size", "Use the crest no smaller than 40 px wide. At smaller sizes, use a simplified approved asset rather than removing details."],
          ["Approved color", "Use the official Burgundy and White artwork on a clean, high-contrast background. Do not apply effects or alternate colors."],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-3xl border border-subtle bg-surface-base p-6"
          >
            <h3 className="heading-font font-bold text-brand">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-tertiary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BrandTokens() {
  return (
    <section id="tokens" className="bg-surface-card px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Brand tokens"
        title="A controlled palette for warm digital products"
        description="White keeps screens breathable, Burgundy anchors the brand, Charcoal keeps text readable, Gold highlights joyful meaning, and secondary colors support specific school contexts."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {colors.map((color) => (
          <Card key={color.name} className="shadow-none">
            <div
              className={`h-28 rounded-3xl ${
                color.bordered ? "border border-subtle" : ""
              }`}
              style={{ background: color.cssVar }}
            />
            <div className="mt-5">
              <h3 className="heading-font text-lg font-bold text-primary">
                {color.name}
              </h3>
              <p className="heading-font mt-1 text-sm font-bold text-brand">
                {color.hex}
              </p>
              <p className="mt-3 text-sm leading-6 text-tertiary">
                {color.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TypographySection() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Typography"
        title="Three Google Fonts, each with a clear role"
        description="Plus Jakarta Sans gives structure, Nunito Sans keeps communication friendly, and Lora adds thoughtful emphasis for values and quotes."
      />
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-subtle bg-surface-card">
        <div className="grid gap-6 border-b border-subtle p-6 md:grid-cols-[12rem_1fr] md:p-8">
          <Badge className="self-start">Headlines</Badge>
          <div>
            <p className="heading-font text-4xl font-extrabold leading-tight text-brand md:text-5xl">
              Plus Jakarta Sans
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-tertiary">
              Use for hero headlines, page titles, section headings, buttons,
              labels, and product navigation.
            </p>
          </div>
        </div>
        <div className="grid gap-6 border-b border-subtle bg-surface-base p-6 md:grid-cols-[12rem_1fr] md:p-8">
          <Badge tone="sage" className="self-start">Body text</Badge>
          <div>
            <p className="body-font text-3xl font-bold leading-tight text-primary md:text-4xl">
              Nunito Sans keeps long reading comfortable.
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-tertiary">
              Use for parent letters, reports, captions, card descriptions, and
              long-form interface copy.
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[12rem_1fr] md:p-8">
          <Badge tone="gold" className="self-start">Quotes</Badge>
          <div>
            <p className="quote-font text-3xl leading-snug text-primary md:text-4xl">
              “Goodness grows through thoughtful choices.”
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-tertiary">
              Use Lora Medium Italic sparingly for mission lines, reflection
              prompts, invitations, and philosophical statements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComponentSystem() {
  return (
    <section
      id="components"
      className="bg-gradient-to-br from-[var(--mws-color-brand-sky-soft)] via-[var(--mws-color-surface-card)] to-[var(--mws-color-brand-rose-soft)] px-5 py-20 lg:px-8"
    >
      <SectionHeader
        eyebrow="Component system"
        title="Reusable building blocks for every MAD Labs app"
        description="The kit includes base components, role-aware layouts, dashboard patterns, and MWS-specific education components. Secondary colors carry product meaning while Burgundy remains the shared anchor."
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-4">
        {componentGroups.map((group, index) => (
          <div
            key={group.title}
            className={`rounded-3xl border p-6 card-shadow ${componentGroupThemes[index]}`}
          >
            <h3 className="heading-font text-xl font-bold">{group.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="heading-font rounded-full bg-[color-mix(in_srgb,var(--mws-color-surface-card)_80%,transparent)] px-3 py-1 text-xs font-bold text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimationKit() {
  const [interactionCount, setInteractionCount] = useState(0);

  return (
    <section
      id="motion"
      className="bg-surface-card px-5 py-20 lg:px-8"
      aria-labelledby="animation-kit-title"
    >
      <SectionHeader
        eyebrow="Animation kit"
        title="Calm motion for meaningful design feedback"
        description="Use the motion utilities to make MWS interfaces feel alive while keeping them readable, gentle, and accessible. The live preview below shows how design elements animate on the homepage."
      />
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden bg-gradient-to-br from-[var(--mws-color-surface-base)] via-[var(--mws-color-surface-card)] to-[var(--mws-color-brand-sky-soft)]">
          <div className="relative rounded-[1.75rem] border border-subtle bg-surface-card p-5">
            <div className="motion-fade-up">
              <Badge tone="rose">Live preview</Badge>
              <h3 className="heading-font mt-4 max-w-sm text-3xl font-extrabold tracking-tight text-brand">
                Design elements should move with purpose.
              </h3>
              <p className="mt-3 max-w-md leading-7 text-tertiary">
                Entrance, hover, progress, pulse, and float motion are shown
                here using only CSS utility classes.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="motion-fade-up motion-delay-100 rounded-3xl border border-status-info bg-brand-sky-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="motion-pulse-soft flex size-11 items-center justify-center rounded-2xl bg-surface-card text-brand-sky">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="heading-font text-sm font-bold text-brand-navy">
                      Reading progress
                    </p>
                    <p className="text-xs text-secondary">
                      Animated bar reveal
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <ProgressBar value={78} tone="gold" />
                </div>
              </div>

              <div className="motion-fade-up motion-delay-200 rounded-3xl border border-status-success bg-brand-sage-soft p-5">
                <div className="motion-float mx-auto flex size-20 items-center justify-center rounded-[1.5rem] bg-surface-card text-brand-sage">
                  <Leaf size={32} />
                </div>
                <p className="heading-font mt-5 text-center text-lg font-bold text-status-success">
                  Gentle float
                </p>
                <p className="mt-2 text-center text-sm leading-6 text-secondary">
                  Best for hero accents and illustrations.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-subtle bg-surface-base p-5 motion-hover-lift">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge tone="sage">Hover this card</Badge>
                  <p className="heading-font mt-3 text-xl font-bold text-primary">
                    Interactive states use hover lift.
                  </p>
                </div>
                <Button
                  variant="soft"
                  onClick={() => setInteractionCount((count) => count + 1)}
                  ariaLabel="Try the hover lift interaction demo"
                >
                  Try interaction
                </Button>
              </div>
              <p
                className="mt-4 text-sm leading-6 text-tertiary"
                aria-live="polite"
              >
                Interaction demo clicked {interactionCount}{" "}
                {interactionCount === 1 ? "time" : "times"}.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <h3
              id="animation-kit-title"
              className="heading-font text-2xl font-extrabold text-primary"
            >
              How to use motion on design elements
            </h3>
            <div className="mt-5 grid gap-3">
              {animationGuidelines.map((guide) => (
                <div
                  key={guide}
                  className="flex gap-3 rounded-2xl bg-surface-base p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-brand-sage"
                    size={19}
                  />
                  <p className="leading-7 text-secondary">{guide}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {animationPatterns.map((pattern, index) => (
              <Card
                key={pattern.name}
                className={`motion-fade-up ${
                  index % 2 === 1 ? "motion-delay-100" : ""
                }`}
              >
                <div>
                  <Badge
                    tone={
                      index % 3 === 0
                        ? "burgundy"
                        : index % 3 === 1
                        ? "sky"
                        : "gold"
                    }
                  >
                    {pattern.className}
                  </Badge>
                  <h4 className="heading-font mt-4 text-lg font-bold text-brand">
                    {pattern.name}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-tertiary">
                  {pattern.purpose}
                </p>
                <code className="mt-4 block rounded-2xl bg-code px-4 py-3 text-xs leading-5 text-on-dark">
                  {pattern.usage}
                </code>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PatternsPreview() {
  const [previewAction, setPreviewAction] = useState(
    "Choose a button action to preview feedback."
  );

  return (
    <section className="px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Component previews"
        title="Warm primitives with practical states"
        description="These early previews demonstrate the visual language for buttons, forms, badges, progress, empty states, and dashboard cards."
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        <Card>
          <h3 className="heading-font text-xl font-bold text-primary">
            Buttons
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => setPreviewAction("Continue action selected.")}
            >
              Continue
            </Button>
            <Button
              variant="gold"
              onClick={() => setPreviewAction("Celebration action selected.")}
            >
              Celebrate progress
            </Button>
            <Button
              variant="soft"
              onClick={() =>
                setPreviewAction("Reflection saved in the preview.")
              }
            >
              Save reflection
            </Button>
            <Button href="#examples" variant="outline">
              View details
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPreviewAction("Preview action cancelled.")}
            >
              Cancel
            </Button>
          </div>
          <p
            className="mt-4 text-sm leading-6 text-tertiary"
            aria-live="polite"
          >
            {previewAction}
          </p>
        </Card>
        <Card>
          <h3 className="heading-font text-xl font-bold text-primary">Forms</h3>
          <div className="mt-5">
            <InputPreview />
          </div>
        </Card>
        <Card>
          <h3 className="heading-font text-xl font-bold text-primary">
            Status language
          </h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Badge
                key={status.label}
                tone={
                  status.tone as "burgundy" | "gold" | "rose" | "sage" | "navy"
                }
              >
                {status.label}
              </Badge>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <ProgressBar value={82} />
            <ProgressBar value={56} tone="gold" />
            <ProgressBar value={68} tone="sage" />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Badge tone="navy">Evidence over assumption</Badge>
              <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
                Evidence card
              </h3>
              <p className="mt-3 leading-7 text-tertiary">
                A reusable pattern for Proofpoint, MTSS, learning progress, and
                academic reporting.
              </p>
              <div className="mt-6 rounded-3xl border border-subtle bg-surface-base p-5">
                <div className="mb-4 flex justify-end">
                  <Badge tone="navy">Sample data</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-navy-soft text-brand-navy">
                    <BookOpen size={21} />
                  </div>
                  <div>
                    <p className="heading-font font-bold text-primary">
                      Reading conference notes
                    </p>
                    <p className="text-sm text-tertiary">
                      Submitted by Ms. Sarah, today
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-secondary">
                  Student explained the story conflict clearly and identified
                  one personal reading goal.
                </p>
              </div>
            </div>
            <EmptyStatePreview />
          </div>
        </Card>
        <Card>
          <Badge tone="rose">SEL pattern</Badge>
          <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
            Compassion prompt
          </h3>
          <p className="quote-font mt-5 text-2xl leading-9 text-primary">
            “What helped you feel calm and ready to learn today?”
          </p>
        </Card>
      </div>
    </section>
  );
}

function ProductExamples() {
  return (
    <section id="examples" className="bg-surface-card px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Product references"
        title="One system, different school contexts"
        description="Each MAD Labs product uses Burgundy as the shared anchor while one supporting color communicates the product’s purpose."
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {productExamples.map((product, index) => {
          const Icon = product.icon;
          return (
            <Card key={product.name} className="shadow-none">
              <div
                className="rounded-[1.5rem] border border-[color-mix(in_srgb,var(--mws-color-surface-card)_70%,transparent)] p-5"
                style={{ background: productBackgrounds[index] }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-3xl ${
                      index === 0 ? "text-brand-sky-on" : "text-inverse"
                    }`}
                    style={{ background: product.accent }}
                  >
                    <Icon size={30} />
                  </div>
                  <div>
                    <Badge tone="burgundy">{product.palette}</Badge>
                    <h3 className="heading-font mt-4 text-2xl font-extrabold text-brand">
                      {product.name}
                    </h3>
                    <p className="mt-3 leading-7 text-tertiary">
                      {product.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.components.map((component) => (
                        <span
                          key={component}
                          className="heading-font rounded-full bg-[color-mix(in_srgb,var(--mws-color-surface-card)_85%,transparent)] px-3 py-1 text-xs font-bold text-secondary"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Templates() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Page templates"
        title="Reference screens that teams can copy with confidence"
        description="The UI kit should include complete page patterns so new apps inherit the same structure, tone, accessibility, and visual rhythm."
      />
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-subtle bg-surface-card">
        {pageTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <div
              key={template.name}
              className="grid gap-4 border-b border-subtle p-5 last:border-b-0 sm:grid-cols-[3rem_3rem_1fr] sm:items-start md:p-6"
            >
              <span className="heading-font text-sm font-extrabold text-tertiary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-surface-base">
                <Icon className={templateIconThemes[index]} size={22} />
              </div>
              <div>
                <h3 className="heading-font text-xl font-bold text-primary">
                  {template.name}
                </h3>
                <p className="mt-2 max-w-3xl leading-7 text-tertiary">
                  {template.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ConsumerGuidance() {
  const apiExports = [
    "Button, Input, Modal",
    "AppShell, DataTable, CommandPalette, FormWizard",
    "Design tokens from ./tokens",
  ];

  const releaseChecks = [
    "Use Changesets for every user-visible package change.",
    "Follow docs/semver-policy.md to decide major, minor, and patch releases.",
    "Run the release workflow before publishing so CHANGELOG.md and package versions stay aligned.",
  ];

  return (
    <section id="consumers" className="bg-surface-card px-5 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Using v0.2.0"
        title="Everything consumers need to adopt the package"
        description="Version 0.2.0 turns the homepage into a clearer handoff for product teams: how to import the kit, which APIs are public, what accessibility guarantees changed, and how releases are governed."
      />
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden" padding="none">
          <div className="border-b border-subtle bg-brand-navy-soft p-6">
            <Badge tone="navy">Package entry points</Badge>
            <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
              Import components and the packaged stylesheet
            </h3>
            <p className="mt-3 leading-7 text-tertiary">
              Apps should consume the public barrel instead of reaching into
              internal source files. The CSS bundle is exported as a package
              subpath so every consumer gets the same tokens, focus rings,
              motion utilities, and component styles.
            </p>
          </div>
          <div className="grid gap-4 p-6">
            <pre className="overflow-x-auto rounded-3xl bg-[var(--mws-color-brand-navy)] p-5 text-sm leading-7 text-inverse">
              <code>{`import { Button, Input, Modal } from "mws-ui-kit";
import "mws-ui-kit/style.css";`}</code>
            </pre>
            <div className="grid gap-3 sm:grid-cols-3">
              {apiExports.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-subtle bg-surface-base p-4"
                >
                  <CheckCircle2 className="text-brand-sage" size={20} />
                  <p className="mt-3 text-sm font-semibold leading-6 text-secondary">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card>
            <Badge tone="sage">Accessible primitives</Badge>
            <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
              Refs and focus behavior are part of the contract
            </h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-surface-base p-4">
                <p className="heading-font font-bold text-primary">
                  Button and Input forward refs
                </p>
                <p className="mt-2 text-sm leading-6 text-tertiary">
                  Forms, wizards, validation flows, and integrations can attach
                  refs directly to the underlying interactive element.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-base p-4">
                <p className="heading-font font-bold text-primary">
                  Modal traps focus while open
                </p>
                <p className="mt-2 text-sm leading-6 text-tertiary">
                  Keyboard users stay inside the dialog, Escape closes it, body
                  scroll is locked, and focus returns to the trigger when the
                  modal closes.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <Badge tone="sky">Shared backdrop tokens</Badge>
            <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
              Headers and overlays use reusable backdrop classes
            </h3>
            <p className="mt-3 leading-7 text-tertiary">
              Use the shared backdrop class names for sticky navigation and
              modal overlays so blur, opacity, and warmth stay consistent across
              MAD Labs products.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-secondary">
              <code className="rounded-2xl bg-surface-base p-3">
                headerBackdropClassName
              </code>
              <code className="rounded-2xl bg-surface-base p-3">
                overlayBackdropClassName
              </code>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <Badge tone="gold">Release governance</Badge>
          <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
            Version changes follow the documented release path
          </h3>
          <div className="mt-5 space-y-3">
            {releaseChecks.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl bg-surface-base p-4"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-brand-sage"
                  size={20}
                />
                <p className="text-sm leading-6 text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <Badge tone="rose">Consumer checklist</Badge>
          <h3 className="heading-font mt-4 text-2xl font-bold text-primary">
            Before adopting v0.2.0 in an app
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Import from the package root only.",
              "Load mws-ui-kit/style.css once near the app root.",
              "Use Modal for dialogs that need focus management.",
              "Prefer shared backdrop classes over custom overlay colors.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-subtle bg-surface-base p-4"
              >
                <p className="text-sm font-semibold leading-6 text-secondary">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function FinalChecklist() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Badge tone="gold">Final design check</Badge>
          <h2 className="heading-font mt-5 text-4xl font-extrabold tracking-tight text-brand">
            Before publishing any MWS design
          </h2>
          <p className="mt-5 text-lg leading-8 text-tertiary">
            Use this checklist to keep every app aligned with the school’s
            values and practical needs.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {values.map((item) => (
              <div
                key={item.value}
                className="rounded-3xl border border-subtle bg-surface-card p-5"
              >
                <p className="heading-font text-lg font-bold text-brand">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-tertiary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Card>
          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl bg-surface-base p-4"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-brand-sage"
                  size={20}
                />
                <p className="leading-7 text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-subtle bg-surface-card px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="heading-font text-xl font-extrabold text-brand">
            MWS Heart & Purpose UI Kit
          </p>
          <p className="mt-2 text-tertiary">
            A reference system for every app developed by MAD Labs.
          </p>
        </div>
        <div className="flex gap-3 text-brand">
          <Heart size={22} />
          <Leaf size={22} />
          <Lightbulb size={22} />
          <Compass size={22} />
        </div>
      </div>
    </footer>
  );
}

export default App;
