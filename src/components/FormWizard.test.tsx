import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormWizard, type FormWizardStep } from "./FormWizard";

const steps: FormWizardStep[] = [
  {
    id: "student",
    title: "Student details",
    description: "Basic profile information.",
    content: <p>Student form</p>,
  },
  {
    id: "guardian",
    title: "Guardian details",
    content: <p>Guardian form</p>,
    optional: true,
  },
  {
    id: "review",
    title: "Review",
    content: <p>Review summary</p>,
  },
];

describe("FormWizard", () => {
  it("renders the current step, progress, optional marker, and navigates next/back", async () => {
    const user = userEvent.setup();

    render(<FormWizard steps={steps} />);

    expect(screen.getByRole("heading", { name: "Student details" })).toBeInTheDocument();
    expect(screen.getByText("Student form")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Form progress" })).toHaveAttribute(
      "aria-valuetext",
      "Step 1 of 3",
    );
    expect(screen.getAllByText("Optional")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByRole("heading", { name: "Guardian details" })).toHaveFocus();
    expect(screen.getByText("Guardian form")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Form progress" })).toHaveAttribute(
      "aria-valuetext",
      "Step 2 of 3",
    );

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByText("Student form")).toBeInTheDocument();
  });

  it("skips disabled steps and prevents selecting them", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <FormWizard
        steps={[
          steps[0],
          { ...steps[1], disabled: true },
          steps[2],
        ]}
        onStepChange={onStepChange}
      />,
    );

    const disabledStep = screen.getByRole("button", { name: /guardian details/i });
    expect(disabledStep).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText("Review summary")).toBeInTheDocument();
    expect(onStepChange).toHaveBeenCalledWith("review");
  });

  it("blocks forward navigation when validation fails and allows it when validation passes", async () => {
    const user = userEvent.setup();
    const validate = vi.fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    render(
      <FormWizard
        steps={[
          { ...steps[0], validate },
          steps[1],
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(validate).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Student form")).toBeInTheDocument();
    expect(
      screen.getByText("Please complete this step before continuing."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("Guardian form")).toBeInTheDocument();
    });
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it("supports controlled currentStepId", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    function ControlledWizard() {
      const [stepId, setStepId] = useState("student");

      return (
        <FormWizard
          steps={steps}
          currentStepId={stepId}
          onStepChange={(nextStepId) => {
            onStepChange(nextStepId);
            setStepId(nextStepId);
          }}
        />
      );
    }

    render(<ControlledWizard />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onStepChange).toHaveBeenCalledWith("guardian");
    expect(screen.getByText("Guardian form")).toBeInTheDocument();
  });

  it("uses uncontrolled defaultStepId", () => {
    render(<FormWizard steps={steps} defaultStepId="guardian" />);

    expect(screen.getByText("Guardian form")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Form progress" })).toHaveAttribute(
      "aria-valuetext",
      "Step 2 of 3",
    );
  });

  it("fires callbacks for step change, cancel, and complete", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    const onCancel = vi.fn();
    const onComplete = vi.fn().mockResolvedValue(undefined);

    render(
      <FormWizard
        steps={steps}
        defaultStepId="review"
        onStepChange={onStepChange}
        onCancel={onCancel}
        onComplete={onComplete}
      />,
    );

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(onStepChange).toHaveBeenCalledWith("guardian");

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /next/i }));
    await user.click(screen.getByRole("button", { name: /complete/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("exposes accessible progress and step navigation semantics", () => {
    render(<FormWizard steps={steps} />);

    expect(screen.getByRole("navigation", { name: "Form steps" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Form progress" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
    expect(screen.getByRole("button", { name: /student details/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("group", { name: "Student details" })).toHaveAccessibleDescription(
      "Basic profile information.",
    );
  });
});
