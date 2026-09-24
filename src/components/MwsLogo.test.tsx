import { render, screen } from "@testing-library/react";
import { MwsLogo } from "./MwsLogo";

describe("MwsLogo", () => {
  it.each(["crest", "horizontal", "vertical"] as const)(
    "renders the %s variant with an accessible title",
    (variant) => {
      render(<MwsLogo variant={variant} title={`MWS ${variant} logo`} />);

      const logo = screen.getByRole("img", { name: `MWS ${variant} logo` });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute(
        "src",
        `/images/brand/mws-logo-${variant}.png?v=20260721-2`
      );
    }
  );

  it("is hidden from assistive technology when used decoratively", () => {
    const { container } = render(<MwsLogo variant="crest" />);

    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("provides intrinsic dimensions and allows explicit overrides", () => {
    const { rerender } = render(<MwsLogo variant="crest" />);
    const logo = document.querySelector("img");

    expect(logo).toHaveAttribute("width", "512");
    expect(logo).toHaveAttribute("height", "512");

    rerender(<MwsLogo variant="crest" width={64} height={64} />);
    expect(logo).toHaveAttribute("width", "64");
    expect(logo).toHaveAttribute("height", "64");
  });

  it.each([
    ["crest", 512, 512],
    ["horizontal", 1200, 360],
    ["vertical", 720, 960],
  ] as const)(
    "gives the %s variant its intrinsic dimensions by default",
    (variant, width, height) => {
      render(<MwsLogo variant={variant} />);

      const logo = document.querySelector("img");
      expect(logo).toHaveAttribute("width", String(width));
      expect(logo).toHaveAttribute("height", String(height));
    }
  );

  it.each(["crest", "horizontal", "vertical"] as const)(
    "keeps the %s aspect ratio when only width is set",
    (variant) => {
      render(<MwsLogo variant={variant} width={96} />);

      const logo = document.querySelector("img");
      expect(logo).toHaveAttribute("width", "96");
      expect(logo).not.toHaveAttribute("height");
    }
  );

  it.each(["crest", "horizontal", "vertical"] as const)(
    "keeps the %s aspect ratio when only height is set",
    (variant) => {
      render(<MwsLogo variant={variant} height={72} />);

      const logo = document.querySelector("img");
      expect(logo).toHaveAttribute("height", "72");
      expect(logo).not.toHaveAttribute("width");
    }
  );

  it("supports a deployment-specific source override", () => {
    render(
      <MwsLogo
        variant="horizontal"
        src="https://cdn.example.com/mws-horizontal.png"
        title="MWS"
      />
    );

    expect(screen.getByRole("img", { name: "MWS" })).toHaveAttribute(
      "src",
      "https://cdn.example.com/mws-horizontal.png"
    );
  });
});
