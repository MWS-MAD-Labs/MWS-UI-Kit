import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

function themeToggle() {
  return screen.getByRole("button", { name: "Dark theme" });
}

describe("App header", () => {
  beforeEach(() => {
    localStorage.removeItem("mws-theme");
    delete document.documentElement.dataset.theme;
  });

  it("renders with a stable accessible name on the theme toggle", () => {
    render(<App />);

    expect(themeToggle()).toHaveAttribute("aria-pressed", "false");
  });

  it("starts in the bootstrapped theme instead of resetting to light", () => {
    document.documentElement.dataset.theme = "dark";
    render(<App />);

    expect(themeToggle()).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles the theme and syncs the document and localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = themeToggle();
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("mws-theme")).toBe("dark");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("mws-theme")).toBe("light");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-navigation")).toBeNull();

    await user.click(menuButton);

    const mobileNav = document.getElementById("mobile-navigation");
    expect(mobileNav).not.toBeNull();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(
      within(mobileNav as HTMLElement).getByRole("link", { name: "AI Guide" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close navigation" })
    );

    expect(document.getElementById("mobile-navigation")).toBeNull();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
