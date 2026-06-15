import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette, type CommandPaletteItem } from "./CommandPalette";

const items: CommandPaletteItem[] = [
  {
    id: "students",
    label: "Open students",
    description: "Go to student records",
    keywords: ["learners", "directory"],
    shortcut: "⌘S",
  },
  {
    id: "disabled",
    label: "Disabled command",
    description: "Unavailable action",
    disabled: true,
  },
  {
    id: "reports",
    label: "Open reports",
    description: "Review analytics",
    keywords: ["insights"],
  },
];

function ControlledCommandPalette({
  initialOpen = false,
  onSelect,
}: {
  initialOpen?: boolean;
  onSelect?: (item: CommandPaletteItem) => void;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        onSelect={onSelect}
      />
    </>
  );
}

describe("CommandPalette", () => {
  it("renders, opens with a trigger, and closes with Escape", async () => {
    const user = userEvent.setup();

    render(<ControlledCommandPalette />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open palette" }));

    expect(
      screen.getByRole("dialog", { name: "Command palette" })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Search commands" })
      ).toHaveFocus();
    });

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("filters commands by label, description, and keywords", async () => {
    const user = userEvent.setup();

    render(<CommandPalette open onOpenChange={vi.fn()} items={items} />);

    const search = screen.getByRole("combobox", { name: "Search commands" });

    await user.type(search, "reports");
    expect(
      screen.getByRole("option", { name: /open reports/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /open students/i })
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "analytics");
    expect(
      screen.getByRole("option", { name: /open reports/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /open students/i })
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "learners");
    expect(
      screen.getByRole("option", { name: /open students/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /open reports/i })
    ).not.toBeInTheDocument();
  });

  it("moves the active command with arrows, skips disabled commands, selects with Enter, and closes", async () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onSelect={onSelect}
        items={items}
      />
    );

    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith(items[2]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("runs a command with mouse click and closes", async () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onSelect={onSelect}
        items={items}
      />
    );

    await user.click(screen.getByRole("option", { name: /open reports/i }));

    expect(onSelect).toHaveBeenCalledWith(items[2]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not select disabled commands", async () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onSelect={onSelect}
        items={items}
      />
    );

    await user.click(screen.getByRole("option", { name: /disabled command/i }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("shows an empty result state", async () => {
    const user = userEvent.setup();

    render(<CommandPalette open onOpenChange={vi.fn()} items={items} />);

    await user.type(
      screen.getByRole("combobox", { name: "Search commands" }),
      "nope"
    );

    expect(screen.getByText("No commands found.")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("opens with Cmd+K or Ctrl+K", async () => {
    const user = userEvent.setup();

    render(<ControlledCommandPalette />);

    await user.keyboard("{Meta>}k{/Meta}");
    expect(
      screen.getByRole("dialog", { name: "Command palette" })
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    expect(
      screen.getByRole("dialog", { name: "Command palette" })
    ).toBeInTheDocument();
  });
});
