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
