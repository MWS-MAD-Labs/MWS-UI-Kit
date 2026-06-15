import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Compass,
  Heart,
  Leaf,
  Lightbulb,
  Menu,
  Sparkles,
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
  implementationPhases,
  metricCards,
  pageTemplates,
  productExamples,
  statuses,
  values,
} from "./data/uiKit";
import {
  Badge,
  Button,
  Card,
  EmptyStatePreview,
  InputPreview,
  LinkButton,
  ProgressBar,
  SectionHeader,
} from "./components/UIPrimitives";

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
  "text-brand-gold",
  "text-brand-sky",
  "text-brand",
];
const metricIconThemes = [
  "text-brand-sky",
  "text-brand-gold",
  "text-brand-sage",
];

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-surface-base text-primary">
      <Navigation />
      <Hero />
      <AiAgentGuide />
      <Foundations />
      <BrandTokens />
      <TypographySection />
      <ComponentSystem />
      <AnimationKit />
      <PatternsPreview />
      <ProductExamples />
      <Templates />
      <Implementation />
      <FinalChecklist />
      <Footer />
    </main>
  );
}

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    "AI Guide",
    "Foundations",
    "Tokens",
    "Components",
    "Motion",
    "Examples",
    "Implementation",
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--mws-color-border-subtle)_80%,transparent)] bg-[color-mix(in_srgb,var(--mws-color-surface-base)_90%,transparent)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-primary text-inverse shadow-lg shadow-brand">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <p className="heading-font text-sm font-extrabold tracking-wide text-brand">
              MWS
            </p>
            <p className="text-xs text-tertiary">Heart & Purpose UI Kit</p>
          </div>
        </a>
        <div className="hidden items-center gap-6 md:flex">
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
        <button
          className="focus-ring rounded-full border border-subtle bg-surface-card p-3 text-brand md:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-subtle bg-surface-base px-5 py-4 md:hidden"
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
      <div className="absolute -left-24 top-20 size-72 rounded-full bg-[color-mix(in_srgb,var(--mws-color-brand-sky)_30%,transparent)] blur-3xl" />
      <div className="absolute -right-24 top-36 size-80 rounded-full bg-[color-mix(in_srgb,var(--mws-color-brand-gold)_20%,transparent)] blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative motion-fade-up">
          <Badge tone="gold">
            Millennia World School digital design system
          </Badge>
          <h1 className="heading-font mt-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-[-0.04em] text-primary md:text-7xl">
            Growing with <span className="text-brand">heart</span>,{" "}
            <span className="text-brand-sage">purpose</span>, and{" "}
            <span className="text-brand-gold">joy</span> across every MWS app.
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
        <div className="relative motion-fade-up motion-delay-200">
          <div className="absolute -right-4 -top-5 flex size-14 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold motion-orbit">
            <Sparkles size={20} />
          </div>
          <div className="soft-shadow motion-float rounded-[2rem] border border-subtle bg-surface-card p-4">
            <div className="rounded-[1.5rem] border border-status-info bg-gradient-to-br from-[var(--mws-color-brand-sky-soft)] via-[var(--mws-color-surface-card)] to-[var(--mws-color-brand-sage-soft)] p-5 text-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="heading-font text-sm font-bold text-brand">
                    MWS Dashboard
                  </p>
                  <h2 className="heading-font mt-2 text-2xl font-extrabold text-brand-navy">
                    Welcome back, Ms. Sarah
                  </h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--mws-color-brand-gold)_20%,transparent)] text-brand-gold motion-pulse-soft">
                  <Sparkles size={22} />
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
                    className={`motion-fade-up rounded-3xl bg-surface-base p-5 ${index === 1 ? "motion-delay-100" : index === 2 ? "motion-delay-200" : ""}`}
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
                      className={`focus-ring rounded-2xl p-3 transition hover:bg-[var(--mws-color-brand-primary-softer)] ${selectedEmotion === emotion ? "bg-brand-primary text-inverse" : "bg-brand-rose-soft"}`}
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

        <div className="grid gap-5 lg:grid-cols-4">
          {aiAgentBrief.map((item) => (
            <Card key={item.title} className="shadow-none">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-brand-sky-soft text-brand-sky">
                <Bot size={24} />
              </div>
              <Badge tone="sky">{item.label}</Badge>
              <h3 className="heading-font mt-4 text-xl font-bold text-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-tertiary">
                {item.detail}
              </p>
              <code className="mt-4 block rounded-2xl bg-code px-4 py-3 text-xs leading-5 text-inverse">
                {item.source}
              </code>
            </Card>
          ))}
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
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {foundations.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <div
                className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${foundationThemes[index]}`}
              >
                <Icon size={24} />
              </div>
              <h3 className="heading-font text-xl font-bold text-primary">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-tertiary">{item.description}</p>
            </Card>
          );
        })}
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
              className={`h-28 rounded-3xl ${color.bordered ? "border border-subtle" : ""}`}
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
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        <Card>
          <Badge>Headlines</Badge>
          <p className="heading-font mt-5 text-4xl font-extrabold leading-tight text-brand">
            Plus Jakarta Sans
          </p>
          <p className="mt-4 leading-7 text-tertiary">
            Use for hero headlines, page titles, section headings, buttons,
            labels, and product navigation.
          </p>
        </Card>
        <Card>
          <Badge tone="sage">Body text</Badge>
          <p className="body-font mt-5 text-3xl font-bold leading-tight text-primary">
            Nunito Sans
          </p>
          <p className="mt-4 leading-7 text-tertiary">
            Use for parent letters, reports, captions, card descriptions, and
            long-form interface copy.
          </p>
        </Card>
        <Card>
          <Badge tone="gold">Quotes</Badge>
          <p className="quote-font mt-5 text-3xl leading-snug text-primary">
            Lora Medium Italic
          </p>
          <p className="mt-4 leading-7 text-tertiary">
            Use sparingly for mission lines, reflection prompts, invitations,
            and philosophical statements.
          </p>
        </Card>
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
            <div className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold motion-orbit">
              <Sparkles size={18} />
            </div>
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
                className={`motion-fade-up ${index % 2 === 1 ? "motion-delay-100" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
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
                  <div className="motion-pulse-soft flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gold-soft text-brand-gold">
                    <Sparkles size={18} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-tertiary">
                  {pattern.purpose}
                </p>
                <code className="mt-4 block rounded-2xl bg-code px-4 py-3 text-xs leading-5 text-inverse">
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
    "Choose a button action to preview feedback.",
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
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-navy-soft text-brand-navy">
                    <BookOpen size={21} />
                  </div>
                  <div>
                    <p className="heading-font font-bold text-primary">
                      Reading conference notes
                    </p>
                    <p className="text-sm text-tertiary">
                      Submitted by Ms. Sarah · Today
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
          <LinkButton>See implementation phases</LinkButton>
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
                    className="flex size-16 shrink-0 items-center justify-center rounded-3xl text-inverse"
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
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pageTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <Card key={template.name}>
              <Icon className={templateIconThemes[index]} size={28} />
              <h3 className="heading-font mt-5 text-xl font-bold text-primary">
                {template.name}
              </h3>
              <p className="mt-3 leading-7 text-tertiary">
                {template.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Implementation() {
  return (
    <section
      id="implementation"
      className="bg-gradient-to-br from-[var(--mws-color-brand-navy)] via-[color-mix(in_srgb,var(--mws-color-brand-navy)_86%,var(--mws-color-brand-sky))] to-[var(--mws-color-brand-sage)] px-5 py-20 text-inverse lg:px-8"
    >
      <SectionHeader
        eyebrow="Implementation plan"
        title="Build the system in focused phases"
        description="Start with foundations that every app needs, then layer dashboards, school-specific components, and full templates."
        inverse
      />
      <div className="mx-auto max-w-5xl">
        <div className="relative space-y-5 before:absolute before:left-6 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[color-mix(in_srgb,var(--mws-color-surface-card)_15%,transparent)]">
          {implementationPhases.map((item) => (
            <div key={item.phase} className="relative flex gap-5">
              <div className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-sky text-brand-navy">
                <Circle size={14} fill="currentColor" />
              </div>
              <div className="rounded-3xl border border-[color-mix(in_srgb,var(--mws-color-text-inverse)_10%,transparent)] bg-[color-mix(in_srgb,var(--mws-color-surface-card)_8%,transparent)] p-6">
                <p className="heading-font text-sm font-bold text-[color-mix(in_srgb,var(--mws-color-brand-gold)_72%,var(--mws-color-surface-card))]">
                  {item.phase}
                </p>
                <h3 className="heading-font mt-2 text-2xl font-bold text-inverse">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-[color-mix(in_srgb,var(--mws-color-text-inverse)_70%,transparent)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
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
