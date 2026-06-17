import { type ReactNode, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Copy,
  FileText,
  Lightbulb,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Textarea,
} from "./UIPrimitives";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type AIMessageRole = "user" | "assistant" | "system";

export type AIMessage = {
  id: string;
  role: AIMessageRole;
  content: ReactNode;
  timestamp?: string;
  status?: "sending" | "complete" | "error";
  citations?: Array<{
    label: string;
    href?: string;
  }>;
};

export type AIChatInterfaceProps = {
  title?: string;
  description?: ReactNode;
  messages: AIMessage[];
  promptValue: string;
  onPromptChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  suggestions?: string[];
  reviewBanner?: ReactNode;
};

export function AIChatInterface({
  title = "MWS AI assistant",
  description = "Use AI to draft, summarize, or explore options. Review all outputs before using them in school records or communication.",
  messages,
  promptValue,
  onPromptChange,
  onSubmit,
  loading = false,
  disabled = false,
  placeholder,
  suggestions = [],
  reviewBanner,
}: AIChatInterfaceProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-subtle bg-surface-base p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center radius-lg bg-brand-primary-soft text-brand">
            <Bot className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="heading-font text-xl font-bold text-primary">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-tertiary">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {reviewBanner ? <div className="mt-4">{reviewBanner}</div> : null}
      </div>

      <div className="max-h-136 min-h-80 overflow-y-auto p-5">
        {messages.length ? (
          <div className="grid gap-4">
            {messages.map((message) => (
              <AIChatMessage key={message.id} message={message} />
            ))}
            {loading ? <AIThinkingState /> : null}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="Start with a clear prompt"
            description="Ask for a draft, summary, checklist, or reflection support. Keep student-sensitive context minimal and review the result carefully."
          />
        )}
      </div>

      <div className="border-t border-subtle bg-surface-base p-5">
        {suggestions.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="focus-ring heading-font radius-full border border-subtle bg-surface-card px-3 py-1.5 text-xs font-bold text-secondary transition hover:bg-brand-primary-soft hover:text-brand"
                type="button"
                onClick={() => onPromptChange(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
        <AIPromptInput
          value={promptValue}
          onChange={onPromptChange}
          onSubmit={onSubmit}
          loading={loading}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    </Card>
  );
}

export function AIChatMessage({ message }: { message: AIMessage }) {
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  return (
    <article
      className={cx(
        "flex gap-3",
        message.role === "user" && "flex-row-reverse text-right"
      )}
    >
      <div
        className={cx(
          "flex size-9 shrink-0 items-center justify-center radius-full",
          isAssistant || isSystem
            ? "bg-brand-primary-soft text-brand"
            : "bg-brand-navy-soft text-brand-navy"
        )}
      >
        {isAssistant || isSystem ? (
          <Bot className="size-4" />
        ) : (
          <UserRound className="size-4" />
        )}
      </div>
      <div
        className={cx(
          "max-w-[82%] radius-xl border p-4",
          isSystem
            ? "border-status-warning bg-status-warning text-status-warning"
            : isAssistant
            ? "border-subtle bg-surface-card text-primary"
            : "border-brand bg-brand-primary-soft text-brand"
        )}
      >
        <div className="text-sm leading-6">{message.content}</div>
        {message.citations?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((citation) =>
              citation.href ? (
                <a
                  key={citation.label}
                  className="focus-ring radius-sm text-xs font-bold text-link"
                  href={citation.href}
                >
                  {citation.label}
                </a>
              ) : (
                <Badge key={citation.label} tone="neutral">
                  {citation.label}
                </Badge>
              )
            )}
          </div>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center justify-end gap-2 text-xs text-tertiary">
          {message.status === "sending" ? <span>Sending…</span> : null}
          {message.status === "error" ? (
            <span className="text-status-error">Could not send</span>
          ) : null}
          {message.timestamp ? <time>{message.timestamp}</time> : null}
        </div>
      </div>
    </article>
  );
}

export type AIPromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: ReactNode;
  maxLength?: number;
};

export function AIPromptInput({
  value,
  onChange,
  onSubmit,
  loading = false,
  disabled = false,
  placeholder = "Ask AI to draft, summarize, or suggest next steps…",
  label = "Prompt",
  helperText = "Do not include unnecessary sensitive student data. AI output must be reviewed before use.",
  maxLength = 2000,
}: AIPromptInputProps) {
  const remaining = maxLength - value.length;
  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="grid gap-3">
      <Textarea
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        helperText={helperText}
        maxLength={maxLength}
        disabled={disabled || loading}
        rows={4}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={cx(
            "text-xs",
            remaining < 100 ? "text-status-warning" : "text-tertiary"
          )}
        >
          {remaining} characters remaining · Press Cmd/Ctrl + Enter to send
        </p>
        <Button
          onClick={submit}
          loading={loading}
          disabled={disabled || !value.trim()}
          rightIcon={<Send className="size-4" />}
        >
          Send prompt
        </Button>
      </div>
    </div>
  );
}

export type AIResponseCardProps = {
  title?: string;
  response: ReactNode;
  confidence?: "low" | "medium" | "high";
  citations?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: ReactNode;
  warning?: ReactNode;
};

export function AIResponseCard({
  title = "AI response",
  response,
  confidence,
  citations = [],
  actions,
  warning,
}: AIResponseCardProps) {
  const confidenceTone = {
    low: "warning",
    medium: "info",
    high: "success",
  } as const;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center radius-lg bg-brand-primary-soft text-brand">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="heading-font text-xl font-bold text-primary">
              {title}
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Generated content. Verify before using.
            </p>
          </div>
        </div>
        {confidence ? (
          <Badge tone={confidenceTone[confidence]}>
            {confidence} confidence
          </Badge>
        ) : null}
      </div>
      {warning ? (
        <div className="mt-4">
          <Alert tone="warning">{warning}</Alert>
        </div>
      ) : null}
      <div className="mt-5 rounded-xl border border-subtle bg-surface-base p-4 leading-7 text-secondary">
        {response}
      </div>
      {citations.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {citations.map((citation) =>
            citation.href ? (
              <a
                key={citation.label}
                className="focus-ring radius-sm text-sm font-bold text-link"
                href={citation.href}
              >
                {citation.label}
              </a>
            ) : (
              <Badge key={citation.label} tone="neutral">
                {citation.label}
              </Badge>
            )
          )}
        </div>
      ) : null}
      {actions ? (
        <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </Card>
  );
}

export function AIThinkingState({
  label = "AI is preparing a thoughtful response…",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 radius-xl border border-subtle bg-surface-card p-4 text-tertiary"
      role="status"
      aria-live="polite"
    >
      <div className="flex size-9 items-center justify-center radius-full bg-brand-primary-soft text-brand">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      </div>
      <div>
        <p className="heading-font text-sm font-bold text-primary">
          Thinking with care
        </p>
        <p className="text-sm leading-6">{label}</p>
      </div>
    </div>
  );
}

export type AIReviewBannerProps = {
  severity?: "info" | "warning" | "error";
  title?: string;
  children?: ReactNode;
};

export function AIReviewBanner({
  severity = "warning",
  title = "Human review required",
  children = "Review AI-generated content for accuracy, tone, fairness, and student privacy before saving, sending, or publishing.",
}: AIReviewBannerProps) {
  return (
    <Alert tone={severity} title={title}>
      {children}
    </Alert>
  );
}

export type PromptTemplate = {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  category?: string;
  icon?: ReactNode;
};

export type PromptTemplatePickerProps = {
  templates: PromptTemplate[];
  onSelect: (template: PromptTemplate) => void;
  title?: string;
  selectedId?: string;
};

export function PromptTemplatePicker({
  templates,
  onSelect,
  title = "Prompt templates",
  selectedId,
}: PromptTemplatePickerProps) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          templates
            .map((template) => template.category)
            .filter((category): category is string => Boolean(category))
        )
      ),
    [templates]
  );
  const [category, setCategory] = useState<string>("all");
  const visibleTemplates =
    category === "all"
      ? templates
      : templates.filter((template) => template.category === category);

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="heading-font text-xl font-bold text-primary">
            {title}
          </h3>
          <p className="mt-1 text-sm text-tertiary">
            Start from approved MWS prompt structures.
          </p>
        </div>
        {categories.length ? (
          <div className="flex flex-wrap gap-2">
            <button
              className={cx(
                "focus-ring heading-font radius-full px-3 py-1.5 text-xs font-bold",
                category === "all"
                  ? "bg-brand-primary text-inverse"
                  : "bg-surface-base text-secondary"
              )}
              type="button"
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item}
                className={cx(
                  "focus-ring heading-font radius-full px-3 py-1.5 text-xs font-bold",
                  category === item
                    ? "bg-brand-primary text-inverse"
                    : "bg-surface-base text-secondary"
                )}
                type="button"
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {visibleTemplates.map((template) => {
          const selected = selectedId === template.id;
          return (
            <button
              key={template.id}
              className={cx(
                "focus-ring flex gap-3 radius-xl border p-4 text-left transition hover:bg-surface-base",
                selected
                  ? "border-brand bg-brand-primary-soft"
                  : "border-subtle bg-surface-card"
              )}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(template)}
            >
              <span className="flex size-10 shrink-0 items-center justify-center radius-lg bg-brand-primary-soft text-brand">
                {template.icon ?? (
                  <Lightbulb className="size-5" aria-hidden="true" />
                )}
              </span>
              <span>
                <span className="heading-font block text-sm font-bold text-primary">
                  {template.title}
                </span>
                {template.description ? (
                  <span className="mt-1 block text-sm leading-6 text-tertiary">
                    {template.description}
                  </span>
                ) : null}
                {template.category ? (
                  <Badge className="mt-3" tone="neutral">
                    {template.category}
                  </Badge>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export type GeneratedContentReviewStatus =
  | "draft"
  | "needs-review"
  | "approved"
  | "rejected";

export type GeneratedContentReviewProps = {
  title?: string;
  content: ReactNode;
  status?: GeneratedContentReviewStatus;
  reviewer?: string;
  checklist?: Array<{
    id: string;
    label: string;
    checked: boolean;
  }>;
  onChecklistChange?: (id: string, checked: boolean) => void;
  onApprove?: () => void;
  onReject?: () => void;
  onCopy?: () => void;
  notes?: ReactNode;
};

export function GeneratedContentReview({
  title = "Generated content review",
  content,
  status = "needs-review",
  reviewer,
  checklist = [],
  onChecklistChange,
  onApprove,
  onReject,
  onCopy,
  notes,
}: GeneratedContentReviewProps) {
  const statusTone = {
    draft: "neutral",
    "needs-review": "warning",
    approved: "success",
    rejected: "error",
  } as const;
  const requiredChecksComplete =
    checklist.length === 0 || checklist.every((item) => item.checked);

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center radius-lg bg-brand-navy-soft text-brand-navy">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="heading-font text-xl font-bold text-primary">
              {title}
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Approve only after checking accuracy, privacy, bias, and tone.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone[status]}>{status.replace("-", " ")}</Badge>
          {reviewer ? <Badge tone="neutral">Reviewer: {reviewer}</Badge> : null}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-subtle bg-surface-base p-4 leading-7 text-secondary">
        {content}
      </div>

      {checklist.length ? (
        <div className="mt-5">
          <p className="heading-font text-sm font-bold text-primary">
            Review checklist
          </p>
          <div className="mt-3 grid gap-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 radius-lg border border-subtle bg-surface-card p-3"
              >
                <input
                  className="focus-ring mt-1 size-4 accent-(--mws-color-brand-primary)"
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) =>
                    onChecklistChange?.(item.id, event.target.checked)
                  }
                />
                <span className="text-sm leading-6 text-secondary">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {notes ? (
        <div className="mt-5 text-sm leading-6 text-tertiary">{notes}</div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {onCopy ? (
          <Button
            variant="outline"
            leftIcon={<Copy className="size-4" />}
            onClick={onCopy}
          >
            Copy draft
          </Button>
        ) : null}
        {onReject ? (
          <Button
            variant="ghost"
            leftIcon={<XCircle className="size-4" />}
            onClick={onReject}
          >
            Request revision
          </Button>
        ) : null}
        {onApprove ? (
          <Button
            variant="primary"
            leftIcon={<CheckCircle2 className="size-4" />}
            disabled={!requiredChecksComplete}
            onClick={onApprove}
          >
            Approve content
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export function AIWorkflowEmptyState() {
  return (
    <EmptyState
      icon={<MessageCircle className="size-5" />}
      title="No AI draft yet"
      description="Choose an approved prompt template or write a focused prompt to generate a draft for review."
      action={
        <Button leftIcon={<FileText className="size-4" />}>
          Choose template
        </Button>
      }
    />
  );
}

export function AIPrivacyWarning() {
  return (
    <AIReviewBanner severity="warning" title="Protect student privacy">
      Include only the minimum context needed. Do not paste unnecessary
      sensitive details, health information, private family context, or
      confidential records into AI prompts.
    </AIReviewBanner>
  );
}

export function AIGeneratedContentActions({
  onApprove,
  onRevise,
}: {
  onApprove?: () => void;
  onRevise?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        leftIcon={<CheckCircle2 className="size-4" />}
        onClick={onApprove}
      >
        Approve after review
      </Button>
      <Button
        variant="outline"
        leftIcon={<AlertTriangle className="size-4" />}
        onClick={onRevise}
      >
        Request revision
      </Button>
    </div>
  );
}
