import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, Input, Modal } from "./UIPrimitives";

describe("Button", () => {
  it("renders a button with the requested variant, size, and click behavior", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button variant="gold" size="lg" onClick={onClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-[var(--mws-color-action-gold-background)]");
    expect(button).toHaveClass("min-h-[52px]");

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders href buttons as links and marks loading controls busy/disabled", () => {
    render(
      <>
        <Button href="/learn-more" variant="outline">
          Learn more
        </Button>
        <Button loading>Submitting</Button>
      </>,
    );

    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "/learn-more",
    );

    const loadingButton = screen.getByRole("button", { name: "Submitting" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
  });
});

describe("Input", () => {
  it("connects label, helper text, error text, and validity state", () => {
    render(
      <Input
        id="email"
        label="Email address"
        helperText="Use your school email."
        error="Email is required."
        required
      />,
    );

    const input = screen.getByLabelText(/email address/i);
    const helper = screen.getByText("Use your school email.");
    const error = screen.getByText("Email is required.");

    expect(input).toHaveAttribute("id", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      `${helper.id} ${error.id}`,
    );
  });

  it("forwards standard input props and refs", () => {
    const ref = vi.fn();

    render(
      <Input
        ref={ref}
        label="Search"
        placeholder="Find a pattern"
        defaultValue="Admissions"
      />,
    );

    const input = screen.getByPlaceholderText("Find a pattern");
    expect(input).toHaveValue("Admissions");
    expect(ref).toHaveBeenCalledWith(input);
  });
});

describe("Modal", () => {
  function ControlledModal() {
    const [open, setOpen] = useState(true);

    return (
      <>
        <button type="button">Open trigger</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Confirm action"
          description="This action cannot be undone."
          footer={<Button>Confirm</Button>}
        >
          <p>Review the details before continuing.</p>
        </Modal>
      </>
    );
  }

  it("renders an accessible dialog in a portal when open", () => {
    render(<ControlledModal />);

    const dialog = screen.getByRole("dialog", { name: "Confirm action" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(
      "This action cannot be undone.",
    );
    expect(screen.getByText("Review the details before continuing.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "hidden" });
  });

  it("closes with the close button and restores body overflow", async () => {
    const user = userEvent.setup();

    render(<ControlledModal />);

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(<ControlledModal />);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
