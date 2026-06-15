import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { cx } from "./classNames";

export type FormWizardStep = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  optional?: boolean;
  disabled?: boolean;
  validate?: () => boolean | Promise<boolean>;
};

export type FormWizardProps = {
  steps: FormWizardStep[];
  currentStepId?: string;
  defaultStepId?: string;
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void | Promise<void>;
  onCancel?: () => void;
  nextLabel?: ReactNode;
  backLabel?: ReactNode;
  completeLabel?: ReactNode;
  cancelLabel?: ReactNode;
  loading?: boolean;
};

function findFirstEnabledStep(steps: FormWizardStep[]) {
  return steps.find((step) => !step.disabled) ?? steps[0];
}

function findStepById(steps: FormWizardStep[], stepId?: string) {
  return steps.find((step) => step.id === stepId);
}

function resolveInitialStepId(
  steps: FormWizardStep[],
  currentStepId?: string,
  defaultStepId?: string
) {
  const controlledStep = findStepById(steps, currentStepId);
  if (controlledStep) {
    return controlledStep.id;
  }

  const defaultStep = findStepById(steps, defaultStepId);
  if (defaultStep && !defaultStep.disabled) {
    return defaultStep.id;
  }

  return findFirstEnabledStep(steps)?.id;
}

function getAdjacentEnabledStep(
  steps: FormWizardStep[],
  currentIndex: number,
  direction: "next" | "previous"
) {
  const step = direction === "next" ? 1 : -1;

  for (
    let index = currentIndex + step;
    index >= 0 && index < steps.length;
    index += step
  ) {
    if (!steps[index].disabled) {
      return steps[index];
    }
  }

  return undefined;
}

export function FormWizard({
  steps,
  currentStepId,
  defaultStepId,
  onStepChange,
  onComplete,
  onCancel,
  nextLabel = "Next",
  backLabel = "Back",
  completeLabel = "Complete",
  cancelLabel = "Cancel",
  loading = false,
}: FormWizardProps) {
  const generatedId = useId();
  const isControlled = currentStepId !== undefined;
  const [internalStepId, setInternalStepId] = useState(() =>
    resolveInitialStepId(steps, currentStepId, defaultStepId)
  );
  const [validating, setValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [completing, setCompleting] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasMountedRef = useRef(false);

  const activeStepId = isControlled ? currentStepId : internalStepId;
  const activeStep =
    findStepById(steps, activeStepId) ?? findFirstEnabledStep(steps);
  const activeIndex = activeStep
    ? steps.findIndex((step) => step.id === activeStep.id)
    : -1;

  const enabledSteps = useMemo(
    () => steps.filter((step) => !step.disabled),
    [steps]
  );
  const activeEnabledIndex = activeStep
    ? enabledSteps.findIndex((step) => step.id === activeStep.id)
    : -1;
  const progressValue =
    enabledSteps.length > 0 && activeEnabledIndex >= 0
      ? activeEnabledIndex + 1
      : 0;
  const previousStep = getAdjacentEnabledStep(steps, activeIndex, "previous");
  const nextStep = getAdjacentEnabledStep(steps, activeIndex, "next");
  const isFinalStep = !nextStep;
  const isBusy = loading || validating || completing;
  const progressLabel =
    enabledSteps.length > 0
      ? `Step ${progressValue} of ${enabledSteps.length}`
      : "No available steps";

  useEffect(() => {
    const resolvedStepId = resolveInitialStepId(
      steps,
      currentStepId,
      internalStepId ?? defaultStepId
    );

    if (!isControlled && resolvedStepId && resolvedStepId !== internalStepId) {
      setInternalStepId(resolvedStepId);
    }
  }, [currentStepId, defaultStepId, internalStepId, isControlled, steps]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    stepHeadingRef.current?.focus();
  }, [activeStep?.id]);

  if (!activeStep || steps.length === 0) {
    return (
      <section className="rounded-3xl border border-subtle bg-surface-card p-6 text-primary">
        <p className="text-sm text-tertiary">No wizard steps are available.</p>
      </section>
    );
  }

  const panelId = `${generatedId}-${activeStep.id}-panel`;
  const headingId = `${generatedId}-${activeStep.id}-heading`;
  const descriptionId = activeStep.description
    ? `${generatedId}-${activeStep.id}-description`
    : undefined;

  function commitStepChange(stepId: string) {
    if (!isControlled) {
      setInternalStepId(stepId);
    }

    setValidationMessage(null);
    onStepChange?.(stepId);
  }

  async function canLeaveCurrentStep() {
    if (!activeStep?.validate) {
      return true;
    }

    setValidating(true);
    setValidationMessage(null);

    try {
      const isValid = await activeStep.validate();

      if (!isValid) {
        setValidationMessage("Please complete this step before continuing.");
      }

      return isValid;
    } finally {
      setValidating(false);
    }
  }

  async function goToStep(step: FormWizardStep) {
    if (isBusy || step.disabled || step.id === activeStep.id) {
      return;
    }

    const targetIndex = steps.findIndex(
      (candidate) => candidate.id === step.id
    );
    const movingForward = targetIndex > activeIndex;

    if (movingForward && !(await canLeaveCurrentStep())) {
      return;
    }

    commitStepChange(step.id);
  }

  async function handleNext() {
    if (!nextStep || isBusy || !(await canLeaveCurrentStep())) {
      return;
    }

    commitStepChange(nextStep.id);
  }

  async function handleComplete() {
    if (isBusy || !(await canLeaveCurrentStep())) {
      return;
    }

    setCompleting(true);
    try {
      await onComplete?.();
    } finally {
      setCompleting(false);
    }
  }

  return (
    <section
      className="grid gap-6 rounded-3xl border border-subtle bg-surface-card p-6 text-primary shadow-card"
      aria-labelledby={headingId}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,18rem)_1fr] lg:gap-8">
        <aside className="grid content-start gap-4">
          <div className="grid gap-2">
            <p className="heading-font text-sm font-bold text-brand">
              {progressLabel}
            </p>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-muted"
              role="progressbar"
              aria-label="Form progress"
              aria-valuemin={0}
              aria-valuemax={enabledSteps.length}
              aria-valuenow={progressValue}
              aria-valuetext={progressLabel}
            >
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{
                  width:
                    enabledSteps.length > 0
                      ? `${(progressValue / enabledSteps.length) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>

          <nav aria-label="Form steps">
            <ol className="grid gap-2">
              {steps.map((step, index) => {
                const isCurrent = step.id === activeStep.id;
                const isComplete = activeIndex > index && !step.disabled;
                const stepButtonId = `${generatedId}-${step.id}-step`;

                return (
                  <li key={step.id}>
                    <button
                      id={stepButtonId}
                      type="button"
                      className={cx(
                        "focus-ring grid w-full grid-cols-[auto_1fr] gap-3 rounded-2xl border p-3 text-left transition",
                        isCurrent
                          ? "border-brand bg-(--mws-color-action-soft-background)"
                          : "border-subtle bg-surface-base hover:border-brand",
                        step.disabled &&
                          "cursor-not-allowed opacity-55 hover:border-subtle"
                      )}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-controls={isCurrent ? panelId : undefined}
                      disabled={step.disabled || isBusy}
                      onClick={() => void goToStep(step)}
                    >
                      <span
                        className={cx(
                          "heading-font mt-0.5 inline-flex size-7 items-center justify-center rounded-full border text-xs font-bold",
                          isComplete
                            ? "border-brand bg-brand text-inverse"
                            : "border-subtle bg-surface-card text-secondary",
                          isCurrent && "border-brand text-brand"
                        )}
                        aria-hidden="true"
                      >
                        {isComplete ? <Check className="size-4" /> : index + 1}
                      </span>
                      <span className="grid gap-1">
                        <span className="heading-font text-sm font-bold text-primary">
                          {step.title}
                        </span>
                        <span className="flex flex-wrap items-center gap-2 text-xs text-tertiary">
                          {step.optional ? <span>Optional</span> : null}
                          {step.disabled ? <span>Disabled</span> : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="grid gap-5">
          <header className="grid gap-2 border-b border-subtle pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                ref={stepHeadingRef}
                id={headingId}
                tabIndex={-1}
                className="heading-font text-2xl font-extrabold text-primary outline-none"
              >
                {activeStep.title}
              </h2>
              {activeStep.optional ? (
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-tertiary">
                  Optional
                </span>
              ) : null}
            </div>
            {activeStep.description ? (
              <p id={descriptionId} className="text-sm text-tertiary">
                {activeStep.description}
              </p>
            ) : null}
          </header>

          <div
            id={panelId}
            role="group"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className="min-h-48 rounded-2xl bg-surface-base p-4"
          >
            {activeStep.content}
          </div>

          <div aria-live="polite" className="min-h-5 text-sm text-error">
            {validationMessage}
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={onCancel} disabled={isBusy}>
              {cancelLabel}
            </Button>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  previousStep && commitStepChange(previousStep.id)
                }
                disabled={!previousStep || isBusy}
                leftIcon={<ChevronLeft className="size-4" />}
              >
                {backLabel}
              </Button>
              {isFinalStep ? (
                <Button
                  onClick={() => void handleComplete()}
                  loading={completing || loading}
                  disabled={validating}
                >
                  {completeLabel}
                </Button>
              ) : (
                <Button
                  onClick={() => void handleNext()}
                  disabled={isBusy || !nextStep}
                  loading={validating}
                  rightIcon={<ChevronRight className="size-4" />}
                >
                  {nextLabel}
                </Button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
