import { type ReactNode, useState } from "react";
import { FormWizard, type FormWizardStep } from "./FormWizard";

const basicSteps: FormWizardStep[] = [
  {
    id: "student",
    title: "Student details",
    description: "Basic profile information.",
    content: (
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-bold text-secondary">
          Student name
          <input
            className="rounded-xl border border-subtle bg-surface-card px-3 py-2 font-normal text-primary"
            defaultValue="Amelia Johnson"
          />
        </label>
        <label className="grid gap-1 text-sm font-bold text-secondary">
          Year group
          <input
            className="rounded-xl border border-subtle bg-surface-card px-3 py-2 font-normal text-primary"
            defaultValue="Year 8"
          />
        </label>
      </div>
    ),
  },
  {
    id: "guardian",
    title: "Guardian details",
    description: "Primary contact and consent information.",
    content: (
      <p className="text-sm text-secondary">Add guardian contact details.</p>
    ),
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm the summary before submitting.",
    content: (
      <div className="grid gap-2 text-sm text-secondary">
        <p>Student: Amelia Johnson</p>
        <p>Year group: Year 8</p>
        <p>Guardian: Ready to review</p>
      </div>
    ),
  },
];

function StoryFrame({ children }: { children: ReactNode }) {
  return <div className="bg-surface-base p-6 text-primary">{children}</div>;
}

export default {
  title: "Components/FormWizard",
  component: FormWizard,
};

export function BasicWizard() {
  return (
    <StoryFrame>
      <FormWizard steps={basicSteps} />
    </StoryFrame>
  );
}

export function AsyncValidation() {
  const [valid, setValid] = useState(false);

  return (
    <StoryFrame>
      <FormWizard
        steps={[
          {
            id: "student",
            title: "Student details",
            description: "Toggle the checkbox to pass async validation.",
            content: (
              <label className="flex items-center gap-2 text-sm text-secondary">
                <input
                  type="checkbox"
                  checked={valid}
                  onChange={(event) => setValid(event.currentTarget.checked)}
                />
                Student details are complete
              </label>
            ),
            validate: async () => {
              await new Promise((resolve) => window.setTimeout(resolve, 600));
              return valid;
            },
          },
          basicSteps[2],
        ]}
      />
    </StoryFrame>
  );
}

export function OptionalStep() {
  return (
    <StoryFrame>
      <FormWizard
        steps={[
          basicSteps[0],
          {
            ...basicSteps[1],
            optional: true,
          },
          basicSteps[2],
        ]}
      />
    </StoryFrame>
  );
}

export function DisabledStep() {
  return (
    <StoryFrame>
      <FormWizard
        steps={[
          basicSteps[0],
          {
            ...basicSteps[1],
            disabled: true,
          },
          basicSteps[2],
        ]}
      />
    </StoryFrame>
  );
}

export function ControlledWizard() {
  const [currentStepId, setCurrentStepId] = useState("student");

  return (
    <StoryFrame>
      <div className="mb-4 flex flex-wrap gap-2">
        {basicSteps.map((step) => (
          <button
            key={step.id}
            type="button"
            className="rounded-full border border-subtle px-3 py-2 text-sm font-bold"
            onClick={() => setCurrentStepId(step.id)}
          >
            Go to {step.id}
          </button>
        ))}
      </div>
      <FormWizard
        steps={basicSteps}
        currentStepId={currentStepId}
        onStepChange={setCurrentStepId}
      />
    </StoryFrame>
  );
}

export function LoadingCompleteState() {
  return (
    <StoryFrame>
      <FormWizard steps={basicSteps} defaultStepId="review" loading />
    </StoryFrame>
  );
}
