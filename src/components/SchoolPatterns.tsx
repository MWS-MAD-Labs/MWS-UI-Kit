import { type ReactNode, useId, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartHandshake,
  Megaphone,
  Star,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "./UIPrimitives";
import {
  ActivityFeed,
  type ActivityFeedItem,
  ApprovalFlow,
  type ApprovalStep,
} from "./DataAdmin";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type StudentStatusTone =
  | "active"
  | "support"
  | "watch"
  | "completed"
  | "neutral";

export type StudentCardProps = {
  name: string;
  preferredName?: string;
  studentId?: string;
  grade?: string;
  homeroom?: string;
  avatar?: ReactNode;
  status?: {
    label: string;
    tone?: StudentStatusTone;
  };
  details?: Array<{
    label: string;
    value: ReactNode;
  }>;
  actions?: ReactNode;
  href?: string;
};

const studentStatusToneClasses: Record<
  StudentStatusTone,
  {
    badge: "success" | "warning" | "info" | "neutral" | "burgundy";
    ring: string;
  }
> = {
  active: {
    badge: "success",
    ring: "ring-[var(--mws-color-status-success-border)]",
  },
  support: {
    badge: "info",
    ring: "ring-[var(--mws-color-status-info-border)]",
  },
  watch: {
    badge: "warning",
    ring: "ring-[var(--mws-color-status-warning-border)]",
  },
  completed: {
    badge: "burgundy",
    ring: "ring-[var(--mws-color-border-brand)]",
  },
  neutral: { badge: "neutral", ring: "ring-[var(--mws-color-border-subtle)]" },
};

export function StudentCard({
  name,
  preferredName,
  studentId,
  grade,
  homeroom,
  avatar,
  status,
  details = [],
  actions,
  href,
}: StudentCardProps) {
  const tone = studentStatusToneClasses[status?.tone ?? "neutral"];
  const content = (
    <Card variant={href ? "interactive" : "default"} className="h-full">
      <div className="flex items-start gap-4">
        <div
          className={cx(
            "flex size-14 shrink-0 items-center justify-center radius-full bg-brand-primary-soft text-brand ring-4",
            tone.ring,
          )}
        >
          {avatar ?? <UserRound className="size-6" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="heading-font truncate text-xl font-bold text-primary">
              {preferredName ?? name}
            </h3>
            {status ? <Badge tone={tone.badge}>{status.label}</Badge> : null}
          </div>
          {preferredName ? (
            <p className="mt-1 text-sm text-tertiary">Official name: {name}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-tertiary">
            {studentId ? <Badge tone="neutral">ID {studentId}</Badge> : null}
            {grade ? <Badge tone="sky">{grade}</Badge> : null}
            {homeroom ? <Badge tone="sage">{homeroom}</Badge> : null}
          </div>
        </div>
      </div>
      {details.length ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="radius-lg bg-surface-base p-3">
              <dt className="heading-font text-xs font-bold uppercase tracking-wide text-tertiary">
                {detail.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-primary">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );

  if (href) {
    return (
      <a className="focus-ring block radius-xl" href={href}>
        {content}
      </a>
    );
  }

  return content;
}

export type StudentProfileHeaderProps = {
  student: {
    name: string;
    preferredName?: string;
    studentId?: string;
    grade?: string;
    homeroom?: string;
    avatar?: ReactNode;
  };
  status?: StudentCardProps["status"];
  summary?: ReactNode;
  metrics?: Array<{
    label: string;
    value: ReactNode;
  }>;
  actions?: ReactNode;
};

export function StudentProfileHeader({
  student,
  status,
  summary,
  metrics = [],
  actions,
}: StudentProfileHeaderProps) {
  const tone = studentStatusToneClasses[status?.tone ?? "neutral"];

  return (
    <Card className="overflow-hidden" padding="none">
      <div className="bg-gradient-to-br from-[var(--mws-color-brand-sky-soft)] via-[var(--mws-color-surface-card)] to-[var(--mws-color-brand-sage-soft)] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-5">
            <div
              className={cx(
                "flex size-20 shrink-0 items-center justify-center radius-full bg-surface-card text-brand ring-4",
                tone.ring,
              )}
            >
              {student.avatar ?? (
                <UserRound className="size-9" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="heading-font text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                  {student.preferredName ?? student.name}
                </h1>
                {status ? (
                  <Badge tone={tone.badge} size="md">
                    {status.label}
                  </Badge>
                ) : null}
              </div>
              {student.preferredName ? (
                <p className="mt-1 text-sm text-tertiary">
                  Official name: {student.name}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {student.studentId ? (
                  <Badge tone="neutral">ID {student.studentId}</Badge>
                ) : null}
                {student.grade ? (
                  <Badge tone="sky">{student.grade}</Badge>
                ) : null}
                {student.homeroom ? (
                  <Badge tone="sage">{student.homeroom}</Badge>
                ) : null}
              </div>
              {summary ? (
                <div className="mt-4 max-w-3xl leading-7 text-secondary">
                  {summary}
                </div>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>
          ) : null}
        </div>
      </div>
      {metrics.length ? (
        <dl className="grid divide-y divide-[var(--mws-color-border-subtle)] md:grid-cols-4 md:divide-x md:divide-y-0">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-5">
              <dt className="heading-font text-xs font-bold uppercase tracking-wide text-tertiary">
                {metric.label}
              </dt>
              <dd className="heading-font mt-2 text-2xl font-extrabold text-brand">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Card>
  );
}

export type EmotionOption = {
  value: string;
  label: string;
  emoji: string;
  description?: string;
};

export type EmotionPickerProps = {
  label?: string;
  value?: string;
  options?: EmotionOption[];
  onChange?: (value: string) => void;
  helperText?: ReactNode;
};

const defaultEmotionOptions: EmotionOption[] = [
  {
    value: "joyful",
    label: "Joyful",
    emoji: "😊",
    description: "Feeling happy or encouraged",
  },
  {
    value: "calm",
    label: "Calm",
    emoji: "🙂",
    description: "Feeling settled and ready",
  },
  {
    value: "unsure",
    label: "Unsure",
    emoji: "😐",
    description: "Still figuring out the day",
  },
  {
    value: "concerned",
    label: "Concerned",
    emoji: "😟",
    description: "Could use support or care",
  },
];

export function EmotionPicker({
  label = "How are you feeling today?",
  value,
  options = defaultEmotionOptions,
  onChange,
  helperText,
}: EmotionPickerProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const selectedValue = value ?? internalValue;
  const groupId = useId();

  const select = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <fieldset className="grid gap-3">
      <legend
        id={groupId}
        className="heading-font text-lg font-bold text-primary"
      >
        {label}
      </legend>
      {helperText ? (
        <p className="text-sm leading-6 text-tertiary">{helperText}</p>
      ) : null}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="radiogroup"
        aria-labelledby={groupId}
      >
        {options.map((emotion) => {
          const selected = emotion.value === selectedValue;
          return (
            <button
              key={emotion.value}
              className={cx(
                "focus-ring flex flex-col items-center gap-2 radius-xl border p-4 text-center transition",
                selected
                  ? "border-brand bg-brand-primary-soft text-brand"
                  : "border-subtle bg-surface-card text-primary hover:bg-surface-base",
              )}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => select(emotion.value)}
            >
              <span className="text-3xl" aria-hidden="true">
                {emotion.emoji}
              </span>
              <span className="heading-font text-sm font-bold">
                {emotion.label}
              </span>
              {emotion.description ? (
                <span className="text-xs leading-5 text-tertiary">
                  {emotion.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export type BookCardProps = {
  title: string;
  author?: string;
  cover?: ReactNode;
  level?: string;
  status?: "available" | "borrowed" | "reserved" | "completed";
  progress?: number;
  description?: ReactNode;
  actions?: ReactNode;
  href?: string;
};

export function BookCard({
  title,
  author,
  cover,
  level,
  status = "available",
  progress,
  description,
  actions,
  href,
}: BookCardProps) {
  const statusTone = {
    available: "success",
    borrowed: "info",
    reserved: "warning",
    completed: "burgundy",
  } as const;

  const content = (
    <Card variant={href ? "interactive" : "default"} className="h-full">
      <div className="flex gap-4">
        <div className="flex aspect-[3/4] w-24 shrink-0 items-center justify-center radius-lg bg-gradient-to-br from-[var(--mws-color-brand-sky-soft)] to-[var(--mws-color-brand-gold-soft)] text-brand shadow-sm">
          {cover ?? <BookOpen className="size-9" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone={statusTone[status]}>{status}</Badge>
            {level ? <Badge tone="sky">{level}</Badge> : null}
          </div>
          <h3 className="heading-font mt-3 text-xl font-bold text-primary">
            {title}
          </h3>
          {author ? (
            <p className="mt-1 text-sm text-tertiary">by {author}</p>
          ) : null}
          {description ? (
            <div className="mt-3 text-sm leading-6 text-secondary">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {typeof progress === "number" ? (
        <div className="mt-5 grid gap-2">
          <div className="flex justify-between text-sm text-tertiary">
            <span>Reading progress</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <ProgressBar
            value={progress}
            tone="gold"
            label={`${title} reading progress`}
          />
        </div>
      ) : null}
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );

  if (href) {
    return (
      <a className="focus-ring block radius-xl" href={href}>
        {content}
      </a>
    );
  }
  return content;
}

export type TierLevel =
  | "tier-1"
  | "tier-2"
  | "tier-3"
  | "monitoring"
  | "graduated";

export function TierBadge({
  tier,
  label,
}: {
  tier: TierLevel;
  label?: string;
}) {
  const tierMap: Record<
    TierLevel,
    {
      text: string;
      tone: "success" | "warning" | "error" | "info" | "burgundy";
    }
  > = {
    "tier-1": { text: "Tier 1 support", tone: "success" },
    "tier-2": { text: "Tier 2 guided support", tone: "warning" },
    "tier-3": { text: "Tier 3 intensive support", tone: "error" },
    monitoring: { text: "Monitoring", tone: "info" },
    graduated: { text: "Graduated support", tone: "burgundy" },
  };
  const item = tierMap[tier];
  return <Badge tone={item.tone}>{label ?? item.text}</Badge>;
}

export type InterventionCardProps = {
  title: string;
  tier: TierLevel;
  studentName?: string;
  owner?: string;
  reviewDate?: string;
  description?: ReactNode;
  progress?: number;
  strategies?: string[];
  actions?: ReactNode;
};

export function InterventionCard({
  title,
  tier,
  studentName,
  owner,
  reviewDate,
  description,
  progress,
  strategies = [],
  actions,
}: InterventionCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <TierBadge tier={tier} />
          <h3 className="heading-font mt-3 text-xl font-bold text-primary">
            {title}
          </h3>
          {studentName ? (
            <p className="mt-1 text-sm text-tertiary">For {studentName}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {owner ? <Badge tone="neutral">Owner: {owner}</Badge> : null}
          {reviewDate ? <Badge tone="sky">Review {reviewDate}</Badge> : null}
        </div>
      </div>
      {description ? (
        <div className="mt-4 leading-7 text-secondary">{description}</div>
      ) : null}
      {typeof progress === "number" ? (
        <div className="mt-5 grid gap-2">
          <div className="flex justify-between text-sm text-tertiary">
            <span>Support cycle progress</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <ProgressBar
            value={progress}
            tone="sage"
            label={`${title} support progress`}
          />
        </div>
      ) : null}
      {strategies.length ? (
        <div className="mt-5">
          <p className="heading-font text-sm font-bold text-primary">
            Strategies
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {strategies.map((strategy) => (
              <Badge key={strategy} tone="sage">
                {strategy}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );
}

export type EvidenceCardProps = {
  title: string;
  type?: string;
  submittedBy?: string;
  submittedAt?: string;
  status?: "draft" | "submitted" | "reviewed" | "approved" | "needs-revision";
  description?: ReactNode;
  attachments?: number;
  actions?: ReactNode;
  approvalSteps?: ApprovalStep[];
};

export function EvidenceCard({
  title,
  type,
  submittedBy,
  submittedAt,
  status = "submitted",
  description,
  attachments,
  actions,
  approvalSteps,
}: EvidenceCardProps) {
  const statusTone = {
    draft: "neutral",
    submitted: "info",
    reviewed: "success",
    approved: "burgundy",
    "needs-revision": "warning",
  } as const;

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center radius-lg bg-brand-navy-soft text-brand-navy">
          <FileText className="size-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone={statusTone[status]}>{status.replace("-", " ")}</Badge>
            {type ? <Badge tone="navy">{type}</Badge> : null}
            {typeof attachments === "number" ? (
              <Badge tone="neutral">{attachments} attachments</Badge>
            ) : null}
          </div>
          <h3 className="heading-font mt-3 text-xl font-bold text-primary">
            {title}
          </h3>
          {submittedBy || submittedAt ? (
            <p className="mt-1 text-sm text-tertiary">
              {submittedBy ? `Submitted by ${submittedBy}` : "Submitted"}
              {submittedAt ? ` · ${submittedAt}` : ""}
            </p>
          ) : null}
          {description ? (
            <div className="mt-3 text-sm leading-6 text-secondary">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {approvalSteps?.length ? (
        <div className="mt-5">
          <ApprovalFlow steps={approvalSteps} title="Evidence review" />
        </div>
      ) : null}
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );
}

export type ParentNoticeProps = {
  title: string;
  audience?: string;
  date?: string;
  tone?: "info" | "success" | "warning" | "urgent";
  children: ReactNode;
  actions?: ReactNode;
};

export function ParentNotice({
  title,
  audience = "Families",
  date,
  tone = "info",
  children,
  actions,
}: ParentNoticeProps) {
  const toneClasses = {
    info: "border-status-info bg-status-info text-status-info",
    success: "border-status-success bg-status-success text-status-success",
    warning: "border-status-warning bg-status-warning text-status-warning",
    urgent: "border-status-error bg-status-error text-status-error",
  };

  return (
    <article className={cx("radius-xl border p-6", toneClasses[tone])}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone={tone === "urgent" ? "error" : tone}>{audience}</Badge>
          <h3 className="heading-font mt-3 text-2xl font-bold">{title}</h3>
        </div>
        {date ? (
          <time className="inline-flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4" />
            {date}
          </time>
        ) : null}
      </div>
      <div className="mt-4 leading-7">{children}</div>
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </article>
  );
}

export type AnnouncementCardProps = {
  title: string;
  category?: string;
  date?: string;
  author?: string;
  featured?: boolean;
  children: ReactNode;
  actions?: ReactNode;
};

export function AnnouncementCard({
  title,
  category = "Announcement",
  date,
  author,
  featured = false,
  children,
  actions,
}: AnnouncementCardProps) {
  return (
    <Card className={cx(featured && "border-status-warning bg-status-warning")}>
      <div className="flex items-start gap-4">
        <div
          className={cx(
            "flex size-12 shrink-0 items-center justify-center radius-lg",
            featured
              ? "bg-surface-card text-brand-gold"
              : "bg-brand-primary-soft text-brand",
          )}
        >
          {featured ? (
            <Star className="size-6" aria-hidden="true" />
          ) : (
            <Megaphone className="size-6" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge tone={featured ? "gold" : "burgundy"}>{category}</Badge>
            {date ? (
              <Badge tone="neutral">
                <Clock3 className="size-3" /> {date}
              </Badge>
            ) : null}
          </div>
          <h3 className="heading-font mt-3 text-xl font-bold text-primary">
            {title}
          </h3>
          {author ? (
            <p className="mt-1 text-sm text-tertiary">Shared by {author}</p>
          ) : null}
          <div className="mt-3 leading-7 text-secondary">{children}</div>
        </div>
      </div>
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );
}

export function StudentSupportSummary({
  interventions,
  activity,
}: {
  interventions: InterventionCardProps[];
  activity: ActivityFeedItem[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-5">
        {interventions.map((intervention) => (
          <InterventionCard key={intervention.title} {...intervention} />
        ))}
      </div>
      <ActivityFeed title="Support activity" items={activity} />
    </div>
  );
}

export function SchoolPatternActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" leftIcon={<CheckCircle2 className="size-4" />}>
        Save update
      </Button>
      <Button
        variant="outline"
        leftIcon={<HeartHandshake className="size-4" />}
      >
        Request support
      </Button>
    </div>
  );
}
