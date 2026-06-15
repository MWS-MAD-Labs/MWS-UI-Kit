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
    id: "reports",
    label: "Open reports",
    description: "Review analytics",
  },
  {
    id: "disabled",
    label: "Disabled command",
    disabled: true,
  },
];

describe("CommandPalette", () => {
  it("renders searchable commands in a modal", async () => {
    const user = userEvent.setup();

    render(<CommandPalette open onOpenChange={vi.fn()} items={items} />);

    expect(
      screen.getByRole("dialog", { name: "Command palette" })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Search commands" })
      ).toHaveFocus();
    });
    expect(
      screen.getByRole("option", { name: /open students/i })
    ).toBeInTheDocument();
    expect(screen.getByText("⌘S")).toBeInTheDocument();

    await user.type(screen.getByRole("combobox"), "reports");

    expect(
      screen.queryByRole("option", { name: /open students/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /open reports/i })
    ).toBeInTheDocument();
  });

  it("selects the active command with Enter and closes", async () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    const itemSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onSelect={onSelect}
        items={[{ ...items[0], onSelect: itemSelect }, items[1]]}
      />
    );

    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith(items[1]);
    expect(itemSelect).not.toHaveBeenCalled();
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
        items={[items[2]]}
      />
    );

    await user.click(screen.getByRole("option", { name: /disabled command/i }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
