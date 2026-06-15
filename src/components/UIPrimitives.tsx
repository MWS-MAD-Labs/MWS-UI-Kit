import {
  createContext,
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react";
import { cx, overlayBackdropClassName } from "./classNames";

/* -------------------------------------------------------------------------------------------------
 * Button
 * -----------------------------------------------------------------------------------------------*/

const buttonBase =
  "focus-ring heading-font inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary:
    "bg-[var(--mws-color-action-primary-background)] text-[var(--mws-color-action-primary-text)] hover:bg-[var(--mws-color-action-primary-background-hover)]",
  gold: "bg-[var(--mws-color-action-gold-background)] text-[var(--mws-color-action-gold-text)] hover:bg-[var(--mws-color-action-gold-background-hover)]",
  soft: "bg-[var(--mws-color-action-soft-background)] text-[var(--mws-color-action-soft-text)] hover:bg-[var(--mws-color-action-soft-background-hover)]",
  outline:
    "border border-brand bg-[var(--mws-color-action-secondary-background)] text-[var(--mws-color-action-secondary-text)] hover:bg-[var(--mws-color-action-secondary-background-hover)]",
  ghost:
    "text-[var(--mws-color-action-ghost-text)] hover:bg-[var(--mws-color-action-ghost-background-hover)]",
  destructive:
    "bg-[var(--mws-color-status-error-text)] text-inverse hover:bg-[color-mix(in_srgb,var(--mws-color-status-error-text)_88%,black)]",
};

const buttonSizes = {
  sm: "min-h-9 px-3 py-2 text-sm",
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-[52px] px-6 py-3 text-base",
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  ariaLabel?: string;
};

type ButtonAsButtonProps = ButtonOwnProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonOwnProps | "href"
  > & {
    href?: never;
  };

type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps | "type"
  > & {
    href: string;
    disabled?: boolean;
    type?: never;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

function isButtonAnchorProps(props: ButtonProps): props is ButtonAsAnchorProps {
  return typeof props.href === "string";
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  if (isButtonAnchorProps(props)) {
    const {
      children,
      variant = "primary",
      size = "md",
      href,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      ariaLabel,
      disabled,
      ...anchorProps
    } = props;

    const classes = cx(
      buttonBase,
      buttonVariants[variant],
      buttonSizes[size],
      !disabled && !loading && "motion-hover-lift",
      fullWidth && "w-full",
      className
    );

    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        href={disabled || loading ? undefined : href}
        aria-label={ariaLabel}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        {...anchorProps}
      >
        {loading ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading ? rightIcon : null}
      </a>
    );
  }

  const {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    ariaLabel,
    disabled,
    type = "button",
    ...buttonProps
  } = props;

  const classes = cx(
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    !disabled && !loading && "motion-hover-lift",
    fullWidth && "w-full",
    className
  );

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading ? rightIcon : null}
    </button>
  );
});

/* -------------------------------------------------------------------------------------------------
 * IconButton
 * -----------------------------------------------------------------------------------------------*/

type IconButtonProps = {
  icon: ReactNode;
  label: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "size-9",
    md: "size-11",
    lg: "size-[52px]",
  };

  return (
    <button
      className={cx(
        buttonBase,
        buttonVariants[variant],
        sizeClasses[size],
        !disabled && !loading && "motion-hover-lift",
        className
      )}
      type={type}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        icon
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Card
 * -----------------------------------------------------------------------------------------------*/

type CardProps = {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined" | "soft" | "interactive";
  padding?: "none" | "compact" | "standard" | "spacious";
  className?: string;
} & ComponentPropsWithoutRef<"div">;

export function Card({
  children,
  variant = "default",
  padding = "standard",
  className = "",
  ...props
}: CardProps) {
  const variants = {
    default: "border border-subtle bg-surface-card card-shadow",
    elevated: "border border-subtle bg-surface-elevated shadow-lg",
    outlined: "border border-subtle bg-surface-card",
    soft: "border border-subtle bg-surface-base",
    interactive:
      "border border-subtle bg-surface-card card-shadow motion-hover-lift cursor-pointer",
  };
  const paddings = {
    none: "p-0",
    compact: "p-4",
    standard: "p-6",
    spacious: "p-8",
  };

  return (
    <div
      className={cx(
        "radius-xl",
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Badge
 * -----------------------------------------------------------------------------------------------*/

export type BadgeTone =
  | "burgundy"
  | "gold"
  | "rose"
  | "sage"
  | "navy"
  | "sky"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  size?: "sm" | "md";
  className?: string;
} & ComponentPropsWithoutRef<"span">;

export function Badge({
  children,
  tone = "burgundy",
  size = "sm",
  className = "",
  ...props
}: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    burgundy: "bg-brand-primary-soft text-brand",
    gold: "bg-status-warning text-status-warning",
    rose: "bg-status-error text-status-error",
    sage: "bg-status-success text-status-success",
    navy: "bg-brand-navy-soft text-brand-navy",
    sky: "bg-status-info text-status-info",
    success: "bg-status-success text-status-success",
    warning: "bg-status-warning text-status-warning",
    error: "bg-status-error text-status-error",
    info: "bg-status-info text-status-info",
    neutral: "bg-status-neutral text-tertiary",
  };
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={cx(
        "heading-font inline-flex items-center gap-1 radius-full font-bold",
        tones[tone],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Forms
 * -----------------------------------------------------------------------------------------------*/

type FieldShellProps = {
  id?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: (field: {
    id: string;
    describedBy?: string;
    invalid: boolean;
  }) => ReactNode;
};

function FieldShell({
  id,
  label,
  helperText,
  error,
  required,
  children,
}: FieldShellProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy =
    [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      {label ? (
        <label
          className="heading-font text-sm font-bold text-primary"
          htmlFor={fieldId}
        >
          {label}{" "}
          {required ? <span className="text-status-error">*</span> : null}
        </label>
      ) : null}
      {children({ id: fieldId, describedBy, invalid: Boolean(error) })}
      {helperText ? (
        <p id={helperId} className="text-sm leading-5 text-tertiary">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="text-sm font-semibold leading-5 text-status-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const fieldControlBase =
  "focus-ring min-h-11 w-full radius-md border border-subtle bg-surface-card px-4 py-3 text-primary outline-none transition placeholder:text-placeholder disabled:cursor-not-allowed disabled:bg-surface-base disabled:text-tertiary disabled:opacity-70";

export type InputProps = {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, className = "", id, required, ...props },
  ref
) {
  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <input
          ref={ref}
          id={fieldId}
          className={cx(
            fieldControlBase,
            invalid && "border-status-error",
            className
          )}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
});

type TextareaProps = {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  helperText,
  error,
  className = "",
  id,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <textarea
          id={fieldId}
          rows={rows}
          className={cx(
            fieldControlBase,
            "resize-y",
            invalid && "border-status-error",
            className
          )}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
}

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  options: SelectOption[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  helperText,
  error,
  placeholder,
  options,
  className = "",
  id,
  required,
  ...props
}: SelectProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <select
          id={fieldId}
          className={cx(
            fieldControlBase,
            "appearance-auto",
            invalid && "border-status-error",
            className
          )}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

type CheckboxProps = {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({
  label,
  description,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-primary">
        <input
          id={fieldId}
          type="checkbox"
          className={cx(
            "focus-ring mt-1 size-5 shrink-0 radius-sm accent-[var(--mws-color-brand-primary)]",
            className
          )}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          {...props}
        />
        <span>
          <span className="heading-font block text-sm font-bold">{label}</span>
          {description ? (
            <span
              id={descriptionId}
              className="mt-1 block text-sm leading-5 text-tertiary"
            >
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p
          id={errorId}
          className="text-sm font-semibold leading-5 text-status-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type RadioOption = {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  disabled?: boolean;
};

type RadioGroupProps = {
  label: ReactNode;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  error?: ReactNode;
  helperText?: ReactNode;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  error,
  helperText,
  onValueChange,
}: RadioGroupProps) {
  const groupId = useId();
  const helperId = helperText ? `${groupId}-helper` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy =
    [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset className="grid gap-3" aria-describedby={describedBy}>
      <legend className="heading-font text-sm font-bold text-primary">
        {label}
      </legend>
      {helperText ? (
        <p id={helperId} className="text-sm leading-5 text-tertiary">
          {helperText}
        </p>
      ) : null}
      <div className="grid gap-3">
        {options.map((option) => {
          const id = `${groupId}-${option.value}`;
          return (
            <label
              key={option.value}
              className={cx(
                "flex cursor-pointer items-start gap-3 radius-lg border border-subtle bg-surface-card p-4 transition",
                option.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <input
                id={id}
                className="focus-ring mt-1 size-5 shrink-0 accent-[var(--mws-color-brand-primary)]"
                type="radio"
                name={name}
                value={option.value}
                checked={value ? value === option.value : undefined}
                defaultChecked={
                  defaultValue ? defaultValue === option.value : undefined
                }
                disabled={option.disabled}
                onChange={(event) => onValueChange?.(event.target.value)}
              />
              <span>
                <span className="heading-font block text-sm font-bold text-primary">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="mt-1 block text-sm leading-5 text-tertiary">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p
          id={errorId}
          className="text-sm font-semibold leading-5 text-status-error"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Alert
 * -----------------------------------------------------------------------------------------------*/

type AlertTone = "info" | "success" | "warning" | "error" | "neutral";

type AlertProps = {
  tone?: AlertTone;
  title?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"div">;

export function Alert({
  tone = "info",
  title,
  children,
  icon,
  className = "",
  ...props
}: AlertProps) {
  const tones: Record<AlertTone, string> = {
    info: "border-status-info bg-status-info text-status-info",
    success: "border-status-success bg-status-success text-status-success",
    warning: "border-status-warning bg-status-warning text-status-warning",
    error: "border-status-error bg-status-error text-status-error",
    neutral: "border-subtle bg-surface-base text-secondary",
  };
  const defaultIcons: Record<AlertTone, ReactNode> = {
    info: <Info aria-hidden="true" className="size-5" />,
    success: <CheckCircle2 aria-hidden="true" className="size-5" />,
    warning: <TriangleAlert aria-hidden="true" className="size-5" />,
    error: <AlertCircle aria-hidden="true" className="size-5" />,
    neutral: <Info aria-hidden="true" className="size-5" />,
  };

  return (
    <div
      className={cx("flex gap-3 radius-lg border p-4", tones[tone], className)}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{icon ?? defaultIcons[tone]}</div>
      <div>
        {title ? <p className="heading-font font-bold">{title}</p> : null}
        <div className={cx("text-sm leading-6", title && "mt-1")}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

type ToastTone = "info" | "success" | "warning" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  notify: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const value = useMemo<ToastContextValue>(() => {
    return {
      notify: (toast) => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { ...toast, id }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== id));
        }, 5000);
        return id;
      },
      dismiss: (id) => {
        setToasts((current) => current.filter((item) => item.id !== id));
      },
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={value.dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const badgeTone: Record<ToastTone, BadgeTone> = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
  };

  return (
    <div
      className="radius-lg border border-subtle bg-surface-elevated p-4 shadow-lg"
      role={toast.tone === "error" ? "alert" : "status"}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone={badgeTone[toast.tone]}>{toast.tone}</Badge>
          <p className="heading-font mt-2 font-bold text-primary">
            {toast.title}
          </p>
          {toast.description ? (
            <p className="mt-1 text-sm leading-5 text-tertiary">
              {toast.description}
            </p>
          ) : null}
        </div>
        <IconButton
          icon={<X className="size-4" />}
          label="Dismiss notification"
          size="sm"
          onClick={() => onDismiss(toast.id)}
        />
      </div>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[70] grid w-[min(24rem,calc(100vw-2rem))] gap-3"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Modal
 * -----------------------------------------------------------------------------------------------*/

const focusableElementSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableElementSelector)
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true"
  );
}

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    closeLabel = "Close dialog",
  },
  ref
) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableElements = getFocusableElements(panelRef.current);
    (focusableElements[0] ?? panelRef.current)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [open, onOpenChange]);

  const setPanelRef = (node: HTMLDivElement | null) => {
    panelRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(panelRef.current);
    if (!focusableElements.length) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className={cx(
        "fixed inset-0 z-[60] flex items-center justify-center p-4",
        overlayBackdropClassName
      )}
      role="presentation"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        ref={setPanelRef}
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-auto radius-xl border border-subtle bg-surface-elevated p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={trapFocus}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="heading-font text-2xl font-bold text-primary"
            >
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-2 leading-6 text-tertiary">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            icon={<X className="size-4" />}
            label={closeLabel}
            size="sm"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="mt-6">{children}</div>
        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
});

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
};

export function Tabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  label = "Section tabs",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? tabs[0]?.id
  );
  const selectedValue = value ?? internalValue;
  const selectedTab = tabs.find((tab) => tab.id === selectedValue) ?? tabs[0];

  const selectTab = (id: string) => {
    setInternalValue(id);
    onValueChange?.(id);
  };

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 border-b border-subtle"
        role="tablist"
        aria-label={label}
      >
        {tabs.map((tab) => {
          const selected = tab.id === selectedTab?.id;
          return (
            <button
              key={tab.id}
              className={cx(
                "focus-ring heading-font -mb-px border-b-2 px-4 py-3 text-sm font-bold transition",
                selected
                  ? "border-[var(--mws-color-brand-primary)] text-brand"
                  : "border-transparent text-tertiary hover:text-brand",
                tab.disabled && "cursor-not-allowed opacity-50"
              )}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              disabled={tab.disabled}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {selectedTab ? (
        <div
          id={`${selectedTab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${selectedTab.id}-tab`}
          className="pt-5"
        >
          {selectedTab.content}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Skeleton
 * -----------------------------------------------------------------------------------------------*/

export function Skeleton({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cx(
        "animate-pulse radius-md bg-[color-mix(in_srgb,var(--mws-color-border-subtle)_70%,transparent)]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * EmptyState
 * -----------------------------------------------------------------------------------------------*/

type EmptyStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cx(
        "radius-xl border border-dashed border-status-warning bg-status-warning p-6 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mx-auto mb-4 flex size-12 items-center justify-center radius-full bg-surface-card text-brand-gold">
          {icon}
        </div>
      ) : null}
      <h3 className="heading-font text-lg font-bold text-brand">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary">
        {description}
      </p>
      {action || secondaryAction ? (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Existing documentation helpers
 * -----------------------------------------------------------------------------------------------*/

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
        <p className="heading-font mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          "heading-font text-3xl font-extrabold tracking-tight md:text-4xl",
          inverse ? "text-inverse" : "text-brand"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cx(
            "mt-4 text-lg leading-8",
            inverse
              ? "text-[color-mix(in_srgb,var(--mws-color-text-inverse)_75%,transparent)]"
              : "text-secondary"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function InputPreview() {
  return (
    <Input
      id="school-email"
      label="School email"
      placeholder="name@millennia21.id"
      helperText="Use clear helper text so users know what to do next."
    />
  );
}

export function ProgressBar({
  value,
  tone = "burgundy",
  label = "Progress",
}: {
  value: number;
  tone?: "burgundy" | "gold" | "sage" | "rose" | "navy";
  label?: string;
}) {
  const tones = {
    burgundy: "bg-brand-primary",
    gold: "bg-brand-gold",
    sage: "bg-brand-sage",
    rose: "bg-brand-rose",
    navy: "bg-brand-navy",
  };
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-3 overflow-hidden radius-full bg-surface-sunken"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
    >
      <div
        className={cx("motion-progress-grow h-full radius-full", tones[tone])}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}

export function EmptyStatePreview() {
  return (
    <EmptyState
      icon={<CheckCircle2 size={24} />}
      title="No reflections yet"
      description="Once students begin sharing their check-ins, their wellbeing patterns will appear here."
    />
  );
}

export function LinkButton({ children }: { children: ReactNode }) {
  return (
    <a
      className="heading-font inline-flex items-center gap-2 text-sm font-bold text-link"
      href="#implementation"
    >
      {children} <ArrowRight size={16} />
    </a>
  );
}
