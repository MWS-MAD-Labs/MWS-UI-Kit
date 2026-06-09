import {
  BookOpen,
  Brain,
  CheckCircle2,
  HeartHandshake,
  Leaf,
  Library,
  LineChart,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const colors = [
  {
    name: "MWS Burgundy",
    hex: "#7E1518",
    role: "Primary identity, headers, main buttons, official moments",
  },
  {
    name: "MWS White",
    hex: "#FFFFFF",
    role: "Main background, space, readability",
    bordered: true,
  },
  {
    name: "Happiness Gold",
    hex: "#D6A13A",
    role: "Highlights, joyful accents, celebration moments",
  },
  {
    name: "Deep Charcoal",
    hex: "#241718",
    role: "Main text instead of pure black",
  },
  {
    name: "Compassion Rose",
    hex: "#B94A4E",
    role: "SEL, kindness, compassion, wellbeing",
  },
  {
    name: "Goodness Sage",
    hex: "#6F8B6A",
    role: "Nature, sustainability, growth, intervention",
  },
  {
    name: "Truth Navy",
    hex: "#1F2A44",
    role: "Academics, thinking, trust, evidence",
  },
  {
    name: "Millennia Sky",
    hex: "#B8DDF8",
    role: "Calm, reflection, child-centered softness",
  },
];

export const foundations = [
  {
    title: "Compassionate by default",
    description:
      "Interfaces use warm copy, gentle states, and supportive patterns rather than fear, shame, or pressure.",
    icon: HeartHandshake,
  },
  {
    title: "Clear for busy school days",
    description:
      "Parents, teachers, and leaders should understand the next action quickly without dense layouts.",
    icon: Sparkles,
  },
  {
    title: "Evidence over assumption",
    description:
      "Dashboards and workflows make evidence, progress, and decisions transparent and fair.",
    icon: ShieldCheck,
  },
  {
    title: "Growing with purpose",
    description:
      "Progress components emphasize potential, reflection, and growth through Truth, Beauty, Goodness, and Happiness.",
    icon: Leaf,
  },
];

export const componentGroups = [
  {
    title: "Foundation components",
    items: [
      "Button",
      "Input",
      "Textarea",
      "Select",
      "Checkbox",
      "Badge",
      "Card",
      "Alert",
      "Avatar",
      "Progress",
      "Tabs",
      "Modal",
    ],
  },
  {
    title: "Layout components",
    items: [
      "AppShell",
      "Sidebar",
      "TopBar",
      "PageHeader",
      "SectionHeader",
      "DashboardGrid",
      "EmptyState",
      "Breadcrumb",
    ],
  },
  {
    title: "Data components",
    items: [
      "DataTable",
      "MetricCard",
      "ChartCard",
      "StatusBadge",
      "FilterBar",
      "Timeline",
      "ActivityFeed",
      "ApprovalFlow",
    ],
  },
  {
    title: "MWS school components",
    items: [
      "StudentCard",
      "EmotionPicker",
      "BookCard",
      "TierBadge",
      "EvidenceCard",
      "ParentNotice",
      "ReflectionCard",
      "AnnouncementCard",
    ],
  },
];

export const productExamples = [
  {
    name: "Reading Buddy",
    description:
      "A joyful library and reading progress experience for students, teachers, and librarians.",
    icon: Library,
    palette: "Burgundy + Gold + Sky",
    components: [
      "BookCard",
      "ReadingProgress",
      "QuizStatusBadge",
      "LibraryShelf",
    ],
    accent: "#B8DDF8",
  },
  {
    name: "MWS Daily Check-in",
    description:
      "A safe, reflective wellbeing product for students and staff to share emotional patterns.",
    icon: MessageCircleHeart,
    palette: "Burgundy + Rose + Sky",
    components: [
      "EmotionPicker",
      "CheckInCard",
      "MoodHistoryCard",
      "CompassionPrompt",
    ],
    accent: "#B94A4E",
  },
  {
    name: "MWS MTSS System",
    description:
      "A non-punitive support workflow for strategies, tiers, mentors, reviews, and growth.",
    icon: UsersRound,
    palette: "Burgundy + Sage + Sky",
    components: [
      "TierBadge",
      "InterventionCard",
      "StrategyCard",
      "ReviewTimeline",
    ],
    accent: "#6F8B6A",
  },
  {
    name: "MWS Proofpoint",
    description:
      "An evidence-based performance dashboard with fair scoring and clear approval flows.",
    icon: LineChart,
    palette: "Burgundy + Navy + Gold",
    components: [
      "EvidenceCard",
      "AppraisalScoreCard",
      "ApprovalFlow",
      "PerformanceBadge",
    ],
    accent: "#1F2A44",
  },
];

export const pageTemplates = [
  {
    name: "Authentication",
    icon: ShieldCheck,
    description:
      "Welcoming login, Google OAuth, role selection, and invite acceptance.",
  },
  {
    name: "Teacher dashboard",
    icon: LineChart,
    description:
      "Metrics, important alerts, recent activity, and quick actions.",
  },
  {
    name: "Student dashboard",
    icon: BookOpen,
    description:
      "Warm greeting, current task, progress, and encouraging reflection.",
  },
  {
    name: "Parent communication",
    icon: MessageCircleHeart,
    description:
      "Readable announcements, clear sections, dates, and action steps.",
  },
  {
    name: "Student support profile",
    icon: HeartHandshake,
    description:
      "Supportive MTSS context, strategies, mentor notes, and review cycle.",
  },
  {
    name: "Academic report",
    icon: Brain,
    description:
      "Evidence summaries, charts, recommendations, and export-ready sections.",
  },
];

export const checklist = [
  "Does it feel compassionate and human-centered?",
  "Is Burgundy clearly present without overpowering the content?",
  "Is the layout spacious, calm, and readable?",
  "Are Gold and secondary colors used meaningfully and sparingly?",
  "Can parents, students, and teachers understand the next action quickly?",
  "Does the copy avoid fear, shame, pressure, and elitism?",
  "Are focus states, contrast, and labels accessible?",
  "Does it help people feel that goodness grows at MWS?",
];

export const statuses = [
  { label: "Growing", tone: "sage" },
  { label: "Needs reflection", tone: "gold" },
  { label: "Guided support", tone: "rose" },
  { label: "Evidence ready", tone: "navy" },
  { label: "Completed", tone: "burgundy" },
];

export const implementationPhases = [
  {
    phase: "Phase 1",
    title: "Foundations + core components",
    description:
      "Tokens, typography, colors, buttons, forms, badges, cards, alerts, progress, page headers, and empty states.",
  },
  {
    phase: "Phase 2",
    title: "Dashboard + data patterns",
    description:
      "Tables, filters, metric cards, timelines, activity feeds, chart containers, status badges, and approval flows.",
  },
  {
    phase: "Phase 3",
    title: "School-specific components",
    description:
      "Student cards, emotion check-ins, book cards, tier badges, evidence cards, announcements, and parent notices.",
  },
  {
    phase: "Phase 4",
    title: "Product templates",
    description:
      "Full reference pages for Reading Buddy, Daily Check-in, MTSS, Proofpoint, and future MAD Labs products.",
  },
];

export const values = [
  {
    value: "Truth",
    description: "Clear evidence, honest communication, transparent decisions.",
  },
  {
    value: "Beauty",
    description: "Warm layouts, careful typography, dignified visual rhythm.",
  },
  {
    value: "Goodness",
    description: "Supportive workflows that help people grow and belong.",
  },
  {
    value: "Happiness",
    description:
      "Joyful highlights, encouraging milestones, meaningful celebration.",
  },
];

export const metricCards = [
  {
    label: "Students supported",
    value: "124",
    detail: "Across wellbeing and learning workflows",
    icon: UsersRound,
  },
  {
    label: "Reading progress",
    value: "78%",
    detail: "Average completion this month",
    icon: BookOpen,
  },
  {
    label: "Evidence submitted",
    value: "36",
    detail: "Ready for review in Proofpoint",
    icon: CheckCircle2,
  },
];

export const animationPatterns = [
  {
    name: "Fade up",
    className: "motion-fade-up",
    purpose:
      "Introduce cards, headers, and empty states without startling users.",
    usage: '<Card className="motion-fade-up">...</Card>',
  },
  {
    name: "Hover lift",
    className: "motion-hover-lift",
    purpose: "Show that a card, button, or tile is interactive.",
    usage: '<Button className="motion-hover-lift">Continue</Button>',
  },
  {
    name: "Progress grow",
    className: "motion-progress-grow",
    purpose:
      "Reveal learning, reading, or support progress from left to right.",
    usage: '<ProgressBar value={68} tone="sage" />',
  },
  {
    name: "Gentle float",
    className: "motion-float",
    purpose:
      "Add calm motion to decorative illustrations and hero accents only.",
    usage: '<div className="motion-float">...</div>',
  },
  {
    name: "Soft pulse",
    className: "motion-pulse-soft",
    purpose:
      "Highlight celebration, focus, or live status in a low-pressure way.",
    usage: '<Sparkles className="motion-pulse-soft" />',
  },
  {
    name: "Orbit accent",
    className: "motion-orbit",
    purpose: "Use sparingly around hero badges or featured milestone moments.",
    usage: '<span className="motion-orbit" />',
  },
];

export const animationGuidelines = [
  "Use motion to clarify hierarchy, feedback, or progress — never as decoration that competes with learning.",
  "Prefer short entrance animations between 200ms and 700ms, with calm easing.",
  "Use hover lift only on interactive surfaces such as cards, buttons, and selectable tiles.",
  "Avoid animating long text blocks, dense tables, or anything users need to read carefully.",
  "Respect reduced-motion preferences; the kit disables continuous motion automatically.",
];
